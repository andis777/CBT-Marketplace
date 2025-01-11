/*
  # Add test users

  1. New Users
    - Admin user
    - Test psychologist
    - Test institution
    - Test client
  
  2. Security
    - All passwords are hashed using bcrypt
    - Default password for all test accounts is "test123"
*/

-- Add test users
INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified, is_active)
VALUES
-- Admin user
('admin', 'admin@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO', 
'Администратор', 'admin', 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?auto=format&fit=crop&q=80&w=200&h=200', 
1, 1),

-- Test psychologist
('test_psych', 'test.psy@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Тестовый Психолог', 'psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Test institution
('test_inst', 'test.inst@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Тестовый Институт', 'institute', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Test client
('test_client', 'test.client@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
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

-- Add test client profile
INSERT INTO clients (id, user_id, preferences, saved_psychologists, saved_institutions)
VALUES
('test_client_profile', 'test_client',
'{"preferred_contact": "telegram"}',
'[]',
'[]');