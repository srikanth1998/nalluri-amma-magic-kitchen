import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: string; name: string; description: string | null; price: number;
  image_url: string | null; category: string | null; stock: number;
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    supabase.from("products").select("*").eq("is_active", true).order("name")
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-warm-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-heading italic text-sm uppercase tracking-widest mb-2">Shop</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Our <span className="text-secondary">Products</span></h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="overflow-hidden aspect-square bg-muted">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {p.category && <p className="text-xs text-accent font-heading italic uppercase tracking-wide mb-1">{p.category}</p>}
                    <h3 className="font-heading text-xl font-semibold mb-2">{p.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-2xl font-bold text-primary">₹{Number(p.price).toFixed(0)}</span>
                      <Button
                        size="sm"
                        onClick={() => { add({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url }); toast.success(`${p.name} added to cart`); }}
                        disabled={p.stock <= 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {p.stock <= 0 ? "Sold Out" : "Add"}
                      </Button>
                    </div>
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

export default Shop;
