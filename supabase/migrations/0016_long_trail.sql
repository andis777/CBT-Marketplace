/*
  # Add services management for MySQL

  1. New Tables
    - `service_categories`
      - `id` (varchar(36), primary key)
      - `name` (varchar(255))
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `service_templates`
      - `id` (varchar(36), primary key) 
      - `category_id` (varchar(36), foreign key)
      - `name` (varchar(255))
      - `description` (text)
      - `default_price` (decimal)
      - `default_duration` (int)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes and Foreign Keys
    - Index on category_id for better join performance
*/

-- Create service categories table
CREATE TABLE service_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create service templates table
CREATE TABLE service_templates (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2) NOT NULL,
  default_duration INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX idx_service_templates_category ON service_templates(category_id);

-- Insert initial categories
INSERT INTO service_categories (id, name, description) VALUES
(UUID(), 'Индивидуальные консультации', 'Персональные консультации с психологом'),
(UUID(), 'Групповые занятия', 'Терапевтические группы и воркшопы'),
(UUID(), 'Онлайн-услуги', 'Консультации в формате видеосвязи'),
(UUID(), 'Диагностика', 'Психологическая диагностика и тестирование');

-- Insert initial service templates
INSERT INTO service_templates (id, category_id, name, description, default_price, default_duration) 
SELECT 
  UUID(),
  id as category_id,
  'Первичная консультация',
  'Знакомство с психологом, сбор анамнеза и определение целей терапии',
  3000,
  60
FROM service_categories 
WHERE name = 'Индивидуальные консультации'
UNION ALL
SELECT 
  UUID(),
  id as category_id,
  'Регулярная консультация',
  'Индивидуальная консультация с применением методов КПТ',
  4000,
  60
FROM service_categories 
WHERE name = 'Индивидуальные консультации'
UNION ALL
SELECT 
  UUID(),
  id as category_id,
  'Онлайн-консультация',
  'Консультация через видеосвязь',
  3500,
  60
FROM service_categories 
WHERE name = 'Онлайн-услуги'
UNION ALL
SELECT 
  UUID(),
  id as category_id,
  'Групповая терапия',
  'Терапевтическая группа до 8 человек',
  2000,
  90
FROM service_categories 
WHERE name = 'Групповые занятия'
UNION ALL
SELECT 
  UUID(),
  id as category_id,
  'Психологическая диагностика',
  'Комплексное психологическое тестирование',
  5000,
  120
FROM service_categories 
WHERE name = 'Диагностика';