-- Add PDF support to news and storage
-- Run this in Supabase SQL Editor if you already have the news table.

-- 1) Add pdf column to news
ALTER TABLE news ADD COLUMN IF NOT EXISTS pdf TEXT;

-- 2) Create documents bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 3) Allow public read for documents (if you use separate policies per bucket, add one; otherwise update existing)
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('images', 'videos', 'audio', 'documents'));

-- 4) Allow upload to documents (adjust policy name if different in your project)
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id IN ('images', 'videos', 'audio', 'documents') AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE
  USING (bucket_id IN ('images', 'videos', 'audio', 'documents') AND auth.role() = 'authenticated');
