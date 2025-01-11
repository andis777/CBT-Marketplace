import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get user appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const appointments = await db('appointments')
      .join('users as psychologists', 'appointments.psychologist_id', 'psychologists.id')
      .join('users as clients', 'appointments.client_id', 'clients.id')
      .select(
        'appointments.*',
        'psychologists.name as psychologist_name',
        'psychologists.avatar_url as psychologist_avatar',
        'clients.name as client_name',
        'clients.avatar_url as client_avatar'
      )
      .where(function() {
        if (req.user.role === 'client') {
          this.where('appointments.client_id', req.user.id);
        } else if (req.user.role === 'psychologist') {
          this.where('appointments.psychologist_id', req.user.id);
        }
      })
      .orderBy('appointments.appointment_date', 'desc');
    
    res.json({ data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Create new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - psychologist_id
 *               - service_id
 *               - appointment_date
 *             properties:
 *               psychologist_id:
 *                 type: string
 *               service_id:
 *                 type: string
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can create appointments' });
    }

    const appointment = {
      id: uuidv4(),
      client_id: req.user.id,
      psychologist_id: req.body.psychologist_id,
      service_id: req.body.service_id,
      appointment_date: req.body.appointment_date,
      notes: req.body.notes,
      status: 'pending'
    };

    await db('appointments').insert(appointment);
    res.status(201).json({ data: appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     tags: [Appointments]
 *     summary: Update appointment status
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Appointment status updated
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await db('appointments')
      .where({ id })
      .first();

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role !== 'psychologist' && req.user.id !== appointment.psychologist_id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db('appointments')
      .where({ id })
      .update({ 
        status,
        updated_at: db.fn.now()
      });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/appointments/count:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointments count
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments count
 */
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const count = await db('appointments')
      .where(function() {
        if (req.user.role === 'client') {
          this.where('client_id', req.user.id);
        } else if (req.user.role === 'psychologist') {
          this.where('psychologist_id', req.user.id);
        }
      })
      .count('* as count')
      .first();

    res.json({ data: { count: parseInt(count?.count || '0') } });
  } catch (error) {
    console.error('Error fetching appointments count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get user appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const count = await db('appointments')
      .where(function() {
        if (req.user.role === 'client') {
          this.where('client_id', req.user.id);
        } else if (req.user.role === 'psychologist') {
          this.where('psychologist_id', req.user.id);
        }
      })
      .count('* as count')
      .first();
    
    res.json({ data: { count: parseInt(count?.count || '0') } });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;