/*
  # Add phone column to users table

  1. Changes
    - Add phone column to users table
    - Update existing users with phone numbers
*/

-- Add phone column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Update existing users with phone numbers
UPDATE users SET phone = CASE
  WHEN email = 'admin@kpt.ru' THEN '+7 (999) 111-11-11'
  WHEN email = 'test.psy@kpt.ru' THEN '+7 (999) 222-22-22'
  WHEN email = 'test.inst@kpt.ru' THEN '+7 (999) 333-33-33'
  WHEN email = 'test.client@kpt.ru' THEN '+7 (999) 444-44-44'
  ELSE NULL
END
WHERE email IN ('admin@kpt.ru', 'test.psy@kpt.ru', 'test.inst@kpt.ru', 'test.client@kpt.ru');