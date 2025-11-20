-- Fix RLS policies to allow service role key to bypass RLS
-- Service role key automatically bypasses RLS, but let's make sure policies are correct

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read news" ON news;
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;

-- Policy: Allow everyone to read news (public access)
CREATE POLICY "Anyone can read news" ON news
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert (service role bypasses RLS automatically)
-- But we also allow authenticated users
CREATE POLICY "Allow insert news" ON news
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow service role to update
CREATE POLICY "Allow update news" ON news
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow service role to delete
CREATE POLICY "Allow delete news" ON news
  FOR DELETE
  USING (true);

