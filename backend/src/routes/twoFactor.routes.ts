import { Router } from 'express';
import { setup2FA, verify2FA, disable2FA, get2FAStatus } from '../controllers/twoFactor.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/status', get2FAStatus);
router.post('/setup', setup2FA);
router.post('/verify', verify2FA);
router.post('/disable', disable2FA);

export default router;
