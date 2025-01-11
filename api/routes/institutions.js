import express from 'express';
import { v4 as uuid } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

const router = express.Router();

// Helper function to parse JSON fields
const parseInstitution = (institution) => {
  try {
    return {
      ...institution,
      services: typeof institution.services === 'string' 
        ? JSON.parse(institution.services) 
        : institution.services || [],
      contacts: typeof institution.contacts === 'string'
        ? JSON.parse(institution.contacts)
        : institution.contacts || {},
      is_verified: Boolean(institution.is_verified)
    };
  } catch (error) {
    console.error('Error parsing institution data:', error);
    return institution;
  }
};

/**
 * @swagger
 * /api/institutions:
 *   get:
 *     tags: [Institutions]
 *     summary: Get institutions list
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
 *         description: List of institutions
 */
router.get('/', async (req, res) => {
  try {
    console.log('Fetching institutions...');

    let query = db('institutions')
      .join('users', 'institutions.user_id', 'users.id')
      .select(
        'institutions.*',
        'users.name',
        'users.avatar_url as avatar',
        'users.is_verified'
      );

    if (req.query.city) {
      console.log('Filtering by city:', req.query.city);
      query = query.where('institutions.address', 'like', `%${req.query.city}%`);
    }

    if (req.query.is_verified !== undefined) {
      console.log('Filtering by verification status:', req.query.is_verified);
      query = query.where('users.is_verified', req.query.is_verified === 'true');
    }

    const institutions = await query;
    console.log('Raw institutions data:', institutions);
    
    // Parse JSON fields with error handling
    const data = institutions.map(parseInstitution);
    console.log('Parsed institutions data:', data);

    res.json({ data });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/institutions/{id}:
 *   get:
 *     tags: [Institutions]
 *     summary: Get institution by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Institution details
 *       404:
 *         description: Institution not found
 */
router.get('/:id', async (req, res) => {
  try {
    const institution = await db('institutions')
      .join('users', 'institutions.user_id', 'users.id')
      .select(
        'institutions.*',
        'users.name',
        'users.email',
        'users.avatar_url',
        'users.is_verified'
      )
      .where('institutions.id', req.params.id)
      .first();

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Get psychologists
    const psychologists = await db('psychologists')
      .join('users', 'psychologists.user_id', 'users.id')
      .whereRaw('JSON_CONTAINS(psychologists.institution_ids, ?)', [JSON.stringify(institution.id)])
      .select(
        'psychologists.*',
        'users.name',
        'users.avatar_url'
      );

    // Parse JSON fields
    if (typeof institution.services === 'string') {
      institution.services = JSON.parse(institution.services);
    }
    if (typeof institution.contacts === 'string') {
      institution.contacts = JSON.parse(institution.contacts);
    }
    
    // Parse psychologists JSON fields
    const parsedPsychologists = psychologists.map(p => ({
      ...p,
      specializations: typeof p.specializations === 'string' ? JSON.parse(p.specializations) : p.specializations,
      languages: typeof p.languages === 'string' ? JSON.parse(p.languages) : p.languages,
      memberships: typeof p.memberships === 'string' ? JSON.parse(p.memberships) : p.memberships,
      education: typeof p.education === 'string' ? JSON.parse(p.education) : p.education,
      certifications: typeof p.certifications === 'string' ? JSON.parse(p.certifications) : p.certifications,
      gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery,
      location: typeof p.location === 'string' ? JSON.parse(p.location) : p.location,
      contacts: typeof p.contacts === 'string' ? JSON.parse(p.contacts) : p.contacts,
      services: typeof p.services === 'string' ? JSON.parse(p.services) : p.services
    }));

    res.json({ data: {
      ...institution,
      psychologists: parsedPsychologists
    }});
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/institutions:
 *   post:
 *     tags: [Institutions]
 *     summary: Create new institution
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               services:
 *                 type: array
 *               contacts:
 *                 type: object
 *     responses:
 *       201:
 *         description: Institution created
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'institute') {
      return res.status(403).json({ error: 'Not authorized to create institutions' });
    }

    const created = await req.app.locals.prisma.institution.create({
      data: {
        userId: req.user.id,
        ...req.body
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
            isVerified: true
          }
        }
      }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;