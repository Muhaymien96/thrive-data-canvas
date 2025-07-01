
-- Add supplier_id foreign key column to products table
ALTER TABLE public.products 
ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id);

-- Create index for better query performance
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);

-- Create a function to automatically create a self-supplier for a business
CREATE OR REPLACE FUNCTION create_self_supplier(business_id UUID, business_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    supplier_id UUID;
BEGIN
    -- Check if self-supplier already exists for this business
    SELECT id INTO supplier_id 
    FROM public.suppliers 
    WHERE business_id = $1 AND name = 'Self-Produced';
    
    -- If not found, create one
    IF supplier_id IS NULL THEN
        INSERT INTO public.suppliers (
            business_id,
            name,
            category,
            rating,
            total_spent,
            outstanding_balance
        ) VALUES (
            $1,
            'Self-Produced',
            'Internal Production',
            5,
            0,
            0
        )
        RETURNING id INTO supplier_id;
    END IF;
    
    RETURN supplier_id;
END;
$$;

-- Create a trigger function to ensure self-supplier exists when creating products
CREATE OR REPLACE FUNCTION ensure_self_supplier_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    business_name TEXT;
    self_supplier_id UUID;
BEGIN
    -- Get business name
    SELECT name INTO business_name 
    FROM public.businesses 
    WHERE id = NEW.business_id;
    
    -- Ensure self-supplier exists
    SELECT create_self_supplier(NEW.business_id, business_name) INTO self_supplier_id;
    
    RETURN NEW;
END;
$$;

-- Create trigger to run before inserting products
CREATE TRIGGER ensure_self_supplier_before_product_insert
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION ensure_self_supplier_exists();
