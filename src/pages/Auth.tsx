import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(6).max(72);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const eR = emailSchema.safeParse(email);
    const pR = passwordSchema.safeParse(password);
    if (!eR.success || !pR.success) return toast.error("Enter a valid email and password (min 6 chars).");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const eR = emailSchema.safeParse(email);
    const pR = passwordSchema.safeParse(password);
    if (!eR.success || !pR.success) return toast.error("Enter a valid email and password (min 6 chars).");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! You can now sign in.");
  };

  return (
    <div className="min-h-screen bg-warm-bg section-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8 shadow-lg">
        <Link to="/" className="block text-center mb-6">
          <h1 className="font-heading text-3xl font-bold text-primary">Nalluri Foods</h1>
          <p className="text-xs italic text-muted-foreground">Amma's Pure Magic</p>
        </Link>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign In"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div><Label>Full Name</Label><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} /></div>
              <div><Label>Phone</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} /></div>
              <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button disabled={loading} className="w-full">{loading ? "Creating..." : "Create Account"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
