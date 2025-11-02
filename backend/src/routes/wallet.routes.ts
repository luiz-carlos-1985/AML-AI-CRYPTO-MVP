import { Router } from 'express';
import { createWallet, getWallets, getWallet, updateWallet, deleteWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth';
import { checkWalletLimit } from '../middleware/planLimits';

const router = Router();

router.use(authenticate);

router.post('/', checkWalletLimit, createWallet);
router.get('/', getWallets);
router.get('/:id', getWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

export default router;
