// backend/src/db.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Determine SSL setting
// - Local Postgres → set DB_SSL=disable (or leave empty) -> ssl=false
// - Hosted Postgres (Neon/Supabase/Render/etc) → DB_SSL=require -> ssl={ rejectUnauthorized:false }
function resolveSSL() {
  const flag = (process.env.DB_SSL || process.env.PGSSLMODE || '').toLowerCase();

  // If DATABASE_URL explicitly asks sslmode=require, honor it.
  const url = process.env.DATABASE_URL || '';
  const urlRequestsSSL = /[\?&]sslmode=require/i.test(url);

  if (flag === 'require' || urlRequestsSSL) {
    return { rejectUnauthorized: false };
  }
  if (flag === 'disable' || flag === 'false' || flag === 'off') {
    return false;
  }

  // Heuristic: if it looks like a hosted DB domain, default to SSL
  if (/(neon\.tech|supabase\.co|render\.com|amazonaws\.com|herokuapp\.com|elephantsql\.com)/i.test(url)) {
    return { rejectUnauthorized: false };
  }

  // Default for local dev: no SSL
  return false;
}

const ssl = resolveSSL();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

// Simple helper if you want to use in other modules
export const query = (text, params) => pool.query(text, params);

// --- Migration runner: reads db.sql and executes it ---
export async function migrate() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const sqlPath = path.join(__dirname, '..', 'db.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`db.sql not found at: ${sqlPath}`);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log(`Connecting with SSL=${ssl ? 'enabled' : 'disabled'}`);
  await pool.query(sql);
  console.log('DB migrated ✅');
}

if (process.argv[2] === 'migrate') {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
