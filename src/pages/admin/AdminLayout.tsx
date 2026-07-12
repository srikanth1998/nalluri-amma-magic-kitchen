import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ClipboardList, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-bg p-4 text-center">
      <h1 className="font-heading text-3xl font-bold mb-3">Admin Only</h1>
      <p className="text-muted-foreground mb-4">Your account does not have admin privileges.</p>
      <Link to="/"><Button>Back to site</Button></Link>
    </div>
  );

  const links = [
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
    { to: "/admin/products", label: "Products", icon: Package },
  ];

  return (
    <div className="min-h-screen flex bg-warm-bg">
      <aside className="w-60 bg-primary text-primary-foreground p-5 flex flex-col">
        <Link to="/" className="mb-8">
          <p className="font-heading text-xl font-bold text-secondary">Nalluri</p>
          <p className="text-xs opacity-70">Admin Panel</p>
        </Link>
        <nav className="space-y-1 flex-1">
          {links.map((l) => {
            const active = pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${active ? "bg-secondary text-secondary-foreground" : "hover:bg-primary-foreground/10"}`}>
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 pt-4 border-t border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100"><Home className="w-4 h-4" /> View Site</Link>
          <button onClick={signOut} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
