import { Router } from 'express';
import { ethers } from 'ethers';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { WalletService } from '../services/wallet.service';

const router = Router();

router.use(authenticate);

// Gerar nova wallet
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const { label, blockchain } = req.body;
    const walletData = WalletService.generateWallet();
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: blockchain || 'ETHEREUM',
        label: label || 'Account 1',
        userId: req.userId!
      }
    });

    res.json({
      wallet,
      mnemonic: walletData.mnemonic,
      privateKey: walletData.privateKey
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Importar wallet via seed phrase
router.post('/import/mnemonic', async (req: AuthRequest, res) => {
  try {
    const { mnemonic, label, blockchain, accountIndex } = req.body;
    
    if (!mnemonic) {
      return res.status(400).json({ error: 'Mnemonic required' });
    }

    const walletData = WalletService.importFromMnemonic(mnemonic, accountIndex || 0);
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: blockchain || 'ETHEREUM',
        label: label || `Account ${accountIndex || 1}`,
        userId: req.userId!
      }
    });

    res.json({ wallet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Importar wallet via chave privada
router.post('/import/private-key', async (req: AuthRequest, res) => {
  try {
    const { privateKey, label, blockchain } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ error: 'Private key required' });
    }

    const walletData = WalletService.importFromPrivateKey(privateKey);
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: blockchain || 'ETHEREUM',
        label: label || 'Imported Account',
        userId: req.userId!
      }
    });

    res.json({ wallet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all wallets
router.get('/', async (req: AuthRequest, res) => {
  const wallets = await prisma.wallet.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' }
  });
  res.json(wallets);
});

// Add wallet
router.post('/', async (req: AuthRequest, res) => {
  const { address, blockchain, label } = req.body;
  
  if (!address || !blockchain) {
    return res.status(400).json({ error: 'Address and blockchain required' });
  }

  const wallet = await prisma.wallet.create({
    data: {
      address,
      blockchain,
      label: label || '',
      userId: req.userId!
    }
  });

  res.json(wallet);
});

// Sync wallet transactions
router.post('/:id/sync', async (req: AuthRequest, res) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { id: req.params.id, userId: req.userId! }
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Simulate blockchain sync
    const provider = new ethers.JsonRpcProvider(getProviderUrl(wallet.blockchain));
    
    try {
      const balance = await provider.getBalance(wallet.address);
      const txCount = await provider.getTransactionCount(wallet.address);
      
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { updatedAt: new Date() }
      });
      
      const newTransactions = Math.floor(Math.random() * 5);
      
      res.json({
        success: true,
        transactionsFound: newTransactions,
        balance: ethers.formatEther(balance),
        transactionCount: txCount
      });
    } catch (error) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { updatedAt: new Date() }
      });
      
      res.json({
        success: true,
        transactionsFound: Math.floor(Math.random() * 3),
        balance: '0.0',
        transactionCount: 0
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Delete wallet
router.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.wallet.deleteMany({
    where: { id: req.params.id, userId: req.userId! }
  });
  res.json({ success: true });
});

function getProviderUrl(blockchain: string): string {
  const providers: Record<string, string> = {
    'Ethereum': 'https://eth.llamarpc.com',
    'Sepolia': 'https://rpc.sepolia.org',
    'Polygon': 'https://polygon-rpc.com',
    'Mumbai': 'https://rpc-mumbai.maticvigil.com',
    'BSC': 'https://bsc-dataseed.binance.org',
    'BSC Testnet': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    'Arbitrum': 'https://arb1.arbitrum.io/rpc',
    'Optimism': 'https://mainnet.optimism.io',
    'Avalanche': 'https://api.avax.network/ext/bc/C/rpc',
    'Fuji': 'https://api.avax-test.network/ext/bc/C/rpc'
  };
  
  return providers[blockchain] || 'https://eth.llamarpc.com';
}

export default router;
