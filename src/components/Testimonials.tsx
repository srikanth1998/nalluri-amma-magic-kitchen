import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Reddy",
    location: "Hyderabad",
    text: "The sambar karam tastes exactly like what my grandmother used to make. I'm so happy I found Nalluri Foods!",
  },
  {
    name: "Srinivas K.",
    location: "Bangalore",
    text: "Living away from home, these pickles bring back so many memories. Authentic and pure — you can taste the love.",
  },
  {
    name: "Lakshmi Devi",
    location: "Chennai",
    text: "The podulu collection is amazing! My kids love the peanut podi with hot rice and ghee. Just like home cooking.",
  },
  {
    name: "Ravi Teja",
    location: "USA",
    text: "International shipping is a lifesaver! The packaging was perfect and the taste was absolutely fresh. 5 stars!",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-heading italic text-sm uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-secondary">Family</span> Says
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm italic leading-relaxed mb-4">"{t.text}"</p>
              <div className="border-t border-border pt-3">
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
