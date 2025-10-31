import { Router } from 'express';
import { getAlerts, markAsRead, markAsResolved } from '../controllers/alert.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getAlerts);
router.patch('/:id/read', markAsRead);
router.patch('/:id/resolve', markAsResolved);

export default router;
