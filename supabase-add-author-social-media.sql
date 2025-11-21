-- Add author social media columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_instagram TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_facebook TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_twitter TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_telegram TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_youtube TEXT;

