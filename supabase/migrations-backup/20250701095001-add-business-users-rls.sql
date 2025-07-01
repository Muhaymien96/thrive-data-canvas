-- Add RLS policies for business_users table
CREATE POLICY "Users can view business users from their businesses" ON public.business_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_users.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create business users for their businesses" ON public.business_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update business users from their businesses" ON public.business_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_users.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete business users from their businesses" ON public.business_users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_users.business_id AND b.owner_id = auth.uid()
    )
  ); 