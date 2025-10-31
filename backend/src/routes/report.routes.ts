import { Router } from 'express';
import { generateReport, getReports } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', generateReport);
router.get('/', getReports);

export default router;
