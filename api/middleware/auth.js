import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);

  const token = authHeader?.startsWith('Bearer ') ? 
    authHeader.substring(7) : authHeader;
  
  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await db('users')
      .select('*')
      .where({ id: decoded.id })
      .first();
    
    console.log('Found user:', { id: user?.id, role: user?.role });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    delete user.password_hash;
    
    req.user = user;
    console.log('Set req.user:', { id: req.user.id, role: req.user.role });
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      details: error.message
    });
  }
};

export { authenticateToken };