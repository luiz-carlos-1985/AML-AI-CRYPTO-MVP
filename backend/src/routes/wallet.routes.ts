import { Router } from 'express';
import { createWallet, getWallets, getWallet, updateWallet, deleteWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createWallet);
router.get('/', getWallets);
router.get('/:id', getWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

export default router;
