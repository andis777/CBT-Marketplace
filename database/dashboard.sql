-- Create clients table
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    preferences JSON DEFAULT NULL,
    saved_psychologists JSON DEFAULT NULL,
    saved_institutions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create programs table for institutions
CREATE TABLE programs (
    id VARCHAR(36) PRIMARY KEY,
    institution_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_months INT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create students table for institutions
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    program_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    enrollment_date DATE NOT NULL,
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create activity_log table for tracking user actions
CREATE TABLE activity_log (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo clients
INSERT INTO clients (id, user_id, preferences, saved_psychologists, saved_institutions)
VALUES
('client1', 'client1', 
'{"preferred_contact": "telegram", "preferred_session_type": "online"}',
'["psych1", "psych2"]',
'["inst1"]'),
('client2', 'client2',
'{"preferred_contact": "phone", "preferred_session_type": "offline"}',
'["psych1"]',
'["inst1", "inst2"]');

-- Insert demo programs
INSERT INTO programs (id, institution_id, name, description, duration_months, price)
VALUES
('prog1', 'inst1', 'Базовый курс КПТ', 'Фундаментальная программа подготовки специалистов', 6, 45000.00),
('prog2', 'inst1', 'Продвинутый курс КПТ', 'Углубленное изучение методов и техник', 12, 65000.00),
('prog3', 'inst2', 'Интегративный курс КПТ и схема-терапии', 'Комплексная программа обучения', 9, 55000.00),
('prog4', 'inst2', 'Специализация по работе с личностными расстройствами', 'Углубленный курс', 12, 75000.00);