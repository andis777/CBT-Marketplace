import express from 'express';
import { v4 as uuid } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

const router = express.Router();


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.password_hash;
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.params.id })
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.password_hash;
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;