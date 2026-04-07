import { Instagram, MessageCircle, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-secondary mb-1">Nalluri Foods</h3>
            <p className="text-primary-foreground/60 italic font-heading text-sm mb-4">Amma's Pure Magic</p>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">
              Bringing the authentic taste of South Indian homes to your kitchen, one recipe at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-secondary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Products", "Why Us", "Testimonials", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-secondary mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="https://wa.me/919999999999" className="flex items-center gap-3 text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href="https://instagram.com/nallurifoods" className="flex items-center gap-3 text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                <Instagram className="w-4 h-4" /> @nallurifoods
              </a>
              <a href="mailto:info@nallurifoods.com" className="flex items-center gap-3 text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                <Mail className="w-4 h-4" /> info@nallurifoods.com
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-3 text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                <Phone className="w-4 h-4" /> +91 99999 99999
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} Nalluri Foods. All rights reserved. Made with ❤️ in South India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
