/*
  # Fix social links update

  1. Changes
    - Drop existing social_links column
    - Add new social_links column with proper JSON type
    - Add index for better performance

  2. Security
    - No changes to security policies needed
*/

-- Drop existing column and index
ALTER TABLE psychologists
DROP INDEX IF EXISTS idx_psychologists_social_links,
DROP COLUMN IF EXISTS social_links;

-- Add new social_links column
ALTER TABLE psychologists
ADD COLUMN social_links JSON NULL;

-- Update existing records with empty social links
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
WHERE social_links IS NULL;

-- Add index for better JSON search performance
ALTER TABLE psychologists
ADD INDEX idx_psychologists_social_links ((CAST(JSON_EXTRACT(social_links, '$.vk') AS CHAR(36))));