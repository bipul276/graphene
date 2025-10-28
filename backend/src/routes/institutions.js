import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../auth.js';
import { z } from 'zod';
import { getWriteContract } from '../../onchain/registry.js';

const router = Router();

router.get('/issuers', async (req, res) => {
  const q = (req.query.search || '').toString().toLowerCase();
  const { rows } = await pool.query(`
    SELECT i.name, i.city, i.state_province, i.issuer_id,
           i.verified, i.created_at, i.logo_url,
           COALESCE(cnt.count,0) as certificates_issued,
           MAX(l.created_at) as last_activity,
           COALESCE(fb.approvals,0) as approvals,
           COALESCE(fb.reports,0) as reports,
           COALESCE(fb.votes,0) as votes
      FROM institutions i
      LEFT JOIN (SELECT issuer_id, COUNT(*) as count FROM certificates GROUP BY issuer_id) cnt
        ON cnt.issuer_id = i.issuer_id
      LEFT JOIN ledger l ON l.issuer_id = i.issuer_id
      LEFT JOIN (
        SELECT issuer_id,
               SUM(CASE WHEN vote='approve' THEN 1 ELSE 0 END) as approvals,
               SUM(CASE WHEN vote='report' THEN 1 ELSE 0 END) as reports,
               COUNT(*) as votes
          FROM institution_feedback
         GROUP BY issuer_id
      ) fb ON fb.issuer_id = i.issuer_id
     GROUP BY i.name,i.city,i.state_province,i.issuer_id,i.verified,i.created_at,i.logo_url,cnt.count,fb.approvals,fb.reports,fb.votes
     ORDER BY i.name ASC
  `);
  const filtered = q
    ? rows.filter(r => [r.name, r.city, r.state_province, r.issuer_id].join(' ').toLowerCase().includes(q))
    : rows;

  // shape to match FE expectations
  const mapped = filtered.map(r => ({
    id: r.issuer_id,
    name: r.name,
    location: `${r.city}, ${r.state_province}`,
    establishedDate: new Date(r.created_at).getFullYear().toString(),
    issuerId: r.issuer_id,
    imageUrl: r.logo_url || '', // may be empty string if not provided
    certificatesIssued: Number(r.certificates_issued || 0),
    lastActivity: r.last_activity ? new Date(r.last_activity).toISOString() : null,
    verified: !!r.verified,
    approvals: Number(r.approvals || 0),
    reports: Number(r.reports || 0),
    approvalRate: (Number(r.votes || 0) > 0) ? Number(((Number(r.approvals||0) / Number(r.votes||0)) * 100).toFixed(1)) : 0
  }));

  res.json(mapped);
});

router.get('/ledger', async (req, res) => {
  const q = (req.query.search || '').toString().toLowerCase();
  const { rows } = await pool.query(`
    SELECT id, block_number, tx_hash, tx_type, status,
           certificate_id, issuer_id, created_at, payload
      FROM ledger
     ORDER BY block_number DESC
     LIMIT 500
  `);
  const latest = rows[0]?.block_number || null;
  const filtered = q
    ? rows.filter(r =>
        [
          r.tx_hash,
          r.certificate_id || '',
          r.issuer_id || '',
          (r.payload && (r.payload.title || r.payload.studentName || '')) || ''
        ]
        .join(' ')
        .toLowerCase()
        .includes(q)
      )
    : rows;

  const items = filtered.map(t => ({
    id: t.id.toString(),
    blockNumber: Number(t.block_number),
    hash: t.tx_hash,
    certificateTitle: t.payload?.title || (t.tx_type === 'INSTITUTION_REGISTERED' ? 'Institution Registration' : 'Certificate'),
    issuedBy: t.issuer_id || (t.payload?.institutionName || ''),
    issuerId: t.issuer_id || '',
    timestamp: new Date(t.created_at).toISOString(),
    transactionType: t.tx_type,
    status: t.status
  }));

  res.json({ items, latestBlock: latest, total: items.length });
});

export default router;

// Wallet binding for issuers (JWT required)
const walletSchema = z.object({ walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/) });

router.patch('/me/wallet', requireAuth, async (req, res) => {
  const parsed = walletSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: 'Invalid wallet address' });
  const { walletAddress } = parsed.data;
  try {
    await pool.query(
      `UPDATE institutions SET issuer_wallet_address=$1 WHERE issuer_id=$2`,
      [walletAddress, req.user.issuerId]
    );
    // Try to grant issuer role on-chain (best-effort)
    let chain = { granted: false };
    try {
      const { contract } = getWriteContract();
      const tx = await contract.grantIssuer(walletAddress);
      await tx.wait();
      chain = { granted: true, txHash: tx.hash };
    } catch (e) {
      // non-fatal: chain config might be absent; still return success for binding
      // eslint-disable-next-line no-console
      console.warn('[wallet][grantIssuer] skipped/failed:', e?.reason || e?.message || e);
    }
    return res.json({ ok: true, issuerWalletAddress: walletAddress, chain });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to bind wallet' });
  }
});

// Profile for current institution (JWT required)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT name, email, issuer_id, logo_url, issuer_wallet_address, verified, created_at
         FROM institutions WHERE issuer_id=$1`,
      [req.user.issuerId]
    );
    const me = rows[0] || null;
    if (!me) return res.status(404).json({ error: 'Not found' });
    return res.json({
      institutionName: me.name,
      email: me.email,
      issuerId: me.issuer_id,
      logoUrl: me.logo_url || null,
      issuerWalletAddress: me.issuer_wallet_address || null,
      verified: !!me.verified,
      createdAt: me.created_at,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Public feedback endpoint: allow anyone to report or approve an institution
const feedbackSchema = z.object({
  vote: z.enum(['approve','report']),
  reason: z.string().max(500).optional().nullable()
});

router.post('/:issuerId/report', async (req, res) => {
  const issuerId = req.params.issuerId;
  const parsed = feedbackSchema.safeParse(req.body || {});
  if (!issuerId || !parsed.success) return res.status(400).json({ error: 'Invalid request' });
  try {
    // ensure issuer exists
    const check = await pool.query(`SELECT 1 FROM institutions WHERE issuer_id=$1 LIMIT 1`, [issuerId]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Institution not found' });
    // Resolve client IP (support proxies)
    const ipHeader = (req.headers['x-forwarded-for'] || '').toString();
    const firstHop = ipHeader.split(',')[0].trim();
    const rawIp = firstHop || (req.socket.remoteAddress || '').toString();
    const clientIp = rawIp.replace(/^::ffff:/, '').slice(0, 255);

    // 30s cooldown per IP per issuer
    const COOL_MS = 30 * 1000;
    const recent = await pool.query(
      `SELECT created_at FROM institution_feedback WHERE issuer_id=$1 AND client_ip=$2 ORDER BY created_at DESC LIMIT 1`,
      [issuerId, clientIp]
    );
    if (recent.rowCount > 0) {
      const last = new Date(recent.rows[0].created_at).getTime();
      const now = Date.now();
      const diff = now - last;
      if (diff < COOL_MS) {
        const wait = Math.ceil((COOL_MS - diff) / 1000);
        return res.status(429).json({ error: `Please wait ${wait}s before voting again for this institution`, retryAfterSeconds: wait });
      }
    }
    await pool.query(
      `INSERT INTO institution_feedback (issuer_id, vote, reason, client_ip) VALUES ($1,$2,$3,$4)`,
      [issuerId, parsed.data.vote, parsed.data.reason || null, clientIp]
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});
