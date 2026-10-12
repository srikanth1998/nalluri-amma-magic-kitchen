import { errorMessage, requiredEnv } from "./http.ts";

export type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  captured: boolean;
};

export function credentials() {
  return {
    keyId: requiredEnv("RAZORPAY_KEY_ID"),
    keySecret: requiredEnv("RAZORPAY_KEY_SECRET"),
  };
}

export async function razorpayRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description = body?.error?.description;
    throw new Error(typeof description === "string" ? description : `Razorpay request failed (${response.status})`);
  }
  return body as T;
}

export async function fetchAndCapturePayment(
  paymentId: string,
  expectedOrderId: string,
  expectedAmount: number,
): Promise<RazorpayPayment> {
  let payment = await razorpayRequest<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`);

  if (
    payment.order_id !== expectedOrderId ||
    payment.amount !== expectedAmount ||
    payment.currency !== "INR"
  ) {
    throw new Error("Payment details do not match the order");
  }

  if (payment.status === "authorized") {
    payment = await razorpayRequest<RazorpayPayment>(
      `/payments/${encodeURIComponent(paymentId)}/capture`,
      {
        method: "POST",
        body: JSON.stringify({ amount: expectedAmount, currency: "INR" }),
      },
    );
  }

  if (payment.status !== "captured" || !payment.captured) {
    throw new Error(`Payment is not captured (status: ${payment.status})`);
  }

  return payment;
}

export function razorpayError(error: unknown): string {
  const message = errorMessage(error);
  return message.includes("RAZORPAY_") ? "Payment gateway is not configured" : message;
}
