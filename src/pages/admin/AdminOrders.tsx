import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const STATUSES = ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"] as const;

type Order = {
  id: string; order_number: number; customer_name: string; customer_phone: string;
  customer_email: string | null; shipping_address: string; city: string | null; pincode: string | null;
  notes: string | null; total: number; status: string; created_at: string;
  order_items: { product_name: string; quantity: number; unit_price: number; line_total: number }[];
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter as typeof STATUSES[number]);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as typeof STATUSES[number] }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead><TableHead>Customer</TableHead><TableHead>Phone</TableHead>
              <TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              : orders.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders</TableCell></TableRow>
              : orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-semibold">{o.order_number}</TableCell>
                  <TableCell>{o.customer_name}</TableCell>
                  <TableCell>{o.customer_phone}</TableCell>
                  <TableCell>₹{Number(o.total).toFixed(2)}</TableCell>
                  <TableCell><Badge>{o.status}</Badge></TableCell>
                  <TableCell className="text-xs">{new Date(o.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline"><Eye className="w-3 h-3" /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle>Order #{o.order_number}</DialogTitle></DialogHeader>
                          <div className="space-y-3 text-sm">
                            <div><b>Customer:</b> {o.customer_name} — {o.customer_phone}</div>
                            {o.customer_email && <div><b>Email:</b> {o.customer_email}</div>}
                            <div><b>Address:</b> {o.shipping_address}{o.city ? `, ${o.city}` : ""}{o.pincode ? ` - ${o.pincode}` : ""}</div>
                            {o.notes && <div><b>Notes:</b> {o.notes}</div>}
                            <div className="border-t pt-3">
                              <b>Items:</b>
                              <ul className="mt-1 space-y-1">
                                {o.order_items.map((i, idx) => (
                                  <li key={idx} className="flex justify-between">
                                    <span>{i.product_name} × {i.quantity}</span>
                                    <span>₹{Number(i.line_total).toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2">
                              <span>Total</span><span>₹{Number(o.total).toFixed(2)}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
