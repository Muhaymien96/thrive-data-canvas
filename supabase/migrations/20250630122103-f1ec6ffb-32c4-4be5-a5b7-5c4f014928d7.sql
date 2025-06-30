
-- Add customer_id and supplier_id foreign keys to transactions table
ALTER TABLE public.transactions 
ADD COLUMN customer_id UUID REFERENCES public.customers(id),
ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_supplier_id ON public.transactions(supplier_id);

-- Add a constraint to ensure only one of customer_id or supplier_id is set
ALTER TABLE public.transactions 
ADD CONSTRAINT check_customer_or_supplier 
CHECK (
  (customer_id IS NOT NULL AND supplier_id IS NULL) OR 
  (customer_id IS NULL AND supplier_id IS NOT NULL) OR 
  (customer_id IS NULL AND supplier_id IS NULL)
);
