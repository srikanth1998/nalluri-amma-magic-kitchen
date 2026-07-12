import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, setQty, remove, subtotal, clear } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-warm-bg">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-8">Your Cart</h1>
          {items.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty.</p>
              <Link to="/shop"><Button>Browse Products</Button></Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border">
                    {it.image_url && <img src={it.image_url} alt={it.name} className="w-20 h-20 rounded object-cover" />}
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-foreground">{it.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{Number(it.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => setQty(it.id, it.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                      <span className="w-8 text-center font-semibold">{it.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => setQty(it.id, it.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={clear}>Clear cart</Button>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border h-fit space-y-4">
                <h3 className="font-heading text-xl font-semibold">Order Summary</h3>
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div>
                <Link to="/checkout"><Button className="w-full">Proceed to Checkout</Button></Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
