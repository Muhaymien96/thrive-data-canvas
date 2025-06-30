
-- Step 1: Fix business type constraint by updating allowed values
ALTER TABLE public.businesses DROP CONSTRAINT IF EXISTS businesses_type_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_type_check 
  CHECK (type IN ('Agriculture', 'Food & Beverage', 'Technology', 'Manufacturing', 'Retail', 'Services', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Transportation', 'Other', 'Fish', 'Honey', 'Mushrooms'));

-- Step 2: Enable Row Level Security on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for businesses
CREATE POLICY "Users can view their own businesses" ON public.businesses
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own businesses" ON public.businesses
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own businesses" ON public.businesses
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own businesses" ON public.businesses
  FOR DELETE USING (owner_id = auth.uid());

-- Step 4: Create RLS policies for customers
CREATE POLICY "Users can view customers from their businesses" ON public.customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = customers.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage customers from their businesses" ON public.customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = customers.business_id AND b.owner_id = auth.uid()
    )
  );

-- Step 5: Create RLS policies for suppliers
CREATE POLICY "Users can view suppliers from their businesses" ON public.suppliers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = suppliers.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage suppliers from their businesses" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = suppliers.business_id AND b.owner_id = auth.uid()
    )
  );

-- Step 6: Create RLS policies for employees
CREATE POLICY "Users can view employees from their businesses" ON public.employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = employees.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage employees from their businesses" ON public.employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = employees.business_id AND b.owner_id = auth.uid()
    )
  );

-- Step 7: Create RLS policies for products
CREATE POLICY "Users can view products from their businesses" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = products.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage products from their businesses" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = products.business_id AND b.owner_id = auth.uid()
    )
  );

-- Step 8: Create RLS policies for transactions
CREATE POLICY "Users can view transactions from their businesses" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = transactions.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage transactions from their businesses" ON public.transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = transactions.business_id AND b.owner_id = auth.uid()
    )
  );
