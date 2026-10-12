import "@supabase/functions-js/edge-runtime.d.ts";
import { adminClient } from "../_shared/supabase.ts";
import { errorMessage, hmacSha256Hex, isRecord, json, requiredEnv, timingSafeEqual } from "../_shared/http.ts";

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";
    const expected = await hmacSha256Hex(requiredEnv("RAZORPAY_WEBHOOK_SECRET"), rawBody);
    if (!signature || !timingSafeEqual(expected, signature)) {
      return json({ error: "Invalid webhook signature" }, 401);
    }

    const event: unknown = JSON.parse(rawBody);
    if (!isRecord(event) || (event.event !== "payment.captured" && event.event !== "order.paid")) {
      return json({ received: true });
    }

    const payload = event.payload;
    if (!isRecord(payload) || !isRecord(payload.payment)) {
      return json({ error: "Invalid webhook payload" }, 400);
    }
    const payment = payload.payment.entity;
    if (!isRecord(payment) || typeof payment.order_id !== "string" || typeof payment.id !== "string") {
      return json({ error: "Invalid webhook payload" }, 400);
    }

    const supabase = adminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total, currency, payment_status, razorpay_payment_id")
      .eq("razorpay_order_id", payment.order_id)
      .single();
    if (orderError || !order) return json({ error: "Order not found" }, 404);

    if (
      Number(payment.amount) !== Math.round(Number(order.total) * 100) ||
      payment.currency !== order.currency ||
      payment.status !== "captured"
    ) {
      return json({ error: "Webhook payment does not match order" }, 400);
    }
    if (order.payment_status === "paid") {
      return order.razorpay_payment_id === payment.id
        ? json({ received: true })
        : json({ error: "Payment mismatch" }, 409);
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id: payment.id,
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .eq("id", order.id)
      .neq("payment_status", "paid");
    if (updateError) throw updateError;

    return json({ received: true });
  } catch (error) {
    console.error("razorpay-webhook:", errorMessage(error));
    return json({ error: "Webhook processing failed" }, 500);
  }
});
