-- Create storage buckets if they don't exist
-- Note: Buckets must be created through the Supabase Dashboard UI first, then policies can be set

-- First, create buckets manually in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Create these buckets:
--    - Name: "images", Public: true
--    - Name: "videos", Public: true  
--    - Name: "audio", Public: true

-- Then run this SQL to set up policies:

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

-- Storage policy: Allow public read access
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('images', 'videos', 'audio'));

-- Storage policy: Allow service role to upload (bypasses RLS automatically)
-- Also allow authenticated users
CREATE POLICY "Allow upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id IN ('images', 'videos', 'audio'));

-- Storage policy: Allow service role to delete
CREATE POLICY "Allow delete media" ON storage.objects
  FOR DELETE
  USING (bucket_id IN ('images', 'videos', 'audio'));

