import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { getBucket } from '../services/storage.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

router.post('/logo', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });
    const bucket = getBucket();
    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
    const ts = Date.now();
    const storagePath = `logos/${ts}-${rand}.${ext}`;

    const contentType = req.file.mimetype && req.file.mimetype.startsWith('image/')
      ? req.file.mimetype
      : ext === 'png'
        ? 'image/png'
        : 'image/jpeg';

    const file = bucket.file(storagePath);
    await file.save(req.file.buffer, {
      contentType,
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
      resumable: false,
    });

    // Signed URL for public access
    const [url] = await file.getSignedUrl({ action: 'read', expires: '2099-12-31' });
    res.json({ logoUrl: url, logoStoragePath: storagePath });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;

