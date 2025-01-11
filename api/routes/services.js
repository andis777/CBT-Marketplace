import express from 'express';
import { v4 as uuid } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

// Service categories data
const serviceCategories = [
  {
    id: 'cat1',
    name: 'Индивидуальные консультации',
    description: 'Персональные консультации с психологом'
  },
  {
    id: 'cat2', 
    name: 'Групповые занятия',
    description: 'Терапевтические группы и воркшопы'
  },
  {
    id: 'cat3',
    name: 'Онлайн-услуги',
    description: 'Консультации в формате видеосвязи'
  },
  {
    id: 'cat4',
    name: 'Диагностика',
    description: 'Психологическая диагностика и тестирование'
  }
];

const router = express.Router();

/**
 * @swagger
 * /api/services/provider/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get services by provider ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [psychologist, institution]
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/provider/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    console.log('Fetching services for provider:', { id, type });

    if (!type || !['psychologist', 'institution'].includes(type)) {
      return res.status(400).json({ error: 'Invalid provider type' });
    }

    const services = await db('services')
      .where(`${type}_id`, id)
      .select('*')
      .orderBy('name');

    console.log('Found services:', services);
    res.json({ data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/provider/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get services by provider ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [psychologist, institution]
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/provider/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    console.log('Fetching services for provider:', { id, type });

    if (!type || !['psychologist', 'institution'].includes(type)) {
      return res.status(400).json({ error: 'Invalid provider type' });
    }

    const services = await db('services')
      .where(`${type}_id`, id)
      .select('*')
      .orderBy('name');

    console.log('Found services:', services);
    res.json({ data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     tags: [Services]
 *     summary: Get service categories
 *     responses:
 *       200:
 *         description: List of service categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await db('service_categories')
      .select('id', 'name', 'description')
      .orderBy('name');

    console.log('Fetched service categories:', categories);
    res.json({ data: categories });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/templates:
 *   get:
 *     tags: [Services]
 *     summary: Get service templates
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of service templates
 */
router.get('/templates', async (req, res) => {
  try {
    let query = db('service_templates').select('*');
    console.log('Category ID param:', req.query.category_id);
    
    if (req.query.category_id) {
      query = query.where('category_id', req.query.category_id);
    }
    
    const templates = await query;
    console.log('Fetched service templates:', templates);
    res.json({ data: templates });
  } catch (error) {
    console.error('Error fetching service templates:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/{psychologistId}:
 *   post:
 *     tags: [Services]
 *     summary: Create new service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: psychologistId
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
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration_minutes:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created
 */
router.post('/:psychologistId', authenticateToken, async (req, res) => {
  try {
    const { psychologistId } = req.params;
    console.log('Creating service for psychologist:', psychologistId);
    console.log('Request body:', req.body);

    const { name, description, price, duration_minutes } = req.body;

    // Verify ownership
    const psychologist = await db('psychologists')
      .where({ id: psychologistId })
      .first();
    
    console.log('Found psychologist:', psychologist);

    if (!psychologist || psychologist.user_id !== req.user.id) {
      console.log('Authorization failed:', { 
        psychologistExists: !!psychologist,
        requestUserId: req.user.id,
        psychologistUserId: psychologist?.user_id
      });
      return res.status(403).json({ error: 'Not authorized' });
    }

    const service = {
      id: uuid(),
      psychologist_id: psychologistId,
      name,
      description,
      price,
      duration_minutes
    };

    console.log('Creating service:', service);
    await db('services').insert(service);
    console.log('Service created successfully');
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Update service
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration_minutes:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const service = await db('services')
      .join('psychologists', 'services.psychologist_id', 'psychologists.id')
      .where('services.id', id)
      .select('psychologists.user_id')
      .first();

    if (!service || service.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db('services')
      .where({ id })
      .update({
        ...updates,
        updated_at: db.fn.now()
      });

    const updatedService = await db('services')
      .where({ id })
      .first();

    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Delete service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const service = await db('services')
      .join('psychologists', 'services.psychologist_id', 'psychologists.id')
      .where('services.id', id)
      .select('psychologists.user_id')
      .first();

    if (!service || service.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db('services')
      .where({ id })
      .delete();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;