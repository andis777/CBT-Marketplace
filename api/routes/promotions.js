import express from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import fetch from 'node-fetch';

/**
 * @swagger
 * /api/promotions/{type}/{id}:
 *   post:
 *     tags: [Promotions]
 *     summary: Promote a psychologist or institution to top
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [psychologist, institution]
 *         description: Type of entity to promote
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the entity to promote
 *     responses:
 *       200:
 *         description: Promotion request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payment_url:
 *                   type: string
 *                   description: URL for payment processing
 *                   example: https://yookassa.ru/payments/...
 *       400:
 *         description: Invalid promotion type
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Entity not found
 *       500:
 *         description: Server error
 */
const router = express.Router();

const YOOKASSA_SHOP_ID = '420718';
const YOOKASSA_SECRET_KEY = 'test_xyvhH1zZGfCYIwyGnLbskqsrclHQUI7TNnXvGGMWg2M';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';

const PROMOTION_PRICES = {
  psychologist: 2500,
  institution: 5000
};

router.post('/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Validate type
    if (!['psychologist', 'institution'].includes(type)) {
      return res.status(400).json({ error: 'Invalid promotion type' });
    }

    // Verify entity exists
    const entity = await db(type === 'psychologist' ? 'psychologists' : 'institutions')
      .where({ id })
      .first();

    if (!entity) {
      return res.status(404).json({ error: `${type} not found` });
    }

    // Create payment
    const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': uuid(),
        'Authorization': 'Basic ' + Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': uuid(),
        'Authorization': 'Basic ' + Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')
      },
      body: JSON.stringify({
        amount: {
          value: PROMOTION_PRICES[type].toFixed(2),
          currency: 'RUB'
        },
        confirmation: {
          type: 'redirect',
          return_url: `https://kpt.arisweb.ru/dashboard/${type}`
        },
        description: `Поднятие ${type === 'psychologist' ? 'психолога' : 'института'} в топ`,
        metadata: {
          type,
          entity_id: id,
          user_id: req.user.id
        },
        capture: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('YooKassa API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    
    // Save promotion request
    await db('promotions').insert({
      id: uuid(),
      type,
      entity_id: id,
      payment_id: data.id,
      amount: PROMOTION_PRICES[type],
      status: 'pending',
      created_at: new Date()
    });

    res.json({
      success: true,
      payment_url: data.confirmation.confirmation_url
    });
  } catch (error) {
    console.error('Promotion error:', error);
    res.status(500).json({ error: 'Failed to process promotion' });
  }
});

export default router;