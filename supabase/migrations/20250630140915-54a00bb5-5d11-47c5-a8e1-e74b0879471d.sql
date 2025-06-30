
-- Create event_checklists table for market preparation tracking
CREATE TABLE public.event_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on event_checklists
ALTER TABLE public.event_checklists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_checklists
CREATE POLICY "Users can view their business event checklists" 
  ON public.event_checklists 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their business event checklists" 
  ON public.event_checklists 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their business event checklists" 
  ON public.event_checklists 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their business event checklists" 
  ON public.event_checklists 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

-- Create function to automatically create stock movements when transactions are made
CREATE OR REPLACE FUNCTION public.create_stock_movement_from_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create stock movements for sale transactions with product information
  IF NEW.type = 'sale' AND NEW.description IS NOT NULL AND NEW.description LIKE '%Product:%' THEN
    -- Extract product ID from description (assuming format "Product: product_name (ID: product_id)")
    DECLARE
      product_uuid UUID;
      product_quantity INTEGER := 1;
    BEGIN
      -- Try to extract product ID from description
      -- This is a simplified approach - in practice you'd want better product linking
      SELECT id INTO product_uuid 
      FROM public.products p 
      WHERE p.business_id = NEW.business_id 
        AND NEW.description ILIKE '%' || p.name || '%'
      LIMIT 1;
      
      -- If we found a product, create stock movement and update stock
      IF product_uuid IS NOT NULL THEN
        -- Create stock movement record
        INSERT INTO public.stock_movements (
          product_id,
          business_id,
          type,
          quantity,
          reason,
          reference,
          date
        ) VALUES (
          product_uuid,
          NEW.business_id,
          'out',
          product_quantity,
          'Product sale',
          'Transaction: ' || NEW.id,
          NEW.date
        );
        
        -- Update product stock level
        UPDATE public.products 
        SET 
          current_stock = GREATEST(0, COALESCE(current_stock, 0) - product_quantity),
          updated_at = now()
        WHERE id = product_uuid;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create stock movements
CREATE TRIGGER trigger_create_stock_movement_from_transaction
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.create_stock_movement_from_transaction();

-- Create function to update product stock when stock movements are manually created
CREATE OR REPLACE FUNCTION public.update_product_stock_from_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update product stock based on movement type
  IF NEW.type = 'in' THEN
    -- Stock coming in - add to current stock
    UPDATE public.products 
    SET 
      current_stock = COALESCE(current_stock, 0) + NEW.quantity,
      updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF NEW.type = 'out' THEN
    -- Stock going out - subtract from current stock
    UPDATE public.products 
    SET 
      current_stock = GREATEST(0, COALESCE(current_stock, 0) - NEW.quantity),
      updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF NEW.type = 'adjustment' THEN
    -- Stock adjustment - set to specific level
    UPDATE public.products 
    SET 
      current_stock = NEW.quantity,
      updated_at = now()
    WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update product stock from movements
CREATE TRIGGER trigger_update_product_stock_from_movement
  AFTER INSERT ON public.stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_stock_from_movement();

-- Add indexes for better performance
CREATE INDEX idx_event_checklists_event_id ON public.event_checklists(event_id);
CREATE INDEX idx_event_checklists_business_id ON public.event_checklists(business_id);
CREATE INDEX idx_event_checklists_priority ON public.event_checklists(priority);
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_business_id ON public.stock_movements(business_id);
CREATE INDEX idx_stock_movements_date ON public.stock_movements(date);
