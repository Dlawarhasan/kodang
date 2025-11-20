-- Add section column to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'general';

-- Create index for faster queries by section
CREATE INDEX IF NOT EXISTS idx_news_section ON news(section);

-- Update existing records to have 'general' section
UPDATE news SET section = 'general' WHERE section IS NULL;

