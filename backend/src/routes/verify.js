import { Router } from 'express';
import verifyPublic from './public.js';

const router = Router();

// You can mount the same handler or proxy to /public
router.get('/', verifyPublic);

export default router;
