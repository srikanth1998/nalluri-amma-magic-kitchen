import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const [sp] = useSearchParams();
  const n = sp.get("n");
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-warm-bg flex items-center">
        <div className="container mx-auto px-4 max-w-xl text-center bg-card p-10 rounded-lg border border-border">
          <CheckCircle2 className="w-20 h-20 mx-auto text-green-600 mb-4" />
          <h1 className="font-heading text-4xl font-bold mb-3">Thank You!</h1>
          <p className="text-muted-foreground mb-2">Your order has been placed successfully.</p>
          {n && <p className="font-heading text-lg">Order #<span className="text-accent font-bold">{n}</span></p>}
          <p className="text-sm text-muted-foreground mt-4 mb-6">We'll contact you shortly on your phone to confirm details.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
            <Link to="/my-orders"><Button>My Orders</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
