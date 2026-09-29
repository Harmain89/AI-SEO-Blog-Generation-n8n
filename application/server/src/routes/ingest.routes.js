import { Router } from 'express';
import { requireIngestToken } from '../middleware/auth.js';
import { ingestPost } from '../controllers/ingest.controller.js';

const router = Router();

router.post('/ingest/posts', requireIngestToken, ingestPost);

export default router;
