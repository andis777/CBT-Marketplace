import express from 'express';
import { db } from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data based on user role
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.user;
    let dashboardData = {};

    const user = await db('users')
      .select('id', 'email', 'name', 'role', 'avatar_url', 'is_verified')
      .where({ id })
      .first();

    if (role === 'admin') {
      // Get admin stats
      const [userCount, psychCount, instCount, articleCount] = await Promise.all([
        db('users').count('* as count').first(),
        db('psychologists').count('* as count').first(),
        db('institutions').count('* as count').first(),
        db('articles').count('* as count').first()
      ]);

      dashboardData = {
        stats: {
          users: userCount.count,
          psychologists: psychCount.count,
          institutions: instCount.count,
          articles: articleCount.count
        }
      };

    } else if (role === 'psychologist') {
      // Get psychologist stats
      const profile = await db('psychologists')
        .where({ user_id: id })
        .select('*')
        .first();

      const [appointmentCount, reviewCount, articles] = await Promise.all([
        db('appointments').where({ psychologist_id: profile.id }).count('* as count').first(),
        db('reviews').where({ psychologist_id: profile.id }).count('* as count').first(),
        db('articles')
          .where({ author_id: id })
          .select('*')
          .orderBy('created_at', 'desc')
          .limit(5)
      ]);

      dashboardData = {
        profile,
        stats: {
          appointments: parseInt(appointmentCount.count),
          reviews: parseInt(reviewCount.count),
          rating: profile.rating,
          articles: articles.length
        },
        recentArticles: articles
      };

    } else if (role === 'institute') {
      // Get institution stats
      const profile = await db('institutions')
        .where({ user_id: id })
        .select('*')
        .first();

      const studentCount = await db('students')
        .whereIn('program_id', function() {
          this.select('id').from('programs').where('institution_id', profile.id);
        })
        .count('* as count')
        .first();

      const programs = await db('programs')
        .where({ institution_id: profile.id })
        .select('*');

      dashboardData = {
        profile,
        stats: {
          students: parseInt(studentCount.count),
          programs: programs.length,
          psychologists: profile.psychologists_count
        },
        programs
      };

    } else if (role === 'client') {
      // Get client stats
      const profile = await db('clients')
        .where({ user_id: id })
        .select('*')
        .first();

      const appointments = await db('appointments as a')
        .join('psychologists as p', 'a.psychologist_id', 'p.id')
        .join('services as s', 'a.service_id', 's.id')
        .where('a.client_id', id)
        .select(
          'a.*',
          'p.name as psychologist_name',
          's.name as service_name'
        )
        .orderBy('a.appointment_date', 'desc')
        .limit(5);

      dashboardData = {
        profile,
        stats: {
          appointments: appointments.length,
          savedPsychologists: JSON.parse(profile.saved_psychologists || '[]').length,
          savedInstitutions: JSON.parse(profile.saved_institutions || '[]').length
        },
        recentAppointments: appointments
      };
    }

    const notifications = await db('notifications')
      .where({ user_id: id, is_read: false })
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(5);

    const activities = await db('activity_log')
      .where({ user_id: id })
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(5);

    res.json({
      user,
      notifications,
      activities,
      ...dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;