-- Create a stored procedure to create business users that bypasses RLS
CREATE OR REPLACE FUNCTION create_business_user(
  p_business_id UUID,
  p_user_id UUID,
  p_role TEXT,
  p_full_name TEXT,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Insert the business user record
  INSERT INTO public.business_users (
    business_id,
    user_id,
    role,
    full_name,
    email
  )
  VALUES (
    p_business_id,
    p_user_id,
    p_role::user_role,
    p_full_name,
    p_email
  )
  RETURNING jsonb_build_object(
    'id', id,
    'business_id', business_id,
    'user_id', user_id,
    'role', role,
    'full_name', full_name,
    'email', email,
    'created_at', created_at
  ) INTO v_result;

  RETURN v_result;
END;
$$; 