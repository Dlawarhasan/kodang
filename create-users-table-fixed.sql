-- Drop existing table if it exists (be careful!)
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table for admin user management
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

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Policy: Only service role can manage users
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Verify table was created
SELECT 'Users table created successfully!' as status;

