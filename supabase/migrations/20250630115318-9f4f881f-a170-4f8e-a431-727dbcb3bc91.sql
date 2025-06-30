
-- Remove duplicate Self-Produced suppliers, keeping only one per business
WITH ranked_suppliers AS (
  SELECT id, business_id, name,
         ROW_NUMBER() OVER (PARTITION BY business_id, name ORDER BY created_at ASC) as rn
  FROM public.suppliers 
  WHERE name = 'Self-Produced'
)
DELETE FROM public.suppliers 
WHERE id IN (
  SELECT id FROM ranked_suppliers WHERE rn > 1
);
