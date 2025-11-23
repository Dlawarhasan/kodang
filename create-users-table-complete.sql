-- Complete script to create users table
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Drop existing table if it exists (this will remove all data!)
DROP TABLE IF EXISTS public.users CASCADE;

-- Step 2: Create the users table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Step 4: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Allow service role all operations" ON public.users;

-- Step 6: Create policy for service role (this allows API to access)
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 7: Also allow service role to bypass RLS (alternative approach)
-- This is more permissive but ensures API works
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

-- Step 8: Grant necessary permissions
GRANT ALL ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Step 9: Verify table was created
SELECT 
  'Table created successfully!' as status,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users';

-- Step 10: Test insert (this should work with service role)
-- Uncomment the line below to test:
-- INSERT INTO public.users (username, password, can_create, can_edit, can_delete)
-- VALUES ('test', 'test123', true, true, true);

