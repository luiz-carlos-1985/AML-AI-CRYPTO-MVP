import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:type', authenticate, async (req, res) => {
  const { type } = req.params;
  const { format } = req.body;
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=export.${format}`);
  res.send('Mock export data');
});

export default router;
