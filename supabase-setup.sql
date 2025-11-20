-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  image TEXT,
  video TEXT,
  audio TEXT,
  images JSONB,
  tags TEXT[],
  translations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read news
CREATE POLICY "Anyone can read news" ON news
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (you can restrict this further)
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow public read access
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('images', 'videos', 'audio'));

-- Storage policy: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id IN ('images', 'videos', 'audio') AND auth.role() = 'authenticated');

-- Storage policy: Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE
  USING (bucket_id IN ('images', 'videos', 'audio') AND auth.role() = 'authenticated');

