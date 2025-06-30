
-- Fix the ambiguous column reference in the create_self_supplier function
CREATE OR REPLACE FUNCTION create_self_supplier(business_id UUID, business_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    supplier_id UUID;
BEGIN
    -- Check if self-supplier already exists for this business
    -- Use table alias to avoid ambiguous column reference
    SELECT s.id INTO supplier_id 
    FROM public.suppliers s
    WHERE s.business_id = $1 AND s.name = 'Self-Produced';
    
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
