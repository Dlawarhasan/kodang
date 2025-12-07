-- ============================================
-- Create short_urls table for URL shortening
-- ============================================
-- IMPORTANT: You MUST run this SQL script in Supabase SQL Editor
-- before short URLs will work!
--
-- Steps:
-- 1. Go to Supabase Dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Copy and paste this entire file
-- 4. Click "Run" button
-- 5. Wait for success message
--
-- After running this, short URLs will work properly.
-- ============================================

CREATE TABLE IF NOT EXISTS short_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'fa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(code);
CREATE INDEX IF NOT EXISTS idx_short_urls_slug_locale ON short_urls(slug, locale);

-- Enable Row Level Security
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Anyone can read short URLs" ON short_urls;
DROP POLICY IF EXISTS "Service role can manage short URLs" ON short_urls;

-- Policy: Allow everyone to read short URLs
CREATE POLICY "Anyone can read short URLs" ON short_urls
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert/update/delete
CREATE POLICY "Service role can manage short URLs" ON short_urls
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

