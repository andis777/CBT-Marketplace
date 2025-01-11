/*
  # Add articles table

  1. New Tables
    - `articles` table for storing blog posts and articles
      - id (varchar) - Primary key
      - title (varchar) - Article title
      - preview (text) - Short preview/description
      - content (text) - Full article content
      - image_url (varchar) - Featured image URL
      - author_id (varchar) - Foreign key to users table
      - views (int) - View count
      - tags (json) - Array of tags
      - created_at (timestamp) - Creation timestamp
      - updated_at (timestamp) - Last update timestamp
      - status (varchar) - Article status (draft/published/archived)
      - published_at (timestamp) - Publication date
      - institution_id (varchar) - Optional link to institution
      - psychologist_id (varchar) - Optional link to psychologist

  2. Changes
    - Add foreign key constraints
    - Add indexes for performance
*/

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preview TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id VARCHAR(36) NOT NULL,
    views INT DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    institution_id VARCHAR(36),
    psychologist_id VARCHAR(36),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
    FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_institution ON articles(institution_id);
CREATE INDEX idx_articles_psychologist ON articles(psychologist_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);