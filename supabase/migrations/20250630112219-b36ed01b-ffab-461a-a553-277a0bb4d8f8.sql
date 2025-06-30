
-- Fix the ambiguous column reference in the trigger function
CREATE OR REPLACE FUNCTION ensure_self_supplier_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    business_name TEXT;
    self_supplier_id UUID;
BEGIN
    -- Get business name
    SELECT b.name INTO business_name 
    FROM public.businesses b
    WHERE b.id = NEW.business_id;
    
    -- Ensure self-supplier exists
    SELECT create_self_supplier(NEW.business_id, business_name) INTO self_supplier_id;
    
    RETURN NEW;
END;
$$;
