/// <reference types="vite/client" />

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error: { description?: string };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
};

interface Window {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
    on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
  };
}
