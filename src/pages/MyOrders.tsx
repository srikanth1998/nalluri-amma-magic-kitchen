import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string; order_number: number; total: number; status: string; created_at: string;
  order_items: { product_name: string; quantity: number; line_total: number }[];
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders")
      .select("id, order_number, total, status, created_at, order_items(product_name, quantity, line_total)")
      .eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) || []));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-warm-bg">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold mb-8">My Orders</h1>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-accent underline">Start shopping</Link>.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-card border border-border p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-heading font-semibold">Order #{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <Badge>{o.status}</Badge>
                  </div>
                  <div className="text-sm space-y-1 mb-3">
                    {o.order_items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{i.product_name} × {i.quantity}</span>
                        <span>₹{Number(i.line_total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span><span>₹{Number(o.total).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
