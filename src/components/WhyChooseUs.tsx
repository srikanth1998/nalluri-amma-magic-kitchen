import { ShieldCheck, Leaf, ChefHat, Sparkles, Globe } from "lucide-react";

const reasons = [
  { icon: ChefHat, title: "Homemade & Authentic", desc: "Prepared in small batches just like at home" },
  { icon: ShieldCheck, title: "No Preservatives", desc: "100% natural with zero chemical additives" },
  { icon: Sparkles, title: "Traditional Recipes", desc: "Centuries-old family recipes preserved with care" },
  { icon: Leaf, title: "Freshly Prepared", desc: "Made fresh to order for maximum flavor" },
  { icon: Globe, title: "Worldwide Shipping", desc: "Delivering authentic taste across the globe" },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 bg-primary section-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-secondary font-heading italic text-sm uppercase tracking-widest mb-2">Why Nalluri Foods</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Why Choose <span className="text-secondary">Us?</span>
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {reasons.map((item, i) => (
            <div
              key={i}
              className="group text-center p-6 rounded-lg border border-primary-foreground/10 hover:bg-primary-foreground/5 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary-foreground mb-2">{item.title}</h3>
              <p className="text-primary-foreground/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
