import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { pool } from '../db.js';
import { z } from 'zod';
import crypto from 'crypto';
import { getWriteContract } from '../../onchain/registry.js';

const router = Router();

/**
 * Input the frontend already sends:
 * - studentName
 * - title
 * - certificateId
 * - fileHash (hex string sha256, 64 hex chars)
 * Optional new:
 * - metadataCid (string)  -> let frontend pass Firebase path or IPFS CID if you generate one
 */
const issueSchema = z.object({
  studentName: z.string().min(2),
  title: z.string().min(2),
  certificateId: z.string().min(2),
  fileHash: z.string().regex(/^[a-f0-9]{64}$/i), // SHA-256 hex
  metadataCid: z.string().optional().nullable()
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = issueSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { studentName, title, certificateId, fileHash, metadataCid = null } = parsed.data;
  const issuerId = req.user.issuerId;

  try {
    // 1) Write on-chain first (preferred)
    const { contract, wallet, provider } = getWriteContract();

    // confirm this wallet is allowed issuer (your deploy script already granted; good to check)
    const allowed = await contract.isIssuer(wallet.address);
    if (!allowed) {
      return res.status(403).json({ error: 'Backend chain wallet is not an authorized issuer' });
    }

    // fileHash to bytes32
    const bytes32Hash = '0x' + fileHash.toLowerCase();
    const tx = await contract.issueCertificate(certificateId, bytes32Hash, metadataCid || '');
    const receipt = await tx.wait();

    // chain details
    const onchainTxHash = receipt?.hash || tx.hash;
    const onchain_chain_id = (await provider.getNetwork()).chainId?.toString() || null;
    const blockNumber = receipt?.blockNumber || null;

    // 2) Persist in DB (upsert style)
    const insert = await pool.query(
      `INSERT INTO certificates
        (certificate_id, title, student_name, file_hash, issuer_id, onchain_tx_hash, onchain_chain_id, metadata_cid)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (certificate_id, issuer_id) DO UPDATE SET
         title=EXCLUDED.title,
         student_name=EXCLUDED.student_name,
         file_hash=EXCLUDED.file_hash,
         onchain_tx_hash=EXCLUDED.onchain_tx_hash,
         onchain_chain_id=EXCLUDED.onchain_chain_id,
         metadata_cid=EXCLUDED.metadata_cid
       RETURNING certificate_id, issuer_id`,
      [certificateId, title, studentName, fileHash, issuerId, onchainTxHash, onchain_chain_id, metadataCid]
    );

    // 3) Append to ledger (db) for your UI
    const simulatedTxHash = crypto.randomBytes(32).toString('hex'); // keep your local ledger too
    const led = await pool.query(
      `INSERT INTO ledger (block_number, tx_hash, tx_type, status, certificate_id, issuer_id, payload)
       VALUES (nextval('block_seq'), $1, 'CERTIFICATE_ISSUED','CONFIRMED', $2, $3, $4)
       RETURNING block_number, tx_hash`,
      [simulatedTxHash, certificateId, issuerId, { title, studentName, fileHash, onchainTxHash, onchain_chain_id, metadataCid }]
    );

    return res.json({
      txHash: onchainTxHash,              // expose real chain tx
      blockNumber,                        // real block
      fileHash,
      certificateId,
      issuerId,
      onchainChainId: onchain_chain_id,
      metadataCid
    });
  } catch (e) {
    // handle uniqueness from DB
    if (e.code === '23505') {
      return res.status(409).json({ error: 'certificateId already exists for this issuer' });
    }
    console.error(e);
    return res.status(500).json({ error: e?.reason || e?.message || 'Server error' });
  }
});

export default router;
