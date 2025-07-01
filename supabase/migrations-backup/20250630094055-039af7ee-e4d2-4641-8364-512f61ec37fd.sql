
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user roles enum and table
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'employee');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, role)
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Fish', 'Honey', 'Mushrooms')),
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create business_users junction table for multi-tenant access
CREATE TABLE public.business_users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(business_id, user_id)
);

-- Core business entities
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
  total_purchases DECIMAL(10,2) DEFAULT 0,
  outstanding_balance DECIMAL(10,2) DEFAULT 0,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

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

CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sale', 'refund', 'expense', 'employee_cost')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  customer_name TEXT,
  payment_method TEXT CHECK (payment_method IN ('card', 'cash', 'yoco', 'bank_transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue', 'partial')),
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

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user business access
CREATE OR REPLACE FUNCTION public.user_has_business_access(business_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_users bu
    WHERE bu.business_id = $1 AND bu.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = $1 AND b.owner_id = auth.uid()
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for businesses
CREATE POLICY "Users can view businesses they have access to" ON public.businesses
  FOR SELECT USING (owner_id = auth.uid() OR public.user_has_business_access(id));

CREATE POLICY "Business owners can update their businesses" ON public.businesses
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- RLS Policies for customers (and similar for other business entities)
CREATE POLICY "Users can view customers from accessible businesses" ON public.customers
  FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can manage customers from accessible businesses" ON public.customers
  FOR ALL USING (public.user_has_business_access(business_id));

-- Apply similar policies to other tables
CREATE POLICY "Users can view suppliers from accessible businesses" ON public.suppliers
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view employees from accessible businesses" ON public.employees
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view products from accessible businesses" ON public.products
  FOR ALL USING (public.user_has_business_access(business_id));

CREATE POLICY "Users can view transactions from accessible businesses" ON public.transactions
  FOR ALL USING (public.user_has_business_access(business_id));

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'owner');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
