import { Router } from 'express';
import { pool } from '../db.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signToken } from '../auth.js';
import crypto from 'crypto';

const router = Router();

const registerSchema = z.object({
  institutionName: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(1),
  stateProvince: z.string().min(1),
  contactName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  logoUrl: z.string().url().optional().nullable(),
  logoStoragePath: z.string().optional().nullable(),
});

// generate a base issuer id like GR-UNIVERSI2025
function baseIssuerId(name) {
  const slug = name.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8);
  const year = new Date().getFullYear();
  return `GR-${slug}${year}`;
}

// ensure uniqueness by appending a short suffix if needed
async function uniqueIssuerId(name) {
  const base = baseIssuerId(name);
  let candidate = base;
  let tries = 0;
  while (tries < 10) {
    const { rows } = await pool.query(
      `SELECT 1 FROM institutions WHERE issuer_id = $1 LIMIT 1`,
      [candidate]
    );
    if (rows.length === 0) return candidate;
    const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    candidate = `${base}-${suffix}`;
    tries++;
  }
  // extremely unlikely fallback
  return `${base}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const {
    institutionName,
    address,
    city,
    stateProvince,
    contactName,
    email,
    password,
    logoUrl = null,
    logoStoragePath = null,
  } = parsed.data;

  try {
    // 1) If the email already exists, return existing issuer (idempotent behavior)
    const existing = await pool.query(
      `SELECT issuer_id, name, email, logo_url FROM institutions WHERE email = $1`,
      [email]
    );
    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      return res.json({
        issuerId: row.issuer_id,
        alreadyExisted: true,
        institutionName: row.name,
        logoUrl: row.logo_url ?? null,
      });
    }

    // 2) Create fresh user
    const issuerId = await uniqueIssuerId(institutionName);
    const hash = await bcrypt.hash(password, 10);

    const insert = await pool.query(
      `INSERT INTO institutions
        (name, address, city, state_province, contact_name, email, password_hash, issuer_id, logo_url, logo_storage_path)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING issuer_id, name, logo_url`,
      [institutionName, address, city, stateProvince, contactName, email, hash, issuerId, logoUrl, logoStoragePath]
    );

    // 3) Append one ledger entry
    const txHash = crypto.randomBytes(32).toString('hex');
    const led = await pool.query(
      `INSERT INTO ledger (block_number, tx_hash, tx_type, status, issuer_id, payload)
       VALUES (nextval('block_seq'), $1, 'INSTITUTION_REGISTERED', 'CONFIRMED', $2, $3)
       RETURNING block_number, tx_hash`,
      [txHash, issuerId, { institutionName }]
    );

    res.json({
      issuerId: insert.rows[0].issuer_id,
      blockNumber: led.rows[0].block_number,
      txHash: led.rows[0].tx_hash,
      institutionName: insert.rows[0].name,
      logoUrl: insert.rows[0].logo_url ?? null,
      alreadyExisted: false,
    });
  } catch (e) {
    console.error(e);
    // if some other uniqueness constraint trips (rare with uniqueIssuerId), keep 409
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Email or Issuer already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const { rows } = await pool.query(`SELECT * FROM institutions WHERE email=$1`, [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({
    issuerId: user.issuer_id,
    institutionName: user.name,
    email: user.email,
    logoUrl: user.logo_url ?? null,
  });

  res.json({
    token,
    institutionName: user.name,
    issuerId: user.issuer_id,
    logoUrl: user.logo_url ?? null,
  });
});

export default router;
