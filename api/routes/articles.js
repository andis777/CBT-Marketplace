import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

// Helper function to parse JSON fields
const parseArticle = (article) => {
  try {
    return {
      ...article,
      tags: typeof article.tags === 'string' 
        ? JSON.parse(article.tags) 
        : article.tags || []
    };
  } catch (error) {
    console.error('Error parsing article data:', error);
    return article;
  }
};

const router = express.Router();

/**
 * @swagger
 * /api/articles:
 *   get:
 *     tags: [Articles]
 *     summary: Get articles list
 *     parameters:
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/', async (req, res) => {
  try {
    let query = db('articles')
      .join('users', 'articles.author_id', 'users.id')
      .select(
        'articles.*',
        'users.name as author_name',
        'users.avatar_url as author_avatar'
      );
    
    if (req.query.author_id) {
      query.where('author_id', req.query.author_id);
    }

    if (req.query.tag) {
      query.whereRaw('JSON_CONTAINS(articles.tags, ?)', [JSON.stringify(req.query.tag)]);
    }

    const articles = await query.orderBy('articles.created_at', 'desc');
    const data = articles.map(article => ({
      ...article,
      tags: typeof article.tags === 'string' ? 
            JSON.parse(article.tags || '[]') : 
            Array.isArray(article.tags) ? article.tags : []
    }));
    res.json({ data });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/articles:
 *   post:
 *     tags: [Articles]
 *     summary: Create new article
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Article created
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating article with user:', {
      userId: req.user.id,
      userRole: req.user.role,
      body: req.body
    });

    if (!['psychologist', 'institute'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only psychologists and institutes can create articles' });
    }

    const article = {
      id: uuidv4(),
      author_id: req.user.id,
      title: req.body.title,
      preview: req.body.preview || req.body.content.substring(0, 200).replace(/[#*_]/g, ''), // Remove markdown
      content: req.body.content,
      image_url: req.body.image || null,
      tags: JSON.stringify(req.body.tags || []),
      status: 'draft',
      institution_id: undefined,
      psychologist_id: undefined
    };

    console.log('Prepared article data:', article);

    try {
      // First check if profile exists
      if (req.user.role === 'psychologist') {
        const profile = await db('psychologists')
          .where({ user_id: req.user.id })
          .first();
        if (profile) {
          article.psychologist_id = profile.id;
        }
      } else if (req.user.role === 'institute') {
        const profile = await db('institutions')
          .where({ user_id: req.user.id })
          .first();
        if (profile) {
          article.institution_id = profile.id;
        }
      }

      console.log('Article data before insert:', article);
      await db('articles').insert(article);
      console.log('Article inserted successfully');
    } catch (error) {
      console.error('Database error inserting article:', error);
      console.error('SQL Error:', error.sqlMessage);
      throw error;
    }

    const created = await db('articles')
      .join('users', 'articles.author_id', 'users.id')
      .select(
        'articles.*',
        'users.name as author_name',
        'users.avatar_url as author_avatar'
      )
      .where('articles.id', article.id)
      .first();

    console.log('Retrieved created article:', created);

    if (!created) {
      throw new Error('Failed to retrieve created article');
    }

    // Format response
    const response = {
      id: created.id,
      title: created.title,
      preview: created.preview,
      content: created.content,
      image: created.image_url,
      authorId: created.author_id,
      author: created.author_name,
      authorAvatar: created.author_avatar,
      views: created.views || 0,
      tags: typeof created.tags === 'string' ? JSON.parse(created.tags) : created.tags || [],
      date: created.created_at,
      status: created.status
    };

    console.log('Sending response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get('/:id', async (req, res) => {
  try {
    const article = await db('articles')
      .join('users', 'articles.author_id', 'users.id')
      .select(
        'articles.*',
        'users.name as author_name',
        'users.avatar_url as author_avatar'
      )
      .where('articles.id', '=', req.params.id)
      .first();

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     tags: [Articles]
 *     summary: Delete article by ID
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
 *         description: Article deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to delete this article
 *       404:
 *         description: Article not found
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the article to check ownership
    const article = await db('articles')
      .where({ id })
      .first();

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user is authorized to delete
    if (article.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    // Delete the article
    await db('articles')
      .where({ id })
      .delete();

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;