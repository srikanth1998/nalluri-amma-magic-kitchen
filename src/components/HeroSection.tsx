import heroImage from "@/assets/hero-cooking.jpg";
import borderPattern from "@/assets/border-pattern.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Traditional South Indian woman cooking with love"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-secondary font-heading italic text-lg mb-3">~ Amma's Pure Magic ~</p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Authentic Flavors,{" "}
            <span className="text-secondary">Feels Like Home</span> 🏠
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-light">
            Handmade with love, rooted in tradition. Experience the warmth of South Indian kitchens in every bite.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold text-lg hover:brightness-110 transition-all hover:scale-105"
            >
              Shop Now
            </a>
            <a
              href="#products"
              className="border-2 border-primary-foreground/40 text-primary-foreground px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary-foreground/10 transition-all"
            >
              Explore Products
            </a>
          </div>
        </div>
      </div>

      {/* Bottom border pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <img
          src={borderPattern}
          alt=""
          className="w-full h-16 object-cover opacity-40"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default HeroSection;
