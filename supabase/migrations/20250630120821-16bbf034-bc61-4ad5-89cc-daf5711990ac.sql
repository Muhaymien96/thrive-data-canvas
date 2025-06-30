
-- Add columns to products table for variant management
ALTER TABLE public.products 
ADD COLUMN parent_product_id UUID REFERENCES public.products(id),
ADD COLUMN variant_type TEXT,
ADD COLUMN variant_value TEXT,
ADD COLUMN sku TEXT UNIQUE,
ADD COLUMN is_bulk_item BOOLEAN DEFAULT FALSE,
ADD COLUMN conversion_factor NUMERIC DEFAULT 1;

-- Create index for better query performance
CREATE INDEX idx_products_parent_product_id ON public.products(parent_product_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_is_bulk_item ON public.products(is_bulk_item);

-- Add constraint to ensure SKU is required for all products
ALTER TABLE public.products 
ADD CONSTRAINT products_sku_required 
CHECK (sku IS NOT NULL AND sku != '');

-- Function to generate SKU automatically if not provided
CREATE OR REPLACE FUNCTION generate_product_sku()
RETURNS TRIGGER AS $$
BEGIN
    -- If SKU is not provided, generate one based on product name
    IF NEW.sku IS NULL OR NEW.sku = '' THEN
        NEW.sku := UPPER(LEFT(REPLACE(REPLACE(NEW.name, ' ', ''), '-', ''), 6)) || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate SKU
CREATE TRIGGER trigger_generate_product_sku
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION generate_product_sku();
