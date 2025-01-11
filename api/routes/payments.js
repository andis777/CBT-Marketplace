import express from 'express';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';
import { db } from '../db/connection.js';

const router = express.Router();

/**
 * @swagger
 * /api/payment/history:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/history', async (req, res) => {
  try {
    const payments = await db('payments')
      .select('*')
      .orderBy('created_at', 'desc');

    res.json({ data: payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

const YOOKASSA_SHOP_ID = '1006610';
const YOOKASSA_SECRET_KEY = 'test_UFD7D11ZIcfWGUz8n1Lho5LdzjftKrplq2aJIcDzpc4';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';
const API_BASE_URL = 'https://kpt.arisweb.ru:8443';

// Success handler function
const handlePaymentSuccess = async (req, res) => {
  try {
    const { user_id, type, tier } = req.query;

    // Validate required parameters
    if (!user_id || !type || tier === undefined) {
      return res.status(400).json({
        message: 'Missing required parameters: user_id, type, or tier.'
      });
    }

    // Convert tier to number and validate
    const promotionTier = parseInt(tier);
    if (isNaN(promotionTier) || promotionTier < 1 || promotionTier > 2) {
      return res.status(400).json({
        message: 'Invalid tier value. Must be 1 or 2.'
      });
    }

    // Validate type parameter
    if (!['psychologist', 'institution'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid type parameter. Must be either "psychologist" or "institution".'
      });
    }

    // Calculate promotion end date (30 days from now)
    const topUntil = new Date();
    topUntil.setDate(topUntil.getDate() + 30);

    // Update the appropriate table based on type
    const tableName = type === 'psychologist' ? 'psychologists' : 'institutions';
    const result = await db(tableName)
      .where('user_id', user_id)
      .update({ 
        is_top: true,
        top_until: topUntil,
        promotion_tier: promotionTier,
        updated_at: new Date()
      });

    if (result === 0) {
      return res.status(404).json({
        message: `${type} with user_id ${user_id} not found.`
      });
    }

    // Log successful update
    console.log('Promotion updated successfully:', {
      type,
      user_id,
      tier: promotionTier,
      top_until: topUntil
    });

    // Redirect to dashboard payments tab
    return res.redirect('https://kpt.arisweb.ru/dashboard?tab=payments');
  } catch (error) {
    console.error('Error updating promotion:', error);
    // Redirect to dashboard with error parameter
    res.redirect('/dashboard?tab=payments&error=payment_failed');
  }
};

/**
 * @swagger
 * /api/payment/success:
 *   get:
 *     tags: [Payments]
 *     summary: Handle successful payment redirect
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user making the payment
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [psychologist, institution]
 *         description: Type of promotion
 *       - in: query
 *         name: tier
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion tier level
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promotion updated successfully
 *                 status:
 *                   type: string
 *                   enum: [completed, pending, failed]
 *                   example: completed
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/success', handlePaymentSuccess);

// Add alias route for /api/payment/success (singular)
router.get('/payment/success', handlePaymentSuccess);

// @swagger
// /api/payment:
//   post:
//     tags: [Payments]
//     summary: Create a new payment
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             required:
//               - amount
//               - description
//             properties:
//               amount:
//                 type: object
//                 properties:
//                   value:
//                     type: string
//                   currency:
//                     type: string
//               description:
//                 type: string
//     responses:
//       200:
//         description: Payment created successfully
//       400:
//         description: Invalid request
//       500:
//         description: Server error
router.post('/', async (req, res) => {
  try {
    const { amount, description, metadata } = req.body;
    const idempotenceKey = uuid();

    // Validate tier if present
    if (metadata?.tier !== undefined) {
      const tier = parseInt(metadata.tier);
      if (isNaN(tier) || tier < 1 || tier > 2) {
        return res.status(400).json({ error: 'Invalid tier value. Must be 1 or 2.' });
      }
    }

    // Validate amount structure
    if (!amount || typeof amount !== 'object' || !amount.value) {
      return res.status(400).json({ error: 'Invalid amount format' });
    }

    // Ensure tier is included in metadata
    const paymentMetadata = {
      ...metadata,
      tier: metadata?.tier || 1 // Default to tier 1 if not specified
    };

    const paymentData = {
      amount: {
        value: parseFloat(amount.value).toFixed(2),
        currency: amount.currency || 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${API_BASE_URL}/api/payment/success?user_id=${paymentMetadata.user_id}&type=${paymentMetadata.type}&tier=${paymentMetadata.tier}`
      },
      description,
      metadata: paymentMetadata,
      capture: true
    };

    const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': 'Basic ' + Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.json({
      success: true,
      payment_url: data.confirmation.confirmation_url,
      payment_id: data.id
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// @swagger
// /api/payment/{paymentId}:
//   get:
//     tags: [Payments]
//     summary: Get payment status
//     parameters:
//       - in: path
//         name: paymentId
//         required: true
//         schema:
//           type: string
//     responses:
//       200:
//         description: Payment status retrieved successfully
//       404:
//         description: Payment not found
//       500:
//         description: Server error
router.get('/:paymentId', async (req, res) => {
  try {
    const response = await fetch(`${YOOKASSA_API_URL}/payments/${req.params.paymentId}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// @swagger
// /api/payment/webhook:
//   post:
//     tags: [Payments]
//     summary: Handle YooKassa webhook
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             properties:
//               event:
//                 type: string
//               object:
//                 type: object
//     responses:
//       200:
//         description: Webhook processed successfully
//       400:
//         description: Invalid webhook data
//       500:
//         description: Server error
router.post('/webhook', async (req, res) => {
  try {
    const { event, object } = req.body;
    
    if (event === 'payment.succeeded') {
      const { metadata, id: payment_id } = object;
      
      if (!metadata || !metadata.type || !metadata.user_id || metadata.tier === undefined) {
        return res.status(400).json({ error: 'Missing required metadata' });
      }

      const { type, user_id, tier } = metadata;
      // Convert tier to number and validate
      const promotionTier = parseInt(tier);

      if (isNaN(promotionTier) || promotionTier < 1 || promotionTier > 2) {
        return res.status(400).json({ error: 'Invalid tier value' });
      }

      // Update promotion status
      await db('promotions')
        .where({ payment_id })
        .update({ 
          status: 'completed',
          promotion_tier: promotionTier,
          updated_at: new Date()
        });

      // Update entity's top status
      const tableName = type === 'psychologist' ? 'psychologists' : 'institutions';
      await db(tableName)
        .where({ user_id })
        .where('user_id', user_id)
        .update({ 
          is_top: true,
          promotion_tier: promotionTier,
          top_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

      console.log('Promotion updated successfully:', {
        type,
        user_id,
        tier: promotionTier,
        top_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      return res.json({ success: true });
    } else if (event === 'payment.canceled') {
      const { id: payment_id } = object;
      
      await db('promotions')
        .where({ payment_id })
        .update({ 
          status: 'failed',
          updated_at: new Date()
        });

      return res.json({ success: true });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;