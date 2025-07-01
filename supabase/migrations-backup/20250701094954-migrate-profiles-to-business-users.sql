-- Migrate user profile data from profiles to business_users

-- 1. Add new columns to business_users
ALTER TABLE public.business_users
  ADD COLUMN full_name TEXT,
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN email TEXT;

-- 2. Copy data from profiles to business_users (if exists)
UPDATE public.business_users bu
SET
  full_name = p.full_name,
  avatar_url = p.avatar_url,
  email = p.email
FROM public.profiles p
WHERE bu.user_id = p.id;

-- 3. Drop the profiles table
DROP TABLE IF EXISTS public.profiles CASCADE; 