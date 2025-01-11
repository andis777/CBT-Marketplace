/*
  # Create promotions table and add top status fields

  1. New Tables
    - `promotions`
      - `id` (uuid, primary key)
      - `type` (text, either 'psychologist' or 'institution')
      - `entity_id` (uuid, references either psychologists or institutions)
      - `payment_id` (text, YooKassa payment ID)
      - `amount` (numeric)
      - `status` (text: pending, completed, failed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `is_top` and `top_until` columns to psychologists and institutions tables
*/

-- Create promotions table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('psychologist', 'institution')),
    entity_id UUID NOT NULL,
    payment_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add top status fields to psychologists
ALTER TABLE psychologists 
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_until TIMESTAMP WITH TIME ZONE;

-- Add top status fields to institutions
ALTER TABLE institutions
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_until TIMESTAMP WITH TIME ZONE;

-- Add indexes
CREATE INDEX idx_promotions_payment_id ON promotions(payment_id);
CREATE INDEX idx_promotions_entity_id ON promotions(entity_id);
CREATE INDEX idx_promotions_status ON promotions(status);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Admins can do everything" 
    ON promotions
    FOR ALL 
    TO authenticated
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Users can view their own promotions"
    ON promotions
    FOR SELECT
    TO authenticated
    USING (
        entity_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.uid()
            UNION
            SELECT id FROM institutions WHERE user_id = auth.uid()
        )
    );