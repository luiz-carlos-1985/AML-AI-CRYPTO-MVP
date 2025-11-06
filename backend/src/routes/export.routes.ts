import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:type', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Export functionality not implemented' });
});

export default router;
