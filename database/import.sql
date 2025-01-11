-- Connect to MySQL and create database
CREATE DATABASE IF NOT EXISTS u1946990_kptai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE u1946990_kptai;

-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS psychologists;
DROP TABLE IF EXISTS institutions;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'psychologist', 'institute', 'client') NOT NULL,
    avatar_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE institutions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    address VARCHAR(255),
    psychologists_count INT DEFAULT 0,
    services LONGTEXT,
    contacts LONGTEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE psychologists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    experience INT DEFAULT 0,
    institution_id VARCHAR(36),
    rating DECIMAL(3,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    specializations LONGTEXT,
    languages LONGTEXT,
    memberships LONGTEXT,
    education LONGTEXT,
    certifications LONGTEXT,
    gallery LONGTEXT,
    location LONGTEXT,
    contacts LONGTEXT,
    services LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY,
    psychologist_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    psychologist_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    psychologist_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preview TEXT,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(255),
    author_id VARCHAR(36) NOT NULL,
    views INT DEFAULT 0,
    tags LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial data
INSERT INTO users (id, email, password_hash, name, role, is_verified, is_active)
VALUES (
    'admin',
    'admin@кпт.рф',
    '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO', -- password: admin123
    'Администратор',
    'admin',
    TRUE,
    TRUE
);

-- Insert test psychologists
INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified)
VALUES
('psych1', 'anna@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Анна Петрова', 'psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', TRUE),
('psych2', 'mikhail@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Михаил Соколов', 'psychologist', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', TRUE),
-- Insert client users
('client1', 'ivan@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Иван Смирнов', 'client', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', TRUE),
('client2', 'maria@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Мария Иванова', 'client', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', TRUE);

-- Insert test institutions
INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified)
VALUES
('inst1', 'mip@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Московский Институт Психоанализа', 'institute', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', TRUE),
('inst2', 'spb@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Санкт-Петербургский Институт Схема-терапии', 'institute', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', TRUE);

-- Insert institution details
INSERT INTO institutions (id, user_id, description, address, psychologists_count, services, contacts, is_verified)
VALUES
('inst1', 'inst1', 'Ведущий институт в области психологического образования и подготовки специалистов КПТ.',
'г. Москва, ул. Ленина, 1', 45, 
'[{"id":"edu1","name":"Базовый курс КПТ","description":"Фундаментальная программа подготовки специалистов","price":45000},
  {"id":"edu2","name":"Продвинутый курс КПТ","description":"Углубленное изучение методов и техник","price":65000}]',
'{"phone":"+7 (495) 199-19-93","email":"info@kpt.ru","website":"kpt.ru"}', TRUE),
('inst2', 'inst2', 'Специализированный институт, объединяющий схема-терапию и КПТ для комплексного подхода к психотерапии.',
'г. Санкт-Петербург, Невский проспект, 100', 30,
'[{"id":"edu3","name":"Интегративный курс КПТ и схема-терапии","description":"Комплексная программа обучения","price":55000},
  {"id":"edu4","name":"Специализация по работе с личностными расстройствами","description":"Углубленный курс","price":75000}]',
'{"phone":"+7 (812) 299-29-99","email":"info@schema-therapy.ru","website":"schema-therapy.ru"}', TRUE);

-- Insert psychologist profiles
INSERT INTO psychologists (id, user_id, description, experience, institution_id, rating, reviews_count,
specializations, languages, memberships, education, certifications, gallery, location, contacts, services)
VALUES
('psych1', 'psych1',
'Специализируюсь на когнитивно-поведенческой терапии с фокусом на лечении тревожных расстройств и депрессии.',
8, 'inst1', 4.9, 124,
'["Тревожные расстройства", "Депрессия", "Панические атаки"]',
'["Русский", "Английский"]',
'["АКПП", "ЕАКПТ"]',
'["МГУ им. М.В. Ломоносова, факультет психологии"]',
'["Сертификат АКПП по КПТ", "Международный сертификат CBT Practitioner"]',
'["https://images.unsplash.com/photo-1590650153855-d9e808231d41"]',
'{"city": "Москва", "country": "Россия"}',
'{"phone": "+7 (999) 123-45-67", "email": "anna@kpt.ru", "telegram": "@anna_petrova"}',
'[{"id":"service1","name":"Индивидуальная консультация","description":"Персональная консультация с применением методов КПТ","price":3500}]'),

('psych2', 'psych2',
'Психолог-консультант, специализирующийся на работе с паническими атаками и фобиями.',
6, 'inst2', 4.8, 89,
'["Панические атаки", "Фобии", "ОКР"]',
'["Русский"]',
'["АКПП"]',
'["РГГУ, факультет психологии"]',
'["Сертификат по работе с тревожными расстройствами"]',
'["https://images.unsplash.com/photo-1576091160550-2173dba999ef"]',
'{"city": "Санкт-Петербург", "country": "Россия"}',
'{"phone": "+7 (999) 234-56-78", "email": "mikhail@kpt.ru", "telegram": "@mikhail_psy"}', 
'[{"id":"service2","name":"Онлайн-консультация","description":"Консультация через видеосвязь","price":3000}]');

-- Insert services
INSERT INTO services (id, psychologist_id, name, description, price, duration_minutes)
VALUES
('service1', 'psych1', 'Индивидуальная консультация', 'Персональная консультация с применением методов КПТ', 3500, 60),
('service2', 'psych2', 'Онлайн-консультация', 'Консультация через видеосвязь', 3000, 60);

-- Insert reviews
INSERT INTO reviews (id, author_id, psychologist_id, rating, comment, reply)
VALUES
('review1', 'admin1', 'psych1', 5, 'Замечательный специалист! Помогла мне справиться с тревожностью.', 'Спасибо за отзыв!'),