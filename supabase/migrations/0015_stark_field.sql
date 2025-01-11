/*
  # Add services management

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `service_templates`
      - `id` (uuid, primary key) 
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `default_price` (numeric)
      - `default_duration` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
*/

-- Create service categories table
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service templates table
CREATE TABLE service_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_price NUMERIC(10,2) NOT NULL,
  default_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage service categories"
  ON service_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can manage service templates"
  ON service_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create indexes
CREATE INDEX idx_service_templates_category ON service_templates(category_id);

-- Insert initial categories
INSERT INTO service_categories (name, description) VALUES
('Индивидуальные консультации', 'Персональные консультации с психологом'),
('Групповые занятия', 'Терапевтические группы и воркшопы'),
('Онлайн-услуги', 'Консультации в формате видеосвязи'),
('Диагностика', 'Психологическая диагностика и тестирование');

-- Insert initial service templates
INSERT INTO service_templates (category_id, name, description, default_price, default_duration) VALUES
((SELECT id FROM service_categories WHERE name = 'Индивидуальные консультации'),
'Первичная консультация', 'Знакомство с психологом, сбор анамнеза и определение целей терапии', 3000, 60),

((SELECT id FROM service_categories WHERE name = 'Индивидуальные консультации'),
'Регулярная консультация', 'Индивидуальная консультация с применением методов КПТ', 4000, 60),

((SELECT id FROM service_categories WHERE name = 'Онлайн-услуги'),
'Онлайн-консультация', 'Консультация через видеосвязь', 3500, 60),

((SELECT id FROM service_categories WHERE name = 'Групповые занятия'),
'Групповая терапия', 'Терапевтическая группа до 8 человек', 2000, 90),

((SELECT id FROM service_categories WHERE name = 'Диагностика'),
'Психологическая диагностика', 'Комплексное психологическое тестирование', 5000, 120);