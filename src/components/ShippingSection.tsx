import { Plane, Package, Clock, MapPin } from "lucide-react";

const ShippingSection = () => {
  return (
    <section className="py-20 bg-secondary/10 section-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6">
            <Plane className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-foreground">Shipping Across India & International ✈️</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            From Our Kitchen to <span className="text-accent">Your Doorstep</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            We deliver the taste of home anywhere in the world. Every order is carefully packed to preserve freshness and flavor.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Package, title: "Safe Packaging", desc: "Triple-sealed, food-grade packaging to lock in freshness" },
              { icon: Clock, title: "Fast Delivery", desc: "Dispatched within 24-48 hours of preparation" },
              { icon: MapPin, title: "Pan-India & Global", desc: "Delivering to every corner of India and 20+ countries" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-lg bg-card border border-border">
                <item.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingSection;
