import knex from 'knex';
import knexConfig from '../knexfile.js';

// Log config without sensitive data
const sanitizedConfig = {
  ...knexConfig.development,
  connection: { ...knexConfig.development.connection, password: '[REDACTED]' }
};
console.log('Initializing database connection with config:', sanitizedConfig);

const db = knex(knexConfig.development);

// Test database connection
async function testConnection() {
  try {
    const result = await db.raw('SELECT 1 + 1 as test');
    console.log('Database connection test result:', result);
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

testConnection();

// Handle cleanup on app shutdown
process.on('SIGINT', () => {
  db.destroy(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

export { db };