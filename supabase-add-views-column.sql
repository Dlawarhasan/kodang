-- Add views column to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index for faster queries by views
CREATE INDEX IF NOT EXISTS idx_news_views ON news(views DESC);

-- Update existing records to have 0 views
UPDATE news SET views = 0 WHERE views IS NULL;

