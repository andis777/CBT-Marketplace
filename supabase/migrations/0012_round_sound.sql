/*
  # Add metadata column to payments table

  1. Changes
    - Add metadata JSON column to payments table
    - Add created_at timestamp column if missing
    - Add status column if missing
    - Add description column if missing
*/

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add metadata column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE payments ADD COLUMN metadata JSON;
  END IF;
END $$;