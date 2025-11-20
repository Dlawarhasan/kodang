INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videos', 'videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg'])
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('audio', 'audio', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('images', 'videos', 'audio'));

CREATE POLICY "Allow upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id IN ('images', 'videos', 'audio'));

CREATE POLICY "Allow delete media" ON storage.objects
  FOR DELETE
  USING (bucket_id IN ('images', 'videos', 'audio'));

