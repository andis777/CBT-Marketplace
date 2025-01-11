-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM('psychologist', 'institution') NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add top status fields to psychologists
ALTER TABLE psychologists 
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_until TIMESTAMP NULL;

-- Add top status fields to institutions
ALTER TABLE institutions
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_until TIMESTAMP NULL;

-- Add indexes
CREATE INDEX idx_promotions_payment_id ON promotions(payment_id);
CREATE INDEX idx_promotions_entity_id ON promotions(entity_id);
CREATE INDEX idx_promotions_status ON promotions(status);

-- Add foreign key constraints
ALTER TABLE promotions
ADD CONSTRAINT fk_promotions_psychologist
FOREIGN KEY (entity_id) 
REFERENCES psychologists(id)
ON DELETE CASCADE,
ADD CONSTRAINT fk_promotions_institution
FOREIGN KEY (entity_id)
REFERENCES institutions(id)
ON DELETE CASCADE;