import "@supabase/functions-js/edge-runtime.d.ts";
import { adminClient } from "../_shared/supabase.ts";
import { corsHeaders, errorMessage, hmacSha256Hex, isRecord, json, timingSafeEqual } from "../_shared/http.ts";
import { credentials, fetchAndCapturePayment, razorpayError } from "../_shared/razorpay.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) return json({ error: "Invalid payment response" }, 400);

    const localOrderId = body.localOrderId;
    const paymentId = body.razorpay_payment_id;
    const returnedOrderId = body.razorpay_order_id;
    const signature = body.razorpay_signature;
    if (![localOrderId, paymentId, returnedOrderId, signature].every((value) => typeof value === "string" && value)) {
      return json({ error: "Incomplete payment response" }, 400);
    }

    const supabase = adminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, total, currency, payment_status, razorpay_order_id, razorpay_payment_id")
      .eq("id", localOrderId as string)
      .single();
    if (orderError || !order) return json({ error: "Order not found" }, 404);

    if (order.razorpay_order_id !== returnedOrderId) {
      return json({ error: "Payment order mismatch" }, 400);
    }
    if (order.payment_status === "paid") {
      if (order.razorpay_payment_id !== paymentId) return json({ error: "Payment mismatch" }, 409);
      return json({ success: true, orderNumber: order.order_number });
    }

    const expectedSignature = await hmacSha256Hex(
      credentials().keySecret,
      `${order.razorpay_order_id}|${paymentId}`,
    );
    if (!timingSafeEqual(expectedSignature, signature as string)) {
      return json({ error: "Invalid payment signature" }, 400);
    }

    const amount = Math.round(Number(order.total) * 100);
    await fetchAndCapturePayment(paymentId as string, order.razorpay_order_id, amount);

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id: paymentId,
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .eq("id", order.id)
      .neq("payment_status", "paid");
    if (updateError) throw updateError;

    return json({ success: true, orderNumber: order.order_number });
  } catch (error) {
    console.error("verify-razorpay-payment:", errorMessage(error));
    return json({ error: razorpayError(error) }, 500);
  }
});
