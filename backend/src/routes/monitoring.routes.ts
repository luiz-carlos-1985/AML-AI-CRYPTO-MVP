import { Router } from 'express';
import { addWalletToMonitoring, getMonitoredWallets, getWalletTransactions, getRiskAlerts } from '../controllers/monitoring.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/wallet', addWalletToMonitoring);
router.get('/wallets', getMonitoredWallets);
router.get('/wallet/:walletId/transactions', getWalletTransactions);
router.get('/alerts', getRiskAlerts);

export default router;