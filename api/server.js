import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import psychologistsRoutes from './routes/psychologists.js';
import appointmentsRoutes from './routes/appointments.js';
import institutionsRoutes from './routes/institutions.js';
import articlesRoutes from './routes/articles.js';
import paymentsRoutes from './routes/payments.js';
import servicesRoutes from './routes/services.js';
import promotionsRoutes from './routes/promotions.js';
import { db } from './db/connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CBT Marketplace API',
      version: '1.0.0',
      description: 'API documentation for CBT Marketplace platform',
    },
    servers: [
      {
        url: 'https://kpt.arisweb.ru:8443',
        description: 'Production server',
      }
    ],
  },
  apis: ['./api/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/psychologists', psychologistsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/institutions', institutionsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/payment', paymentsRoutes);
app.use('/api/promotions', promotionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8443;

// Check if running with SSL
const HOST = process.env.HOST || 'kpt.arisweb.ru';

// Check if running with SSL
const isSSL = process.argv.includes('--ssl');

// Initialize database
try {
  await db.raw('SELECT 1');
  console.log('Database connected successfully');
} catch (err) {
  console.error('Database connection failed:', err);
  process.exit(1);
}

// Initialize database
try {
  await db.raw('SELECT 1');
  console.log('Database connected successfully');
} catch (err) {
  console.error('Database connection failed:', err);
  process.exit(1);
}

if (isSSL) {
  const keyPath = '/var/www/fastuser/data/www/kpt.arisweb.ru/certs/kpt.arisweb.ru_2024-11-20-11-55_38.key';
  const certPath = '/var/www/fastuser/data/www/kpt.arisweb.ru/certs/kpt.arisweb.ru_2024-11-20-11-55_38.crt';
  
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error('SSL certificates not found at:');
    console.error(`Key: ${keyPath}`);
    console.error(`Cert: ${certPath}`);
    process.exit(1);
  }

  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running at https://${HOST}:${PORT}`);
    console.log(`Swagger documentation available at https://${HOST}:${PORT}/api-docs`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(`Swagger documentation available at http://${HOST}:${PORT}/api-docs`);
  });
}