import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seed(knex) {
  // Clear existing data
  await knex('articles').del();
  await knex('services').del();
  await knex('psy_profiles').del();
  await knex('institutes').del();
  await knex('users').del();

  // Create users
  const adminId = uuidv4();
  const psychologist1Id = uuidv4();
  const psychologist2Id = uuidv4();
  const institute1Id = uuidv4();
  const institute2Id = uuidv4();

  const passwordHash = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      id: adminId,
      email: 'admin@kpt.ru',
      password_hash: passwordHash,
      name: 'Администратор',
      role: 'admin',
      is_verified: true
    },
    {
      id: psychologist1Id,
      email: 'anna@kpt.ru',
      password_hash: passwordHash,
      name: 'Анна Петрова',
      role: 'psychologist',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      is_verified: true
    },
    {
      id: psychologist2Id,
      email: 'mikhail@kpt.ru',
      password_hash: passwordHash,
      name: 'Михаил Соколов',
      role: 'psychologist',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      is_verified: true
    },
    {
      id: institute1Id,
      email: 'mip@kpt.ru',
      password_hash: passwordHash,
      name: 'Московский Институт Психоанализа',
      role: 'institute',
      avatar_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
      is_verified: true
    },
    {
      id: institute2Id,
      email: 'spb@kpt.ru',
      password_hash: passwordHash,
      name: 'Санкт-Петербургский Институт Схема-терапии',
      role: 'institute',
      avatar_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200&h=200',
      is_verified: true
    }
  ]);

  // Create institutes
  await knex('institutes').insert([
    {
      id: uuidv4(),
      user_id: institute1Id,
      name: 'Московский Институт Психоанализа',
      description: 'Ведущий институт в области психологического образования и подготовки специалистов КПТ.',
      address: 'г. Москва, ул. Ленина, 1',
      contacts: JSON.stringify({
        phone: '+7 (495) 199-19-93',
        email: 'info@kpt.ru',
        website: 'kpt.ru'
      }),
      is_verified: true
    },
    {
      id: uuidv4(),
      user_id: institute2Id,
      name: 'Санкт-Петербургский Институт Схема-терапии',
      description: 'Специализированный институт, объединяющий схема-терапию и КПТ для комплексного подхода к психотерапии.',
      address: 'г. Санкт-Петербург, Невский проспект, 100',
      contacts: JSON.stringify({
        phone: '+7 (812) 299-29-99',
        email: 'info@schema-therapy.ru',
        website: 'schema-therapy.ru'
      }),
      is_verified: true
    }
  ]);

  // Create psychologist profiles
  const psyProfile1Id = uuidv4();
  const psyProfile2Id = uuidv4();

  await knex('psy_profiles').insert([
    {
      id: psyProfile1Id,
      user_id: psychologist1Id,
      description: 'Специализируюсь на когнитивно-поведенческой терапии с фокусом на лечении тревожных расстройств и депрессии.',
      education: 'МГУ им. М.В. Ломоносова, факультет психологии',
      rating: 4.9,
      reviews_count: 124,
      specializations: JSON.stringify(['Тревожные расстройства', 'Депрессия', 'Панические атаки'])
    },
    {
      id: psyProfile2Id,
      user_id: psychologist2Id,
      description: 'Психолог-консультант, специализирующийся на работе с паническими атаками и фобиями.',
      education: 'РГГУ, факультет психологии',
      rating: 4.8,
      reviews_count: 89,
      specializations: JSON.stringify(['Панические атаки', 'Фобии', 'ОКР'])
    }
  ]);

  // Create services
  await knex('services').insert([
    {
      id: uuidv4(),
      psychologist_id: psyProfile1Id,
      name: 'Индивидуальная консультация',
      description: 'Персональная консультация с применением методов КПТ',
      price: 3500,
      duration_minutes: 60
    },
    {
      id: uuidv4(),
      psychologist_id: psyProfile2Id,
      name: 'Онлайн-консультация',
      description: 'Консультация через видеосвязь',
      price: 3000,
      duration_minutes: 60
    }
  ]);

  // Create articles
  await knex('articles').insert([
    {
      id: uuidv4(),
      author_id: psychologist1Id,
      title: 'Как справиться с тревогой: практические техники КПТ',
      content: 'В этой статье мы рассмотрим основные техники когнитивно-поведенческой терапии для управления тревогой...',
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      tags: JSON.stringify(['Тревога', 'КПТ', 'Самопомощь'])
    },
    {
      id: uuidv4(),
      author_id: psychologist2Id,
      title: 'Работа с паническими атаками методами КПТ',
      content: 'Панические атаки могут быть преодолены с помощью когнитивно-поведенческой терапии...',
      image_url: 'https://images.unsplash.com/photo-1541199249251-f713e6145474',
      tags: JSON.stringify(['Панические атаки', 'КПТ', 'Терапия'])
    }
  ]);
  
  // Insert demo clients
  await knex('clients').insert([
    {
      id: 'client1',
      user_id: 'client1',
      preferences: JSON.stringify({
        preferred_contact: 'telegram',
        preferred_session_type: 'online'
      }),
      saved_psychologists: JSON.stringify(['psych1', 'psych2']),
      saved_institutions: JSON.stringify(['inst1'])
    },
    {
      id: 'client2',
      user_id: 'client2',
      preferences: JSON.stringify({
        preferred_contact: 'phone',
        preferred_session_type: 'offline'
      }),
      saved_psychologists: JSON.stringify(['psych1']),
      saved_institutions: JSON.stringify(['inst1', 'inst2'])
    }
  ]);

  // Insert demo programs
  await knex('programs').insert([
    {
      id: 'prog1',
      institution_id: 'inst1',
      name: 'Базовый курс КПТ',
      description: 'Фундаментальная программа подготовки специалистов',
      duration_months: 6,
      price: 45000.00
    },
    {
      id: 'prog2',
      institution_id: 'inst1',
      name: 'Продвинутый курс КПТ',
      description: 'Углубленное изучение методов и техник',
      duration_months: 12,
      price: 65000.00
    }
  ]);
}