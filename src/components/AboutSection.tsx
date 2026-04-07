import { Heart, Leaf, Flame } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 section-pattern bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-heading italic text-sm uppercase tracking-widest mb-2">Our Story</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
            Generations of <span className="text-accent">Love</span> & Tradition
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8 rounded-full" />
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            At Nalluri Foods, every recipe tells a story — passed down through generations of
            South Indian households. Our founder's grandmother would wake before dawn, hand-grinding
            spices on a stone mortar, filling the kitchen with aromas that became the heartbeat of the family.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Today, we carry that same spirit. Every jar of pickle, every packet of podi, is made with
            the same love, the same patience, and the same time-honored methods. No shortcuts, no
            preservatives — just pure, authentic flavors that taste like home.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every product is crafted with the warmth of a mother's kitchen" },
              { icon: Leaf, title: "100% Natural", desc: "Pure ingredients, no preservatives, no artificial flavors" },
              { icon: Flame, title: "Traditional Methods", desc: "Stone-ground, sun-dried, slow-cooked the authentic way" },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-lg bg-card border border-border hover:border-secondary/50 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                  <item.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
