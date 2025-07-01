-- Create business_access_requests table
CREATE TABLE IF NOT EXISTS public.business_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  requester_message TEXT,
  requested_role TEXT NOT NULL DEFAULT 'employee' CHECK (requested_role IN ('owner', 'admin', 'employee')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_access_requests_business_id ON public.business_access_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_business_access_requests_requester_email ON public.business_access_requests(requester_email);
CREATE INDEX IF NOT EXISTS idx_business_access_requests_status ON public.business_access_requests(status);

-- Enable RLS
ALTER TABLE public.business_access_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view access requests for businesses they own" ON public.business_access_requests
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create access requests" ON public.business_access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Business owners can update access requests" ON public.business_access_requests
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_business_access_requests_updated_at
  BEFORE UPDATE ON public.business_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 