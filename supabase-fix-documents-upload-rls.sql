-- Fix: "new row violates row-level security policy" when uploading PDF
-- Run this in Supabase → SQL Editor
-- Reason: Admin panel does not use Supabase Auth, so "authenticated" policy blocks upload.
-- This policy allows INSERT into the "documents" bucket (PDFs only).

-- Allow upload to documents bucket (anon key used by app)
DROP POLICY IF EXISTS "Allow upload to documents" ON storage.objects;
CREATE POLICY "Allow upload to documents" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'documents');

-- Optional: allow delete from documents (so admin can remove PDFs)
DROP POLICY IF EXISTS "Allow delete from documents" ON storage.objects;
CREATE POLICY "Allow delete from documents" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'documents');
