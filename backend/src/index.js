import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
// src/index.js
import certRoutes from './routes/certificates.js'; // <-- this must match the file name on disk
import verifyRoutes from './routes/verify.js';
import publicRoutes from './routes/public.js';
import instRoutes from './routes/institutions.js';
import uploadRoutes from './routes/uploads.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// Robust CORS handling
const rawOrigins = process.env.CORS_ORIGIN || '';
// If CORS_ORIGIN is '*', reflect request origin (any) by using origin: true.
// If it's a comma-separated list, pass the array.
// If empty, default to true for local dev.
const corsOrigin = rawOrigins.trim() === '*'
  ? true
  : rawOrigins
    ? rawOrigins.split(',').map(s => s.trim()).filter(Boolean)
    : true;

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options('*', cors(corsOptions));

app.get('/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api', authRoutes);                    // /api/register, /api/login
app.use('/api/certificates', certRoutes);       // POST /api/certificates
app.use('/api/verify', verifyRoutes);           // GET /api/verify?...
app.use('/api/public', publicRoutes);           // GET /api/public?...
app.use('/api/institutions', instRoutes);       // GET /api/institutions/issuers, /ledger
app.use('/api/upload', uploadRoutes);           // POST /api/upload/logo

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Graphene API listening on :${port}`));
