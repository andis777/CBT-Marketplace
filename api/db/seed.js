import knex from 'knex';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

async function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

async function seed() {
  try {
    // Clear existing data in reverse order to avoid foreign key constraints
    await db('articles').del();
    await db('psy_profiles').del();
    await db('institutes').del();
    await db('users').del();

    // Insert admin user
    await db('users').insert({
      id: uuidv4(),
      email: 'admin@kpt.ru',
      password_hash: await hashPassword('admin123'),
      name: 'Администратор',
      role: 'admin',
      is_verified: true,
      is_active: true
    });

    // Insert psychologists
    const psychologists = [
      {
        email: 'anna@kpt.ru',
        name: 'Анна Петрова',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        description: 'Специализируюсь на когнитивно-поведенческой терапии с фокусом на лечении тревожных расстройств и депрессии.',
        education: 'МГУ им. М.В. Ломоносова, факультет психологии',
        rating: 4.9,
        reviews_count: 124,
        specializations: ['Тревожные расстройства', 'Депрессия', 'Панические атаки']
      },
      {
        email: 'mikhail@kpt.ru',
        name: 'Михаил Соколов',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
        description: 'Психолог-консультант, специализирующийся на работе с паническими атаками и фобиями.',
        education: 'РГГУ, факультет психологии',
        rating: 4.8,
        reviews_count: 89,
        specializations: ['Панические атаки', 'Фобии', 'ОКР']
      },
      {
        email: 'elena@кпт.рф',
        name: 'Елена Морозова',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        description: 'Помогаю справиться с депрессией, тревогой и паническими атаками методами КПТ.',
        education: 'СПбГУ, факультет психологии',
        rating: 4.7,
        reviews_count: 76,
        specializations: ['Депрессия', 'Тревожность', 'Панические атаки']
      }
    ];

    for (const psych of psychologists) {
      const userId = uuidv4();
      await db('users').insert({
        id: userId,
        email: psych.email,
        password_hash: await hashPassword('psych123'),
        name: psych.name,
        role: 'psychologist',
        avatar_url: psych.avatar_url,
        is_verified: true
      });

      await db('psy_profiles').insert({
        id: uuidv4(),
        user_id: userId,
        name: psych.name,
        description: psych.description,
        education: psych.education,
        rating: psych.rating,
        reviews_count: psych.reviews_count,
        specializations: JSON.stringify(psych.specializations),
        languages: JSON.stringify(['Русский', 'Английский']),
        memberships: JSON.stringify(['АКПП', 'ЕАКПТ']),
        certifications: JSON.stringify(['Сертификат КПТ']),
        location: JSON.stringify({ city: 'Москва', country: 'Россия' }),
        contacts: JSON.stringify({
          phone: '+7 (999) 123-45-67',
          email: psych.email,
          telegram: '@psychologist'
        })
        services: JSON.stringify([{
          id: uuidv4(),
          name: 'Индивидуальная консультация',
          description: 'Персональная консультация с применением методов КПТ',
          price: 3500
        }])
      });
    }

    // Insert test institution
    const instId = uuidv4();
    await db('users').insert({
      id: instId,
      email: 'mip@кпт.рф',
      password_hash: await hashPassword('institute123'),
      name: 'Московский Институт Психоанализа',
      role: 'institute',
      avatar_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200&h=200',
      is_verified: true
    });

    console.log('Users seeded successfully');

    // Insert institution profile
    await db('institutes').insert({
      id: uuidv4(),
      user_id: instId,
      name: 'Московский Институт Психоанализа',
      description: 'Ведущий институт в области психологического образования и подготовки специалистов КПТ.',
      address: 'г. Москва, ул. Ленина, 1',
      contacts: JSON.stringify({
        phone: '+7 (495) 199-19-93',
        email: 'info@кпт.рф',
        website: 'кпт.рф'
      }),
      is_verified: true
    });
    console.log('Institutions seeded successfully');

    console.log('Psychologists seeded successfully');

    console.log('All data seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

seed();