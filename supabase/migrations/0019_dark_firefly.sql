/*
  # Add social media links to psychologist profiles

  1. Changes
    - Add social_links JSON column to psychologists table
    - Initialize default social links structure
    - Add index for better performance

  2. Security
    - No changes to security policies needed
*/

-- Add social_links column if it doesn't exist
ALTER TABLE psychologists
ADD COLUMN IF NOT EXISTS social_links JSON DEFAULT (JSON_OBJECT(
  'vk', NULL,
  'telegram', NULL,
  'whatsapp', NULL,
  'youtube', NULL,
  'linkedin', NULL,
  'profi_ru', NULL,
  'b17_ru', NULL,
  'yasno_live', NULL
));

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
ADD INDEX idx_psychologists_social_links ((CAST(social_links->>'$.vk' AS CHAR(36))));