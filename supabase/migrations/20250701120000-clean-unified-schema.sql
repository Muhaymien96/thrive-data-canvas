-- Clean Database Schema Migration
-- This migration drops all existing tables and creates a unified, consistent schema

-- Drop all existing tables in the correct order (dependencies first)
DROP TABLE IF EXISTS public.transaction_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.stock_movements CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.invites CASCADE;
DROP TABLE IF EXISTS public.business_access_requests CASCADE;
DROP TABLE IF EXISTS public.organization_users CASCADE;
DROP TABLE IF EXISTS public.business_users CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.payment_method CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.user_has_business_access(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_business_user(UUID, UUID, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.create_organization_with_owner(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_invite_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'employee');
CREATE TYPE public.transaction_type AS ENUM ('sale', 'refund', 'expense', 'employee_cost');
CREATE TYPE public.payment_method AS ENUM ('card', 'cash', 'yoco', 'bank_transfer');
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'overdue', 'partial');

-- 1. Organizations Table (Top-level entity)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

-- 2. Organization Users (Who belongs to which organization)
CREATE TABLE public.organization_users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'employee',
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(organization_id, user_id)
);

-- 3. Businesses (Belong to organizations)
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Fish', 'Honey', 'Mushrooms')),
  description TEXT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 4. Customers
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_purchase DATE,
  invoice_preference TEXT DEFAULT 'email' CHECK (invoice_preference IN ('email', 'print', 'both')),
  payment_terms INTEGER DEFAULT 30,
  outstanding_balance DECIMAL(10,2) DEFAULT 0,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 5. Suppliers
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  last_order DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 6. Employees
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  position TEXT,
  hourly_rate DECIMAL(8,2),
  salary DECIMAL(10,2),
  start_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  payment_method TEXT DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'cash', 'check')),
  bank_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 7. Products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  current_stock INTEGER DEFAULT 0,
  unit TEXT,
  description TEXT,
  supplier_name TEXT,
  min_stock_level INTEGER DEFAULT 0,
  max_stock INTEGER,
  markup_percentage DECIMAL(5,2),
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 8. Transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT,
  payment_method public.payment_method,
  payment_status public.payment_status DEFAULT 'pending',
  due_date DATE,
  amount_paid DECIMAL(10,2),
  invoice_number TEXT,
  invoice_generated BOOLEAN DEFAULT false,
  invoice_date DATE,
  yoco_transaction_id TEXT,
  yoco_fee DECIMAL(8,2),
  yoco_net_amount DECIMAL(10,2),
  yoco_card_type TEXT,
  yoco_reference TEXT,
  cash_received DECIMAL(10,2),
  cash_change DECIMAL(10,2),
  employee_id UUID REFERENCES public.employees(id),
  employee_name TEXT,
  cost_type TEXT CHECK (cost_type IN ('salary', 'wages', 'benefits', 'bonus', 'overtime')),
  hours_worked DECIMAL(6,2),
  hourly_rate DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 9. Business Access Requests
CREATE TABLE public.business_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  requester_message TEXT,
  requested_role public.user_role NOT NULL DEFAULT 'employee',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Invites
CREATE TABLE public.invites (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.user_role NOT NULL CHECK (role IN ('admin', 'employee')),
  invite_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.user_has_organization_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_users ou
    WHERE ou.organization_id = $1 AND ou.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = $1 AND o.owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_business_access(business_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    JOIN public.organizations o ON b.organization_id = o.id
    WHERE b.id = $1 AND public.user_has_organization_access(o.id)
  );
$$;

-- Generate invite codes function
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

-- Create organization with owner function
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

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- RLS Policies for Organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    owner_id = auth.uid() OR public.user_has_organization_access(id)
  );

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization owners can update their organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- RLS Policies for Organization Users
CREATE POLICY "Users can view organization users in their organizations" ON public.organization_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND (o.owner_id = auth.uid() OR user_id = auth.uid())
    )
  );

CREATE POLICY "Organization owners can manage organization users" ON public.organization_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

-- RLS Policies for Businesses
CREATE POLICY "Users can view businesses in their organizations" ON public.businesses
  FOR SELECT USING (public.user_has_organization_access(organization_id));

CREATE POLICY "Organization members can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (public.user_has_organization_access(organization_id));

CREATE POLICY "Organization owners can update businesses" ON public.businesses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = organization_id AND o.owner_id = auth.uid()
    )
  );

-- RLS Policies for Business entities (customers, suppliers, employees, products, transactions)
CREATE POLICY "Users can view customers from accessible businesses" ON public.customers
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage customers in accessible businesses" ON public.customers
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view suppliers from accessible businesses" ON public.suppliers
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage suppliers in accessible businesses" ON public.suppliers
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view employees from accessible businesses" ON public.employees
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage employees in accessible businesses" ON public.employees
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view products from accessible businesses" ON public.products
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage products in accessible businesses" ON public.products
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view transactions from accessible businesses" ON public.transactions
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage transactions in accessible businesses" ON public.transactions
  FOR ALL USING (public.user_has_business_access(business_id));

-- RLS Policies for Business Access Requests
CREATE POLICY "Users can view access requests for their businesses" ON public.business_access_requests
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Anyone can create access requests" ON public.business_access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Organization owners can manage access requests" ON public.business_access_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.organizations o ON b.organization_id = o.id
      WHERE b.id = business_id AND o.owner_id = auth.uid()
    )
  );

-- RLS Policies for Invites
CREATE POLICY "Users can view invites for their organizations" ON public.invites
  FOR SELECT USING (public.user_has_organization_access(organization_id));

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

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_users_updated_at
  BEFORE UPDATE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_access_requests_updated_at
  BEFORE UPDATE ON public.business_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant RPC access to authenticated users
GRANT EXECUTE ON FUNCTION create_organization_with_owner(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_invite_code() TO authenticated; 