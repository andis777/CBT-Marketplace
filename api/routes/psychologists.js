import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

const router = express.Router();

/**
 * @swagger
 * /api/psychologists/user/{userId}:
 *   get:
 *     tags: [Psychologists]
 *     summary: Get psychologist profile by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Psychologist profile
 *       404:
 *         description: Profile not found
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const psychologist = await db('psychologists')
      .join('users', 'psychologists.user_id', 'users.id')
      .select([
        'psychologists.*',
        'users.name',
        'users.email',
        'users.avatar_url as avatar',
        'users.is_verified',
        db.raw('CAST(psychologists.social_links AS CHAR) as social_links')
      ])
      .where('psychologists.user_id', req.params.userId)
      .first();

    if (!psychologist) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Parse JSON fields
    const response = {
      ...psychologist,
      contacts: JSON.parse(psychologist.contacts || '{}'),
      location: JSON.parse(psychologist.location || '{}'),
      specializations: JSON.parse(psychologist.specializations || '[]'),
      languages: JSON.parse(psychologist.languages || '[]'),
      education: JSON.parse(psychologist.education || '[]'),
      memberships: JSON.parse(psychologist.memberships || '[]'),
      certifications: JSON.parse(psychologist.certifications || '[]'),
      gallery: JSON.parse(psychologist.gallery || '[]'),
      services: JSON.parse(psychologist.services || '[]')
    };

    res.json({ data: response });
  } catch (error) {
    console.error('Error fetching psychologist profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to parse JSON fields
const parsePsychologist = (psychologist) => {
  try {
    return {
      ...psychologist,
      specializations: typeof psychologist.specializations === 'string' 
        ? JSON.parse(psychologist.specializations) 
        : psychologist.specializations || [],
      languages: typeof psychologist.languages === 'string'
        ? JSON.parse(psychologist.languages)
        : psychologist.languages || [],
      memberships: typeof psychologist.memberships === 'string'
        ? JSON.parse(psychologist.memberships)
        : psychologist.memberships || [],
      education: typeof psychologist.education === 'string'
        ? JSON.parse(psychologist.education)
        : psychologist.education || [],
      certifications: typeof psychologist.certifications === 'string'
        ? JSON.parse(psychologist.certifications)
        : psychologist.certifications || [],
      gallery: typeof psychologist.gallery === 'string'
        ? JSON.parse(psychologist.gallery)
        : psychologist.gallery || [],
      location: typeof psychologist.location === 'string'
        ? JSON.parse(psychologist.location)
        : psychologist.location || {},
      contacts: typeof psychologist.contacts === 'string'
        ? JSON.parse(psychologist.contacts)
        : psychologist.contacts || {},
      services: typeof psychologist.services === 'string'
        ? JSON.parse(psychologist.services)
        : psychologist.services || [],
      is_verified: Boolean(psychologist.is_verified)
    };
  } catch (error) {
    console.error('Error parsing psychologist data:', error);
    return psychologist;
  }
};

/**
 * @swagger
 * /api/psychologists:
 *   get:
 *     tags: [Psychologists]
 *     summary: Get psychologists list
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of psychologists
 */
router.get('/', async (req, res) => {
  try {
    console.log('Fetching psychologists with params:', req.query);

    let query = db('psychologists')
      .leftJoin('users', 'psychologists.user_id', 'users.id')
      .select(
        'psychologists.*',
        'users.name',
        'users.email', 
        'users.avatar_url as avatar',
        'users.is_verified'
      );

    // Search by name or service
    if (req.query.name || req.query.service) {
      console.log('Filtering by name/service:', { name: req.query.name, service: req.query.service });
      query = query.where(function() {
        if (req.query.name) {
          this.whereRaw('LOWER(users.name) LIKE LOWER(?)', [`%${req.query.name}%`]);
        }
        if (req.query.service) {
          this.orWhereRaw('JSON_SEARCH(psychologists.services, "one", ?) IS NOT NULL',
            [`%${req.query.service}%`]);
        }
      });
    }

    // Apply filters
    if (req.query.city) {
      console.log('Filtering by city:', req.query.city);
      query = query.whereRaw('JSON_UNQUOTE(JSON_EXTRACT(psychologists.location, "$.city")) LIKE ?',
        [`%${req.query.city}%`]);
    }

    if (req.query.specialization) {
      console.log('Filtering by specialization:', req.query.specialization);
      const searchSpec = req.query.specialization.toLowerCase();
      query = query.whereRaw('JSON_SEARCH(LOWER(psychologists.specializations), "one", LOWER(?)) IS NOT NULL', [`%${searchSpec}%`]);
    }

    if (req.query.minRating) {
      console.log('Filtering by minimum rating:', req.query.minRating);
      query = query.where('psychologists.rating', '>=', parseFloat(req.query.minRating));
    }

    // Add country filter
    if (req.query.country) {
      query = query.whereRaw('JSON_UNQUOTE(JSON_EXTRACT(psychologists.location, "$.country")) = ?',
        [req.query.country]);
    }

    const psychologists = await query;
    console.log('Raw psychologists data:', psychologists);
    
    // Parse JSON fields with error handling
    const data = Array.isArray(psychologists) 
      ? psychologists.map(parsePsychologist)
      : [];
    console.log('Parsed psychologists data:', data);

    res.json({ data });
  } catch (error) {
    console.error('Error fetching psychologists:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/psychologists/{id}:
 *   get:
 *     tags: [Psychologists]
 *     summary: Get psychologist by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Psychologist details
 *       404:
 *         description: Psychologist not found
 */
router.get('/:id', async (req, res) => {
  try {
    const psychologist = await db('psychologists')
      .join('users', 'psychologists.user_id', 'users.id')
      .select(
        'psychologists.*',
        'users.name',
        'users.email',
        'users.avatar_url as avatar',
        'users.is_verified'
      )
      .where('psychologists.id', req.params.id)
      .first();

    if (!psychologist) {
      return res.status(404).json({ error: 'Psychologist not found' });
    }

    // Parse JSON fields
    const parsed = {
      ...psychologist,
      specializations: typeof psychologist.specializations === 'string' ? JSON.parse(psychologist.specializations) : psychologist.specializations,
      languages: typeof psychologist.languages === 'string' ? JSON.parse(psychologist.languages) : psychologist.languages,
      memberships: typeof psychologist.memberships === 'string' ? JSON.parse(psychologist.memberships) : psychologist.memberships,
      education: typeof psychologist.education === 'string' ? JSON.parse(psychologist.education) : psychologist.education,
      certifications: typeof psychologist.certifications === 'string' ? JSON.parse(psychologist.certifications) : psychologist.certifications,
      gallery: typeof psychologist.gallery === 'string' ? JSON.parse(psychologist.gallery) : psychologist.gallery,
      location: typeof psychologist.location === 'string' ? JSON.parse(psychologist.location) : psychologist.location,
      contacts: typeof psychologist.contacts === 'string' ? JSON.parse(psychologist.contacts) : psychologist.contacts,
      services: typeof psychologist.services === 'string' ? JSON.parse(psychologist.services) : psychologist.services,
      is_verified: Boolean(psychologist.is_verified)
    };

    res.json({ data: parsed });
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/psychologists/{id}/institution:
 *   put:
 *     tags: [Psychologists]
 *     summary: Update psychologist's institution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - institution_id
 *             properties:
 *               institution_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Institution updated successfully
 *       404:
 *         description: Psychologist not found
 */
router.put('/:id/institution', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { institution_ids } = req.body;

    // Verify psychologist exists and user has permission
    const psychologist = await db('psychologists')
      .where({ id })
      .first();

    if (!psychologist) {
      return res.status(404).json({ error: 'Psychologist not found' });
    }

    if (psychologist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update institution
    await db('psychologists')
      .where({ id })
      .update({ 
        institution_ids: JSON.stringify(institution_ids),
        updated_at: db.fn.now()
      });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/psychologists/{id}:
 *   put:
 *     tags: [Psychologists]
 *     summary: Update psychologist profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               experience:
 *                 type: integer
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               contacts:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   telegram:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to update this profile
 *       404:
 *         description: Psychologist not found
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify psychologist exists and user has permission
    const psychologist = await db('psychologists')
      .where({ id })
      .first();

    if (!psychologist) {
      return res.status(404).json({ error: 'Psychologist not found' });
    }

    if (psychologist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    // Prepare updates object with all fields
    const updates = {
      ...req.body,
      social_links: req.body.social_links ? JSON.stringify({
        vk: req.body.social_links.vk || null,
        b17_ru: req.body.social_links.b17_ru || null,
        youtube: req.body.social_links.youtube || null,
        linkedin: req.body.social_links.linkedin || null,
        profi_ru: req.body.social_links.profi_ru || null,
        telegram: req.body.social_links.telegram || null,
        whatsapp: req.body.social_links.whatsapp || null,
        yasno_live: req.body.social_links.yasno_live || null
      }) : undefined,
      updated_at: db.fn.now()
    };

    // Handle all JSON fields
    const jsonFields = [
      'contacts',
      'location', 
      'specializations',
      'languages',
      'education',
      'memberships',
      'certifications',
      'gallery',
      'services'
    ];

    // Stringify all JSON fields that exist in updates
    jsonFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = JSON.stringify(updates[field]);
      }
    });

    console.log('Updating psychologist with data:', updates);
    
    const result = await db('psychologists')
      .where({ id })
      .update(updates);

    console.log('Update result:', result);

    // Fetch updated profile
    const updatedProfile = await db('psychologists')
      .join('users', 'psychologists.user_id', 'users.id')
      .select(
        'psychologists.*',
        'users.name',
        'users.email',
        'users.avatar_url as avatar',
        'users.is_verified'
      )
      .where('psychologists.id', id)
      .first();

    // Parse JSON fields
    const response = {
      ...updatedProfile,
      contacts: JSON.parse(updatedProfile.contacts || '{}'),
      location: JSON.parse(updatedProfile.location || '{}'),
      social_links: JSON.parse(updatedProfile.social_links || '{}'),
      specializations: JSON.parse(updatedProfile.specializations || '[]'),
      languages: JSON.parse(updatedProfile.languages || '[]'),
      education: JSON.parse(updatedProfile.education || '[]')
    };

    res.json({ data: response });
  } catch (error) {
    console.error('Error updating psychologist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;