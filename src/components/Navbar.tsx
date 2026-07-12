import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const links = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/#about" },
    { label: "Contact", to: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b-2 border-gold/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="font-heading text-2xl font-bold text-secondary">Nalluri Foods</span>
          <span className="text-xs text-primary-foreground/70 italic font-heading">Amma's Pure Magic</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}

          <Link to="/cart" className="relative text-primary-foreground hover:text-secondary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-primary-foreground hover:text-secondary"><User className="w-5 h-5" /></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/my-orders">My Orders</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin/orders"><LayoutDashboard className="w-4 h-4 mr-2" />Admin Panel</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition-all">Sign In</Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative text-primary-foreground">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          <button className="text-primary-foreground" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary border-t border-gold/20 px-4 pb-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setIsOpen(false)}
              className="block py-3 text-primary-foreground/80 hover:text-secondary transition-colors border-b border-primary-foreground/10">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setIsOpen(false)} className="block py-3 text-primary-foreground/80 border-b border-primary-foreground/10">My Orders</Link>
              {isAdmin && <Link to="/admin/orders" onClick={() => setIsOpen(false)} className="block py-3 text-primary-foreground/80 border-b border-primary-foreground/10">Admin Panel</Link>}
              <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-left py-3 text-primary-foreground/80">Sign Out</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="block mt-3 bg-secondary text-secondary-foreground px-5 py-2 rounded-md text-sm font-semibold text-center">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
