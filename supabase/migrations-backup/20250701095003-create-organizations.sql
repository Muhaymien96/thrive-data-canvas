-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

-- Create organization_users table
CREATE TABLE public.organization_users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(organization_id, user_id)
);

-- Add organization_id to businesses table
ALTER TABLE public.businesses 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Create invites table
CREATE TABLE public.invites (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
  invite_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_users ou 
      WHERE ou.organization_id = id AND ou.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );

CREATE POLICY "Organization owners can update their organizations" ON public.organizations
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

-- RLS Policies for organization_users
CREATE POLICY "Users can view organization users in their organizations" ON public.organization_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can manage organization users" ON public.organization_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

-- RLS Policies for invites
CREATE POLICY "Users can view invites for their organizations" ON public.invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can create invites" ON public.invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update invites" ON public.invites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

-- Create function to generate invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$;

-- Create function to create organization with owner
CREATE OR REPLACE FUNCTION create_organization_with_owner(
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
  -- Verify the owner_id matches the authenticated user
  IF p_owner_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to create organization for another user';
  END IF;

  -- Create organization
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
GRANT EXECUTE ON FUNCTION create_organization_with_owner(TEXT, UUID) TO authenticated; 