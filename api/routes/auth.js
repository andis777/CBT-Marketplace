import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/connection.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get role-specific profile
    let profile = null;
    if (user.role === 'psychologist') {
      profile = await db('psychologists')
        .where({ user_id: user.id })
        .first();
    } else if (user.role === 'institute') {
      profile = await db('institutions')
        .where({ user_id: user.id })
        .first();
    }

    delete user.password_hash;
    res.json({ 
      user: {
        ...user,
        profile
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db('users')
      .where({ id: decoded.id })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});
// Helper function to normalize email
const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    
    console.log('Login attempt:', { 
      email,
      normalizedEmail: email,
      query: 'SELECT * FROM users WHERE email = ?'
    });
    
    const user = await db('users')
      .where({ email })
      .first();
    
    if (!user) {
      // Try alternative email formats
      const alternativeEmails = [
        email.replace('@kpt.ru', '@кпт.рф'),
        email.replace('@кпт.рф', '@kpt.ru')
      ];
      
      console.log('Trying alternative emails:', alternativeEmails);
      
      const alternativeUser = await db('users')
        .whereIn('email', alternativeEmails)
        .first();
        
      if (!alternativeUser) {
        console.log('User not found with any email variant');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      user = alternativeUser;
    }
    
    if (!user) {
      console.log('User not found with any email format');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful:', { email: user.email, role: user.role });
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Generated token:', {
      userId: user.id,
      role: user.role,
      tokenLength: token.length
    });

    let profile = null;
    if (user.role === 'psychologist') {
      profile = await db('psychologists')
        .where({ user_id: user.id })
        .first();
    } else if (user.role === 'institute') {
      profile = await db('institutions')
        .where({ user_id: user.id })
        .first();
    } else if (user.role === 'client') {
      profile = await db('clients')
        .where({ user_id: user.id })
        .first();
    }
    
    delete user.password_hash;
    
    console.log('Login response prepared:', {
      userId: user.id,
      role: user.role,
      hasProfile: !!profile
    });
    res.json({
      token: token,
      user: { ...user, profile }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
import { generateUniqueUserId } from '../utils/transliterate.js';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, phone, name, role } = req.body;
    
    console.log('Registration attempt:', { email, name, role, phone });

    // Validate required fields
    if (!email || !password || !phone || !name || !role) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: { email, phone, name, role }
      });
    }
    
    // Check if email already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already registered',
        details: { email }
      });
    }
    
    // Create user
    const userId = await generateUniqueUserId(db, name);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: userId,
      email,
      password_hash: hashedPassword,
      name,
      role,
      phone,
      is_verified: false,
      is_active: true
    };
    
    console.log('Creating user:', { ...user, password_hash: '[REDACTED]' });

    await db('users').insert(user);
    
    // Generate token
    const token = jwt.sign(
      { id: userId, role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Create role-specific profile
    if (role === 'psychologist') {
      await db('psychologists').insert({
        id: uuid(),
        user_id: userId,
        name,
        description: '',
        experience: 0,
        rating: 0,
        reviews_count: 0,
        specializations: '[]',
        languages: '[]',
        memberships: '[]',
        education: '[]',
        certifications: '[]',
        gallery: '[]',
        location: '{"city":"","country":""}',
        contacts: JSON.stringify({ phone, email }),
        services: '[]'
      });
    } else if (role === 'institute') {
      await db('institutions').insert({
        id: uuid(),
        user_id: userId,
        name,
        description: '',
        address: '',
        psychologists_count: 0,
        services: '[]',
        contacts: JSON.stringify({ phone, email }),
        is_verified: false
      });
    } else if (role === 'client') {
      await db('clients').insert({
        id: uuid(),
        user_id: userId,
        preferences: '{}',
        saved_psychologists: '[]',
        saved_institutions: '[]'
      });
    }
    
    delete user.password_hash;
    console.log('Registration successful:', { userId, role });
    res.status(201).json({ 
      token: `Bearer ${token}`,
      user: {
        id: userId,
        email,
        name,
        role,
        phone,
        is_verified: false,
        is_active: true
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;