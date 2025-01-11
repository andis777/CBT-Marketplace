/*
  # Add indexes for articles table

  1. Changes
    - Add indexes for better query performance
    - Add foreign key constraints
    - Fix column types and defaults
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_institution ON articles(institution_id);
CREATE INDEX IF NOT EXISTS idx_articles_psychologist ON articles(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);

-- Ensure foreign key constraints
ALTER TABLE articles
DROP CONSTRAINT IF EXISTS fk_articles_author,
DROP CONSTRAINT IF EXISTS fk_articles_institution,
DROP CONSTRAINT IF EXISTS fk_articles_psychologist;

ALTER TABLE articles
ADD CONSTRAINT fk_articles_author 
FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_articles_institution
FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_articles_psychologist
FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE SET NULL;