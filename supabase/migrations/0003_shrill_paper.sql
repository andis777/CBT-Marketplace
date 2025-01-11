/*
  # Fix test users and password hashes

  1. Updates
    - Add test users with correct email domains
    - Set correct bcrypt password hashes
    - Ensure consistent data format
*/

-- First remove any existing test users to avoid duplicates
DELETE FROM users WHERE email IN (
  'admin@kpt.ru',
  'test.psy@kpt.ru',
  'test.inst@kpt.ru', 
  'test.client@kpt.ru',
  'admin@кпт.рф',
  'test.psy@кпт.рф',
  'test.inst@кпт.рф',
  'test.client@кпт.рф'
);

-- Insert test users with correct password hashes
INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified, is_active) 
VALUES
-- Admin user
('admin', 'admin@kpt.ru', '$2a$10$YnvqeUrb4TkUOZbGtLI8/.LpTlrSZqtX5Py2RHwwX1B3VpMXXK3Hy',
'Администратор', 'admin', 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Test psychologist
('test_psych', 'test.psy@kpt.ru', '$2a$10$YnvqeUrb4TkUOZbGtLI8/.LpTlrSZqtX5Py2RHwwX1B3VpMXXK3Hy',
'Тестовый Психолог', 'psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Test institution
('test_inst', 'test.inst@kpt.ru', '$2a$10$YnvqeUrb4TkUOZbGtLI8/.LpTlrSZqtX5Py2RHwwX1B3VpMXXK3Hy',
'Тестовый Институт', 'institute', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Test client
('test_client', 'test.client@kpt.ru', '$2a$10$YnvqeUrb4TkUOZbGtLI8/.LpTlrSZqtX5Py2RHwwX1B3VpMXXK3Hy',
'Тестовый Клиент', 'client', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
1, 1);

-- Add test psychologist profile
INSERT INTO psychologists (id, user_id, name, description, experience, rating, reviews_count, specializations, languages, memberships, education, certifications, gallery, location, contacts, services)
VALUES
('test_psych_profile', 'test_psych',
'Тестовый Психолог',
'Тестовый профиль психолога для демонстрации функционала.',
5, 4.5, 10,
'["КПТ", "Тревожные расстройства", "Депрессия"]',
'["Русский", "Английский"]',
'["АКПП"]',
'["МГУ, факультет психологии"]',
'["Сертификат КПТ"]',
'["https://images.unsplash.com/photo-1590650153855-d9e808231d41"]',
'{"city": "Москва", "country": "Россия"}',
'{"phone": "+7 (999) 123-45-67", "email": "test.psy@kpt.ru", "telegram": "@test_psy"}',
'[{"id":"service_test","name":"Тестовая консультация","description":"Тестовая консультация КПТ","price":3000}]');

-- Add test institution profile
INSERT INTO institutions (id, user_id, name, description, address, psychologists_count, services, contacts, is_verified)
VALUES
('test_inst_profile', 'test_inst',
'Тестовый Институт',
'Тестовый профиль института для демонстрации функционала.',
'г. Москва, ул. Тестовая, 1',
5,
'[{"id":"edu_test","name":"Тестовый курс КПТ","description":"Тестовый обучающий курс","price":40000}]',
'{"phone":"+7 (495) 123-45-67","email":"test.inst@kpt.ru","website":"test.kpt.ru"}',
1);