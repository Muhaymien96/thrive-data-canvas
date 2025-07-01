-- Test RPC function for creating organizations without authentication (for testing only)
CREATE OR REPLACE FUNCTION create_test_organization(
  p_name TEXT,
  p_owner_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_result JSONB;
BEGIN
  -- Create organization (no auth check for testing)
  INSERT INTO public.organizations (name, owner_id)
  VALUES (p_name, p_owner_id)
  RETURNING id INTO v_org_id;

  -- Create organization_user record for owner
  INSERT INTO public.organization_users (organization_id, user_id, role)
  VALUES (v_org_id, p_owner_id, 'owner');

  -- Return organization details
  SELECT jsonb_build_object(
    'id', o.id,
    'name', o.name,
    'owner_id', o.owner_id,
    'created_at', o.created_at
  )
  FROM public.organizations o
  WHERE o.id = v_org_id
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant RPC access to authenticated users
GRANT EXECUTE ON FUNCTION create_test_organization(TEXT, UUID) TO authenticated; 