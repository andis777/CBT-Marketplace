/*
  # Update articles table schema

  1. Changes
    - Add status column for article state (draft/published/archived)
    - Add published_at timestamp for publication date
    - Add institution_id and psychologist_id foreign keys
    - Add missing indexes

  2. Security
    - Add foreign key constraints
    - Add indexes for performance
*/

-- Add new columns
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS institution_id VARCHAR(36),
ADD COLUMN IF NOT EXISTS psychologist_id VARCHAR(36);

-- Add foreign key constraints
ALTER TABLE articles
ADD CONSTRAINT fk_articles_institution 
FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_articles_psychologist
FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_institution ON articles(institution_id);
CREATE INDEX IF NOT EXISTS idx_articles_psychologist ON articles(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);