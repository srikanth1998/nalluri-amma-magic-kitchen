import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const schema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_phone: z.string().trim().min(6).max(20),
  customer_email: z.string().trim().email().max(255).optional().or(z.literal("")),
  shipping_address: z.string().trim().min(5).max(500),
  city: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});

type PaymentOrder = {
  localOrderId: string;
  orderNumber: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) return resolve(true);
  const existing = document.getElementById("razorpay-checkout");
  if (existing) {
    existing.addEventListener("load", () => resolve(true), { once: true });
    existing.addEventListener("error", () => resolve(false), { once: true });
    return;
  }

  const script = document.createElement("script");
  script.id = "razorpay-checkout";
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const functionErrorMessage = async (error: unknown, fallback: string) => {
  const response = (error as { context?: Response } | null)?.context;
  if (response) {
    try {
      const payload = await response.json() as { error?: string };
      if (payload.error) return payload.error;
    } catch {
      // The SDK error message below is still useful if the response has no JSON body.
    }
  }
  return error instanceof Error ? error.message : fallback;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", customer_email: user?.email || "",
    shipping_address: "", city: "", pincode: "", notes: "",
  });

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty.");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error("Please fill in all required fields correctly.");
    setSubmitting(true);

    const checkoutLoaded = await loadRazorpay();
    if (!checkoutLoaded) {
      setSubmitting(false);
      return toast.error("Could not load the secure payment window. Please try again.");
    }

    const { data, error } = await supabase.functions.invoke<PaymentOrder>("create-razorpay-order", {
      body: {
        customer: parsed.data,
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      },
    });
    if (error || !data) {
      setSubmitting(false);
      return toast.error(await functionErrorMessage(error, "Failed to create payment order"));
    }

    const checkout = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Nalluri Foods",
      description: `Order #${data.orderNumber}`,
      order_id: data.razorpayOrderId,
      prefill: {
        name: parsed.data.customer_name,
        email: parsed.data.customer_email || "",
        contact: parsed.data.customer_phone,
      },
      theme: { color: "#1e3a8a" },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          toast.info("Payment cancelled. Your cart has been kept.");
        },
      },
      handler: async (response) => {
        const { data: verified, error: verifyError } = await supabase.functions.invoke<{
          success: boolean;
          orderNumber: number;
        }>("verify-razorpay-payment", {
          body: { localOrderId: data.localOrderId, ...response },
        });

        if (verifyError || !verified?.success) {
          setSubmitting(false);
          return toast.error(await functionErrorMessage(
            verifyError,
            "Payment was received but could not be verified. Contact support before paying again.",
          ));
        }

        clear();
        toast.success("Payment successful!");
        navigate(`/order-success?n=${verified.orderNumber}`);
      },
    });

    checkout.on("payment.failed", (response) => {
      setSubmitting(false);
      toast.error(response.error.description || "Payment failed. Please try again.");
    });
    checkout.open();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-warm-bg">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 bg-card p-6 rounded-lg border border-border">
              <h2 className="font-heading text-xl font-semibold">Shipping Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Full Name *</Label><Input required value={form.customer_name} onChange={upd("customer_name")} /></div>
                <div><Label>Phone *</Label><Input required type="tel" value={form.customer_phone} onChange={upd("customer_phone")} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={form.customer_email} onChange={upd("customer_email")} /></div>
              <div><Label>Address *</Label><Textarea required rows={3} value={form.shipping_address} onChange={upd("shipping_address")} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>City</Label><Input value={form.city} onChange={upd("city")} /></div>
                <div><Label>Pincode</Label><Input value={form.pincode} onChange={upd("pincode")} /></div>
              </div>
              <div><Label>Order Notes</Label><Textarea rows={2} value={form.notes} onChange={upd("notes")} /></div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border h-fit space-y-3">
              <h3 className="font-heading text-xl font-semibold">Order</h3>
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Button disabled={submitting} className="w-full" type="submit">
                {submitting ? "Opening secure payment..." : "Pay Securely"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Secure online payment powered by Razorpay.</p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
