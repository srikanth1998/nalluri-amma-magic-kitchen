ALTER TABLE public.orders
  ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'manual'
    CHECK (payment_method IN ('manual', 'razorpay')),
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'created', 'paid', 'failed', 'refunded')),
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR'
    CHECK (currency = upper(currency) AND length(currency) = 3),
  ADD COLUMN razorpay_order_id TEXT UNIQUE,
  ADD COLUMN razorpay_payment_id TEXT UNIQUE,
  ADD COLUMN paid_at TIMESTAMPTZ;

CREATE INDEX orders_payment_status_idx ON public.orders (payment_status);

-- Checkout now goes through the Edge Function so clients cannot choose prices or totals.
DROP POLICY IF EXISTS "Create orders with valid customer" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Create order items for existing orders" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;
