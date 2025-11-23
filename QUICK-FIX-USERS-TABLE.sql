-- ============================================
-- QUICK FIX: Create Users Table
-- ============================================
-- Copy ALL of this code and paste it in Supabase SQL Editor
-- Then click "Run" button

-- Step 1: Remove old table if exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Step 2: Create new users table
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

-- Step 3: Create index
CREATE INDEX idx_users_username ON public.users(username);

-- Step 4: Enable security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 5: Remove old policy
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Step 6: Create new policy
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 7: Give permissions
GRANT ALL ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Step 8: Check if it worked
SELECT '✅ Users table created successfully!' as result;

