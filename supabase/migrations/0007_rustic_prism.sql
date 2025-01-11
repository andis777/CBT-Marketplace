/*
  # Fix articles table schema

  1. Changes
    - Drop existing foreign key constraints if they exist
    - Ensure all required columns exist
    - Add foreign key constraints with proper NULL handling
    - Add indexes for performance

  2. Security
    - Add foreign key constraints with ON DELETE SET NULL
    - Add indexes for better query performance
*/

-- First drop existing foreign key constraints if they exist
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE articles 
DROP FOREIGN KEY IF EXISTS fk_articles_institution,
DROP FOREIGN KEY IF EXISTS fk_articles_psychologist;
SET FOREIGN_KEY_CHECKS = 1;

-- Ensure columns exist with proper NULL settings
ALTER TABLE articles
MODIFY COLUMN status VARCHAR(20) DEFAULT 'draft',
MODIFY COLUMN published_at TIMESTAMP NULL,
MODIFY COLUMN institution_id VARCHAR(36) NULL,
MODIFY COLUMN psychologist_id VARCHAR(36) NULL;

-- Add foreign key constraints
ALTER TABLE articles
ADD CONSTRAINT fk_articles_institution 
FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_articles_psychologist
FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE SET NULL;

-- Add or update indexes
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_institution ON articles(institution_id);
CREATE INDEX IF NOT EXISTS idx_articles_psychologist ON articles(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);