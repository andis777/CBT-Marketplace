import knex from 'knex';
import knexConfig from '../knexfile.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'cbt.sqlite3');
const journalPath = `${dbPath}-journal`;

// Ensure database directory exists
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

// Remove existing database files
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database');
}
if (fs.existsSync(journalPath)) {
  fs.unlinkSync(journalPath);
  console.log('Removed existing journal file');
}

// Initialize knex with configuration
const db = knex(knexConfig.development);

async function migrate() {
  try {
    // Run migrations
    await db.migrate.latest();
    console.log('Migrations completed successfully');

    // Run seeds after migrations
    await db.seed.run();
    console.log('Seeds completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

migrate();