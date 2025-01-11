import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'cbt.sqlite3');
const journalPath = `${dbPath}-journal`;

// Delete existing database files
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database file');
  }
  if (fs.existsSync(journalPath)) {
    fs.unlinkSync(journalPath);
    console.log('Removed existing journal file');
  }
} catch (error) {
  console.error('Error removing database files:', error);
}

// Initialize database connection
const db = knex(knexConfig.development);

async function reset() {
  try {
    // Run migrations
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');

    // Run seeds
    console.log('Running seeds...');
    await db.seed.run();
    console.log('Seeds completed successfully');

    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

reset();