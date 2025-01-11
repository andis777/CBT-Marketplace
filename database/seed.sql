-- Insert demo users
INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified, is_active)
VALUES
-- Admin user
('admin1', 'admin@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO', 
'Администратор', 'admin', 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?auto=format&fit=crop&q=80&w=200&h=200', 
1, 1),

-- Psychologist users
('psych1', 'anna@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Анна Петрова', 'psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

('psych2', 'mikhail@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Михаил Соколов', 'psychologist', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Institution users
('inst1', 'mip@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Московский Институт Психоанализа', 'institute', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

('inst2', 'spb@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Санкт-Петербургский Институт Схема-терапии', 'institute', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Client users
('client1', 'ivan@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Иван Смирнов', 'client', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

('client2', 'maria@кпт.рф', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Мария Иванова', 'client', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
1, 1);

-- Insert demo psychologist profiles
INSERT INTO psychologists (id, user_id, name, description, experience, rating, reviews_count, specializations, languages, memberships, education, certifications, gallery, location, contacts, services)
VALUES
('psych1', 'psych1', 'Анна Петрова',
'Специализируюсь на когнитивно-поведенческой терапии с фокусом на лечении тревожных расстройств и депрессии.',
8, 4.9, 124,
'["Тревожные расстройства", "Депрессия", "Панические атаки"]',
'["Русский", "Английский"]',
'["АКПП", "ЕАКПТ"]',
'["МГУ им. М.В. Ломоносова, факультет психологии"]',
'["Сертификат АКПП по КПТ", "Международный сертификат CBT Practitioner"]',
'["https://images.unsplash.com/photo-1590650153855-d9e808231d41"]',
'{"city": "Москва", "country": "Россия"}',
'{"phone": "+7 (999) 123-45-67", "email": "anna@кпт.рф", "telegram": "@anna_petrova"}',
'[{"id":"service1","name":"Индивидуальная консультация","description":"Персональная консультация с применением методов КПТ","price":3500}]'),

('psych2', 'psych2', 'Михаил Соколов',
'Психолог-консультант, специализирующийся на работе с паническими атаками и фобиями.',
6, 4.8, 89,
'["Панические атаки", "Фобии", "ОКР"]',
'["Русский"]',
'["АКПП"]',
'["РГГУ, факультет психологии"]',
'["Сертификат по работе с тревожными расстройствами"]',
'["https://images.unsplash.com/photo-1576091160550-2173dba999ef"]',
'{"city": "Санкт-Петербург", "country": "Россия"}',
'{"phone": "+7 (999) 234-56-78", "email": "mikhail@кпт.рф", "telegram": "@mikhail_psy"}',
'[{"id":"service2","name":"Онлайн-консультация","description":"Консультация через видеосвязь","price":3000}]');

-- Insert demo institution profiles
INSERT INTO institutions (id, user_id, name, description, address, psychologists_count, services, contacts, is_verified)
VALUES
('inst1', 'inst1', 'Московский Институт Психоанализа',
'Ведущий институт в области психологического образования и подготовки специалистов КПТ.',
'г. Москва, ул. Ленина, 1',
45,
'[{"id":"edu1","name":"Базовый курс КПТ","description":"Фундаментальная программа подготовки специалистов","price":45000},
  {"id":"edu2","name":"Продвинутый курс КПТ","description":"Углубленное изучение методов и техник","price":65000}]',
'{"phone":"+7 (495) 199-19-93","email":"info@кпт.рф","website":"кпт.рф"}',
1),

('inst2', 'inst2', 'Санкт-Петербургский Институт Схема-терапии',
'Специализированный институт, объединяющий схема-терапию и КПТ для комплексного подхода к психотерапии.',
'г. Санкт-Петербург, Невский проспект, 100',
30,
'[{"id":"edu3","name":"Интегративный курс КПТ и схема-терапии","description":"Комплексная программа обучения","price":55000},
  {"id":"edu4","name":"Специализация по работе с личностными расстройствами","description":"Углубленный курс","price":75000}]',
'{"phone":"+7 (812) 299-29-99","email":"info@schema-therapy.ru","website":"schema-therapy.ru"}',
1);

-- Insert demo services
INSERT INTO services (id, psychologist_id, name, description, price, duration_minutes)
VALUES
('service1', 'psych1', 'Индивидуальная консультация', 'Персональная консультация с применением методов КПТ', 3500.00, 60),
('service2', 'psych2', 'Онлайн-консультация', 'Консультация через видеосвязь', 3000.00, 60);

-- Insert demo appointments
INSERT INTO appointments (id, client_id, psychologist_id, service_id, appointment_date, status, notes)
VALUES
('apt1', 'client1', 'psych1', 'service1', '2024-03-20 14:00:00', 'confirmed', 'Первичная консультация'),
('apt2', 'client2', 'psych2', 'service2', '2024-03-21 15:00:00', 'pending', 'Онлайн сессия');

-- Insert demo reviews
INSERT INTO reviews (id, author_id, psychologist_id, rating, comment, reply)
VALUES
('rev1', 'client1', 'psych1', 5, 'Замечательный специалист! Помогла справиться с тревожностью.', 'Спасибо за ваш отзыв! Рада, что смогла помочь.'),
('rev2', 'client2', 'psych2', 5, 'Профессиональный подход и внимательное отношение к клиенту.', 'Благодарю за отзыв! Желаю вам дальнейших успехов.');

-- Insert demo articles
INSERT INTO articles (id, title, preview, content, image_url, author_id, views, tags)
VALUES
('art1', 
'Как справиться с тревогой: практические техники КПТ',
'В этой статье мы рассмотрим основные техники когнитивно-поведенческой терапии для управления тревогой...',
'# Как справиться с тревогой\n\nТревога является естественной реакцией организма на стресс, но иногда она может стать чрезмерной и мешать повседневной жизни. В этой статье мы рассмотрим эффективные техники когнитивно-поведенческой терапии для управления тревогой.',
'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000&h=600',
'psych1',
1234,
'["Тревога", "КПТ", "Психическое здоровье", "Техники релаксации", "Самопомощь"]'),

('art2',
'Депрессия и КПТ: путь к выздоровлению',
'Когнитивно-поведенческая терапия показала высокую эффективность в лечении депрессии...',
'# Депрессия и КПТ\n\nДепрессия является одним из наиболее распространенных психических расстройств в современном мире. В этой статье мы рассмотрим, как когнитивно-поведенческая терапия может помочь в борьбе с депрессией.',
'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=1000&h=600',
'psych2',
2345,
'["Депрессия", "КПТ", "Психическое здоровье", "Терапия", "Самопомощь"]');