import { Router } from 'express';
import { getDashboardStats, getDashboardMetrics, getDashboardCharts, getRiskDistribution } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/metrics', getDashboardMetrics);
router.get('/charts', getDashboardCharts);
router.get('/risk-distribution', getRiskDistribution);

export default router;
