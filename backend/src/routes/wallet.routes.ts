import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  generateWallet,
  importFromMnemonic,
  importFromPrivateKey,
  createWallet,
  getWallets,
  getWallet,
  updateWallet,
  deleteWallet,
  syncWallet
} from '../controllers/wallet.controller';

const router = Router();

router.use(authenticate);

// Generate new wallet
router.post('/generate', generateWallet);

// Import wallet from mnemonic
router.post('/import/mnemonic', importFromMnemonic);

// Import wallet from private key
router.post('/import/private-key', importFromPrivateKey);

// Get all wallets
router.get('/', getWallets);

// Add wallet by address
router.post('/', createWallet);

// Get specific wallet
router.get('/:id', getWallet);

// Update wallet
router.put('/:id', updateWallet);

// Sync wallet transactions
router.post('/:id/sync', syncWallet);

// Delete wallet
router.delete('/:id', deleteWallet);

export default router;
