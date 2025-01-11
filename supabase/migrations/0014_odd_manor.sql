/*
  # Fix payments table structure

  1. Changes
    - Drop and recreate payments table with correct structure
    - Add proper indexes
    - Use MySQL 8.0 compatible syntax
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS payments;

-- Create payments table with correct structure
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payments_status (status),
  INDEX idx_payments_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;