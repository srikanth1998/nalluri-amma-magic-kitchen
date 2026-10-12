import "@supabase/functions-js/edge-runtime.d.ts";
import { adminClient, optionalUserId } from "../_shared/supabase.ts";
import { corsHeaders, errorMessage, isRecord, json } from "../_shared/http.ts";
import { credentials, razorpayError, razorpayRequest } from "../_shared/razorpay.ts";

type CartItem = { product_id: string; quantity: number };
type Product = { id: string; name: string; price: number; stock: number };
type RazorpayOrder = { id: string; amount: number; currency: string };

const text = (value: unknown, max: number, required = false): string | null => {
  if (typeof value !== "string") return required ? null : "";
  const result = value.trim();
  if ((required && !result) || result.length > max) return null;
  return result;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabase = adminClient();
  let localOrderId: string | null = null;

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || !isRecord(body.customer) || !Array.isArray(body.items)) {
      return json({ error: "Invalid checkout request" }, 400);
    }

    const customerName = text(body.customer.customer_name, 100, true);
    const customerPhone = text(body.customer.customer_phone, 20, true);
    const customerEmail = text(body.customer.customer_email, 255);
    const shippingAddress = text(body.customer.shipping_address, 500, true);
    const city = text(body.customer.city, 100);
    const pincode = text(body.customer.pincode, 20);
    const notes = text(body.customer.notes, 500);

    if (!customerName || !customerPhone || customerPhone.length < 6 || !shippingAddress) {
      return json({ error: "Invalid customer details" }, 400);
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return json({ error: "Invalid email address" }, 400);
    }
    if (body.items.length === 0 || body.items.length > 50) {
      return json({ error: "Cart must contain between 1 and 50 products" }, 400);
    }

    const quantities = new Map<string, number>();
    for (const raw of body.items) {
      if (!isRecord(raw) || typeof raw.product_id !== "string" || !Number.isInteger(raw.quantity)) {
        return json({ error: "Invalid cart item" }, 400);
      }
      const quantity = raw.quantity as number;
      if (quantity < 1 || quantity > 99) return json({ error: "Invalid product quantity" }, 400);
      quantities.set(raw.product_id, (quantities.get(raw.product_id) ?? 0) + quantity);
      if (quantities.get(raw.product_id)! > 99) return json({ error: "Invalid product quantity" }, 400);
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock")
      .in("id", [...quantities.keys()])
      .eq("is_active", true);
    if (productsError) throw productsError;
    if (!products || products.length !== quantities.size) {
      return json({ error: "One or more products are unavailable" }, 400);
    }

    const orderItems = (products as Product[]).map((product) => {
      const quantity = quantities.get(product.id)!;
      if (product.stock < quantity) throw new Error(`${product.name} does not have enough stock`);
      const unitPrice = Number(product.price);
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: unitPrice,
        quantity,
        line_total: Number((unitPrice * quantity).toFixed(2)),
      };
    });
    const total = Number(orderItems.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));
    const amount = Math.round(total * 100);
    if (amount < 100) return json({ error: "Order total is below the minimum payment amount" }, 400);

    const userId = await optionalUserId(supabase, request.headers.get("Authorization"));
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        city: city || null,
        pincode: pincode || null,
        notes: notes || null,
        subtotal: total,
        total,
        currency: "INR",
        payment_method: "razorpay",
        payment_status: "pending",
      })
      .select("id, order_number")
      .single();
    if (orderError || !order) throw orderError ?? new Error("Could not create order");
    localOrderId = order.id;

    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({ ...item, order_id: order.id })),
    );
    if (itemsError) throw itemsError;

    const razorpayOrder = await razorpayRequest<RazorpayOrder>("/orders", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `nalluri_${order.order_number}`,
        notes: { local_order_id: order.id },
      }),
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id, payment_status: "created" })
      .eq("id", order.id);
    if (updateError) throw updateError;

    return json({
      localOrderId: order.id,
      orderNumber: order.order_number,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: credentials().keyId,
    });
  } catch (error) {
    console.error("create-razorpay-order:", errorMessage(error));
    if (localOrderId) await supabase.from("orders").delete().eq("id", localOrderId);
    return json({ error: razorpayError(error) }, 500);
  }
});
