import sambarKaram from "@/assets/products/sambar-karam.jpg";
import godduKaram from "@/assets/products/goddu-karam.jpg";
import podulu from "@/assets/products/podulu.jpg";
import vegPickles from "@/assets/products/veg-pickles.jpg";
import nonvegPickles from "@/assets/products/nonveg-pickles.jpg";
import sweets from "@/assets/products/sweets.jpg";
import snacks from "@/assets/products/snacks.jpg";

const products = [
  { name: "Sambar Karam", desc: "Aromatic spice blend for the perfect sambar, made with hand-roasted lentils & chilies.", image: sambarKaram },
  { name: "Goddu Karam", desc: "Fiery red chili powder with garlic — the soul of every South Indian meal.", image: godduKaram },
  { name: "Podulu", desc: "Traditional spice powders — peanut, sesame, flax & more for your daily rice plate.", image: podulu },
  { name: "Veg Pickles", desc: "Sun-ripened mango, tangy lemon & mixed vegetable pickles in pure mustard oil.", image: vegPickles },
  { name: "Non-Veg Pickles", desc: "Succulent chicken & prawn pickles marinated in secret family spice blends.", image: nonvegPickles },
  { name: "Sweets", desc: "Handmade Mysore Pak, Laddu & traditional sweets for festive celebrations.", image: sweets },
  { name: "Snacks", desc: "Crispy murukku, ribbon pakoda & banana chips — perfect tea-time companions.", image: snacks },
];

const ProductsSection = () => {
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
          {products.map((product, i) => (
            <div
              key={i}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.desc}</p>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-accent text-accent-foreground px-5 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
