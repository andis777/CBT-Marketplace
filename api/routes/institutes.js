import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import knex from 'knex';
import knexConfig from '../knexfile.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const db = knex(knexConfig.development);

/**
 * @swagger
 * /api/institutes:
 *   get:
 *     tags: [Institutes]
 *     summary: Get institutes list
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_verified
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of institutes
 */
router.get('/', async (req, res) => {
  try {
    const query = db('institutes')
      .join('users', 'institutes.user_id', 'users.id')
      .select(
        'institutes.*',
        'users.name',
        'users.email',
        'users.avatar_url'
      );

    if (req.query.city) {
      query.where('institutes.address', 'like', `%${req.query.city}%`);
    }

    if (req.query.is_verified !== undefined) {
      query.where('institutes.is_verified', req.query.is_verified);
    }

    const institutes = await query;
    res.json(institutes);
  } catch (error) {
    console.error('Error fetching institutes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/institutes/{id}:
 *   get:
 *     tags: [Institutes]
 *     summary: Get institute by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Institute details
 *       404:
 *         description: Institute not found
 */
router.get('/:id', async (req, res) => {
  try {
    const institute = await db('institutes')
      .join('users', 'institutes.user_id', 'users.id')
      .select(
        'institutes.*',
        'users.name',
        'users.email',
        'users.avatar_url'
      )
      .where('institutes.id', req.params.id)
      .first();

    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    // Get programs
    const programs = await db('programs')
      .where('institute_id', institute.id);

    // Get psychologists
    const psychologists = await db('memberships')
      .join('psy_profiles', 'memberships.psychologist_id', 'psy_profiles.id')
      .join('users', 'psy_profiles.user_id', 'users.id')
      .where('memberships.institute_id', institute.id)
      .where('memberships.status', 'active')
      .select(
        'psy_profiles.*',
        'users.name',
        'users.avatar_url'
      );

    res.json({
      ...institute,
      programs,
      psychologists
    });
  } catch (error) {
    console.error('Error fetching institute:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;