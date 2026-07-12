
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Replace the always-true insert policies with meaningful checks
DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Create orders with valid customer" ON public.orders FOR INSERT
  WITH CHECK (
    length(customer_name) > 0
    AND length(customer_phone) >= 6
    AND length(shipping_address) > 0
    AND (auth.uid() IS NULL OR auth.uid() = user_id OR user_id IS NULL)
  );

DROP POLICY "Anyone can create order items" ON public.order_items;
CREATE POLICY "Create order items for existing orders" ON public.order_items FOR INSERT
  WITH CHECK (
    quantity > 0 AND unit_price >= 0
    AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id)
  );
