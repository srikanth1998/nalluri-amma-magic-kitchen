import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: string; name: string; description: string | null; price: number;
  image_url: string | null; stock: number;
};

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { add } = useCart();

  useEffect(() => {
    supabase.from("products").select("id, name, description, price, image_url, stock")
      .eq("is_active", true).order("name").limit(8)
      .then(({ data }) => setProducts((data as Product[]) || []));
  }, []);

  return (
    <section id="products" className="py-20 bg-warm-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-heading italic text-sm uppercase tracking-widest mb-2">Our Products</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Taste the <span className="text-secondary">Tradition</span>
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <div className="overflow-hidden aspect-square bg-muted">
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{p.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-bold text-primary">₹{Number(p.price).toFixed(0)}</span>
                  <Button size="sm" disabled={p.stock <= 0}
                    onClick={() => { add({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url }); toast.success(`${p.name} added to cart`); }}>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {p.stock <= 0 ? "Sold Out" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop">
            <Button size="lg" variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
