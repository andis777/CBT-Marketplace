INSERT INTO users (id, email, password_hash, name, role, avatar_url, is_verified, is_active)
VALUES
-- Admin user
('admin1', 'admin@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO', 
'Администратор', 'admin', 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?auto=format&fit=crop&q=80&w=200&h=200', 
1, 1),

-- Psychologist users
('psych1', 'anna@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Анна Петрова', 'psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

('psych2', 'mikhail@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Михаил Соколов', 'psychologist', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Institution users
('inst1', 'mip@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Московский Институт Психоанализа', 'institute', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

('inst2', 'spb@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Санкт-Петербургский Институт Схема-терапии', 'institute', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200&h=200',
1, 1),

-- Client users
('client1', 'ivan@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Иван Смирнов', 'client', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', 1, 1),

('client2', 'maria@kpt.ru', '$2a$10$NB3qQJaEYqr6VtxzG0Lkj.XxhyWrxvnHhCwkNJyFx.9TTOqJiLWiO',
'Мария Иванова', 'client', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 1, 1);

-- Insert demo appointments
INSERT INTO appointments (id, client_id, psychologist_id, service_id, appointment_date, status, notes)
VALUES
('apt1', 'client1', 'psych1', 'service1', '2024-12-20 14:00:00', 'confirmed', 'Первичная консультация'),
('apt2', 'client2', 'psych2', 'service2', '2024-12-21 15:00:00', 'pending', 'Онлайн сессия');