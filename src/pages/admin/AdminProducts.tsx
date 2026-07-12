import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Product = {
  id: string; name: string; slug: string; description: string | null; price: number;
  image_url: string | null; category: string | null; stock: number; is_active: boolean;
};

const empty = { id: "", name: "", slug: "", description: "", price: 0, image_url: "", category: "", stock: 0, is_active: true };

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<typeof empty | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) toast.error(error.message);
    setProducts((data as Product[]) || []);
  };
  useEffect(() => { load(); }, []);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name, slug: editing.slug || slugify(editing.name),
      description: editing.description || null, price: Number(editing.price),
      image_url: editing.image_url || null, category: editing.category || null,
      stock: Number(editing.stock), is_active: editing.is_active,
    };
    if (!payload.name || payload.price < 0) return toast.error("Name and price required");
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false); setEditing(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  const openEdit = (p?: Product) => { setEditing(p ? { ...p, description: p.description || "", image_url: p.image_url || "", category: p.category || "" } : { ...empty }); setOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Products</h1>
        <Button onClick={() => openEdit()}><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead>
            <TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Active</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.image_url && <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />}</TableCell>
                <TableCell className="font-semibold">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>₹{Number(p.price).toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => del(p.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug (auto if empty)</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (₹)</Label><Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
                <div><Label>Stock</Label><Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Category</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="/products/foo.jpg or https://..." /></div>
              <div className="flex items-center gap-3"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
