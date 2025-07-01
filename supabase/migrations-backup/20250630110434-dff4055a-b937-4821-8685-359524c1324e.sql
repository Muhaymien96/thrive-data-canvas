
-- Add payment details and balance tracking to suppliers table
ALTER TABLE public.suppliers 
ADD COLUMN payment_details JSONB,
ADD COLUMN outstanding_balance NUMERIC DEFAULT 0,
ADD COLUMN last_payment_date DATE;

-- Add comment to explain payment_details structure
COMMENT ON COLUMN public.suppliers.payment_details IS 'JSON object containing bank details: {bank_name, account_number, account_holder, swift_code, reference}';
