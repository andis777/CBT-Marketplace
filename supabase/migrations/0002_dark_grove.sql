/*
  # Fix password hashes for test users

  1. Updates
    - Update password hashes for all test users
    - All users will have password: test123
    - Uses bcrypt with 10 rounds
*/

-- Update password hashes for all users to use password 'test123'
UPDATE users 
SET password_hash = '$2a$10$YnvqeUrb4TkUOZbGtLI8/.LpTlrSZqtX5Py2RHwwX1B3VpMXXK3Hy'
WHERE email IN (
  'admin@kpt.ru',
  'test.psy@kpt.ru', 
  'test.inst@kpt.ru',
  'test.client@kpt.ru',
  'admin@кпт.рф',
  'test.psy@кпт.рф',
  'test.inst@кпт.рф',
  'test.client@кпт.рф'
);