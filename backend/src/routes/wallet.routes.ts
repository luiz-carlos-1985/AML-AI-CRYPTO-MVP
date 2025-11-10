import { Router } from 'express';
import { ethers } from 'ethers';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { WalletService } from '../services/wallet.service';
import { Blockchain } from '@prisma/client';
import { blockchainMonitor } from '../services/blockchain.service';

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
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
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
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
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
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
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

  // Check if wallet already exists
  const existing = await prisma.wallet.findUnique({ where: { address } });
  if (existing) {
    return res.status(400).json({ error: 'Wallet already exists' });
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

// Sync wallet transactions - REAL IMPLEMENTATION
router.post('/:id/sync', async (req: AuthRequest, res) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { id: req.params.id, userId: req.userId! }
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Get transaction count before sync
    const txCountBefore = await prisma.transaction.count({
      where: { walletId: wallet.id }
    });

    // Real blockchain sync using blockchain monitor
    await blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);

    // Get transaction count after sync
    const txCountAfter = await prisma.transaction.count({
      where: { walletId: wallet.id }
    });

    const newTransactions = txCountAfter - txCountBefore;

    // Try to get real balance for EVM chains
    let balance = '0.0';
    let txCount = 0;
    
    if ([Blockchain.ETHEREUM, Blockchain.SEPOLIA, Blockchain.POLYGON, Blockchain.ARBITRUM, Blockchain.OPTIMISM, Blockchain.BASE, Blockchain.BNB_CHAIN].includes(wallet.blockchain)) {
      try {
        const provider = new ethers.JsonRpcProvider(getProviderUrl(wallet.blockchain), undefined, {
          staticNetwork: true
        });
        const balancePromise = provider.getBalance(wallet.address);
        const txCountPromise = provider.getTransactionCount(wallet.address);
        
        const [balanceWei, count] = await Promise.race([
          Promise.all([balancePromise, txCountPromise]),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        
        balance = ethers.formatEther(balanceWei);
        txCount = count;
      } catch (error) {
        console.warn('Failed to fetch balance from RPC:', error);
      }
    }

    res.json({
      success: true,
      transactionsFound: newTransactions,
      balance,
      transactionCount: txCount || txCountAfter
    });
  } catch (error) {
    console.error('Sync error:', error);
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

function getProviderUrl(blockchain: Blockchain): string {
  const providers: Record<string, string> = {
    [Blockchain.ETHEREUM]: 'https://eth.llamarpc.com',
    [Blockchain.SEPOLIA]: 'https://rpc.sepolia.org',
    [Blockchain.POLYGON]: 'https://polygon-rpc.com',
    [Blockchain.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
    [Blockchain.OPTIMISM]: 'https://mainnet.optimism.io',
    [Blockchain.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
    [Blockchain.BNB_CHAIN]: 'https://bsc-dataseed.binance.org'
  };
  
  return providers[blockchain] || 'https://eth.llamarpc.com';
}

export default router;
