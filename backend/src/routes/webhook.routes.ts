import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  res.json([]);
});

router.post('/', authenticate, async (req, res) => {
  res.json({ success: true });
});

router.delete('/:id', authenticate, async (req, res) => {
  res.json({ success: true });
});

router.post('/:id/test', authenticate, async (req, res) => {
  res.json({ success: true });
});

export default router;
