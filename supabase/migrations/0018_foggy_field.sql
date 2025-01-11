/*
  # Add social media links to psychologist profiles

  1. Changes
    - Add new columns for social media links to psychologists table
    - Update existing contacts JSON structure
    - Add indexes for better performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add new columns for social media links
ALTER TABLE psychologists
ADD COLUMN IF NOT EXISTS social_links JSON DEFAULT '{}';

-- Update existing contacts to include new social media fields
UPDATE psychologists
SET social_links = JSON_OBJECT(
  'vk', NULL,
  'telegram', NULL,
  'whatsapp', NULL,
  'youtube', NULL,
  'linkedin', NULL,
  'profi_ru', NULL,
  'b17_ru', NULL,
  'yasno_live', NULL
)
WHERE social_links IS NULL OR social_links = '{}';

-- Add index for better JSON search performance
CREATE INDEX idx_psychologists_social_links ON psychologists((social_links->>'$.vk'));