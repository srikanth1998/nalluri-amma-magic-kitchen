import { MessageCircle, Instagram, Send } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi! I'm ${formData.name}. ${formData.message}. My number: ${formData.phone}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-warm-bg section-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-heading italic text-sm uppercase tracking-widest mb-2">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Order <span className="text-accent">Now</span>
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Quick connect */}
          <div className="space-y-6">
            <h3 className="font-heading text-2xl font-semibold text-foreground">Quick Connect</h3>
            <p className="text-muted-foreground">
              Reach out to us directly via WhatsApp or Instagram. We're always happy to help!
            </p>
            <div className="space-y-4">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-green-400 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">Chat with us instantly</p>
                </div>
              </a>
              <a
                href="https://instagram.com/nallurifoods"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-pink-400 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Instagram</p>
                  <p className="text-muted-foreground text-sm">Follow us @nallurifoods</p>
                </div>
              </a>
            </div>
          </div>

          {/* Order form */}
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">Quick Order</h3>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="What would you like to order?"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <Send className="w-4 h-4" />
              Send Order via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
