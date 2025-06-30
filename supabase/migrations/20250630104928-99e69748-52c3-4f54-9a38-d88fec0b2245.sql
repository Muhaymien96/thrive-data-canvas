
-- Create compliance_items table
CREATE TABLE public.compliance_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  due_date date,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time text NOT NULL,
  location text,
  type text NOT NULL DEFAULT 'meeting' CHECK (type IN ('meeting', 'delivery', 'inspection', 'maintenance', 'market')),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create stock_movements table
CREATE TABLE public.stock_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL,
  business_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity integer NOT NULL,
  reason text NOT NULL,
  reference text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number text NOT NULL,
  customer_id uuid,
  customer_name text NOT NULL,
  business_id uuid NOT NULL,
  issue_date date NOT NULL,
  due_date date,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(invoice_number, business_id)
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.compliance_items ADD CONSTRAINT compliance_items_business_id_fkey 
  FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE public.events ADD CONSTRAINT events_business_id_fkey 
  FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE public.stock_movements ADD CONSTRAINT stock_movements_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.stock_movements ADD CONSTRAINT stock_movements_business_id_fkey 
  FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE public.invoices ADD CONSTRAINT invoices_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

ALTER TABLE public.invoices ADD CONSTRAINT invoices_business_id_fkey 
  FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE public.invoice_items ADD CONSTRAINT invoice_items_invoice_id_fkey 
  FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for compliance_items
CREATE POLICY "Users can view compliance items from their businesses" ON public.compliance_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = compliance_items.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage compliance items from their businesses" ON public.compliance_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = compliance_items.business_id AND b.owner_id = auth.uid()
    )
  );

-- Create RLS policies for events
CREATE POLICY "Users can view events from their businesses" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = events.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage events from their businesses" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = events.business_id AND b.owner_id = auth.uid()
    )
  );

-- Create RLS policies for stock_movements
CREATE POLICY "Users can view stock movements from their businesses" ON public.stock_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = stock_movements.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage stock movements from their businesses" ON public.stock_movements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = stock_movements.business_id AND b.owner_id = auth.uid()
    )
  );

-- Create RLS policies for invoices
CREATE POLICY "Users can view invoices from their businesses" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = invoices.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage invoices from their businesses" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = invoices.business_id AND b.owner_id = auth.uid()
    )
  );

-- Create RLS policies for invoice_items
CREATE POLICY "Users can view invoice items from their businesses" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      JOIN public.businesses b ON b.id = i.business_id
      WHERE i.id = invoice_items.invoice_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage invoice items from their businesses" ON public.invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      JOIN public.businesses b ON b.id = i.business_id
      WHERE i.id = invoice_items.invoice_id AND b.owner_id = auth.uid()
    )
  );

-- Enable realtime for all new tables
ALTER TABLE public.compliance_items REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.stock_movements REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.invoice_items REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.compliance_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_movements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoice_items;
