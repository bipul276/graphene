import { Router } from 'express';
import { pool } from '../db.js';
import { z } from 'zod';
import { getReadContract } from '../../onchain/registry.js';
import { ethers } from 'ethers';

const router = Router();

const qs = z.object({
  certificateId: z.string().min(1),
  issuerId: z.string().min(1),
  fileHash: z.string().regex(/^[a-f0-9]{64}$/i)
});

/**
 * Strategy:
 * 1) Try on-chain verification using getCertificate(issuerWallet, certId)
 *    - You need the issuer wallet address; if your DB stores `issuer_wallet_address` in institutions use it.
 *    - If not stored, we fall back to DB verification.
 * 2) If chain returns exists && fileHash matches, success.
 * 3) Else fallback to DB: match file_hash and return info.
 */
router.get('/', async (req, res) => {
  const parsed = qs.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ isValid: false, errorMessage: 'Invalid query' });
  }

  const { certificateId, issuerId, fileHash } = parsed.data;
  const hex32 = '0x' + fileHash.toLowerCase();

  try {
    // First, load institution to discover its wallet address (if you store it)
    const inst = await pool.query(
      `SELECT name AS institution_name, issuer_wallet_address
         FROM institutions WHERE issuer_id=$1`,
      [issuerId]
    );
    const institution = inst.rows[0];

    // 1) On-chain verification (if we have a wallet address and registry configured)
    if (institution?.issuer_wallet_address) {
      try {
        const registry = getReadContract();
        const issuerWallet = institution.issuer_wallet_address;
        const [exists, onFileHash, metadataCid, issuedAt/*, storedIssuer*/] =
          await registry.getCertificate(issuerWallet, certificateId);

        if (exists && ethers.hexlify(onFileHash).toLowerCase() === hex32.toLowerCase()) {
          // Success from chain
          return res.json({
            isValid: true,
            certificateTitle: undefined, // we can enrich from DB below if desired
            studentName: undefined,
            institutionName: institution.institution_name,
            issuerId,
            issueDate: issuedAt ? new Date(Number(issuedAt) * 1000).toISOString() : null,
            blockchainHash: null,   // we could look up last tx from DB if needed
            blockNumber: null,
            metadataCid
          });
        }
      } catch (chainErr) {
        // chain read failed — we’ll fallback to DB
        // eslint-disable-next-line no-console
        console.warn('[verify][chain-read-failed]', chainErr?.reason || chainErr?.message || chainErr);
      }
    }

    // 2) DB fallback
    const { rows } = await pool.query(
      `SELECT c.*, i.name AS institution_name
         FROM certificates c
         JOIN institutions i ON i.issuer_id=c.issuer_id
        WHERE c.certificate_id=$1 AND c.issuer_id=$2`,
      [certificateId, issuerId]
    );

    const cert = rows[0];
    if (!cert) return res.json({ isValid: false, errorMessage: 'Certificate not found in registry' });

    const match = (cert.file_hash || '').toLowerCase() === fileHash.toLowerCase();
    if (!match) {
      return res.json({ isValid: false, errorMessage: 'Document hash does not match registry record' });
    }

    // pull a corresponding ledger row for block info if you want to display
    const led = await pool.query(
      `SELECT tx_hash, block_number FROM ledger
        WHERE certificate_id=$1 AND issuer_id=$2
        ORDER BY block_number DESC LIMIT 1`,
      [certificateId, issuerId]
    );

    return res.json({
      isValid: true,
      certificateTitle: cert.title,
      studentName: cert.student_name,
      institutionName: cert.institution_name,
      issuerId: cert.issuer_id,
      issueDate: cert.issued_at,
      blockchainHash: cert.onchain_tx_hash || led.rows[0]?.tx_hash || null,
      blockNumber: led.rows[0]?.block_number || null,
      metadataCid: cert.metadata_cid || null
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ isValid: false, errorMessage: e?.message || 'Server error' });
  }
});

export default router;
