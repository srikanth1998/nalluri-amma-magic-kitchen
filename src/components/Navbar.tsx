import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Why Us", href: "#why-us" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b-2 border-gold/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex flex-col">
          <span className="font-heading text-2xl font-bold text-secondary">Nalluri Foods</span>
          <span className="text-xs text-primary-foreground/70 italic font-heading">Amma's Pure Magic</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            className="bg-secondary text-secondary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition-all"
          >
            Shop Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-gold/20 px-4 pb-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-primary-foreground/80 hover:text-secondary transition-colors border-b border-primary-foreground/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            onClick={() => setIsOpen(false)}
            className="block mt-3 bg-secondary text-secondary-foreground px-5 py-2 rounded-md text-sm font-semibold text-center"
          >
            Shop Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
