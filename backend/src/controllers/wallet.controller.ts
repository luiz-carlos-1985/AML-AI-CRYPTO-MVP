import { Response } from 'express';
import { ethers } from 'ethers';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { analyzeWalletRisk } from '../services/riskAnalysis.service';
import { blockchainMonitor } from '../services/blockchain.service';
import { WalletService } from '../services/wallet.service';
import { Blockchain } from '@prisma/client';

function validateAddress(address: string, blockchain: Blockchain): boolean {
  if (blockchain === Blockchain.BITCOIN) {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
  }
  if ([Blockchain.ETHEREUM, Blockchain.SEPOLIA, Blockchain.POLYGON, Blockchain.ARBITRUM, Blockchain.OPTIMISM, Blockchain.BASE, Blockchain.BNB_CHAIN].includes(blockchain)) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  return true;
}

function getProviderUrl(blockchain: Blockchain): string {
  const providers: Record<string, string> = {
    [Blockchain.ETHEREUM]: 'https://eth.llamarpc.com',
    [Blockchain.SEPOLIA]: 'https://rpc.sepolia.org',
    [Blockchain.POLYGON]: 'https://polygon-rpc.com',
    [Blockchain.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
    [Blockchain.OPTIMISM]: 'https://mainnet.optimism.io',
    [Blockchain.BASE]: 'https://mainnet.base.org',
    [Blockchain.BNB_CHAIN]: 'https://bsc-dataseed.binance.org'
  };
  return providers[blockchain] || 'https://eth.llamarpc.com';
}

function getNetworkConfig(blockchain: Blockchain) {
  const networks: Record<string, any> = {
    [Blockchain.ETHEREUM]: { name: 'homestead', chainId: 1 },
    [Blockchain.SEPOLIA]: { name: 'sepolia', chainId: 11155111 },
    [Blockchain.POLYGON]: { name: 'matic', chainId: 137 },
    [Blockchain.ARBITRUM]: { name: 'arbitrum', chainId: 42161 },
    [Blockchain.OPTIMISM]: { name: 'optimism', chainId: 10 },
    [Blockchain.BASE]: { name: 'base', chainId: 8453 },
    [Blockchain.BNB_CHAIN]: { name: 'bnb', chainId: 56 }
  };
  return networks[blockchain] || { name: 'homestead', chainId: 1 };
}

export const generateWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { label, blockchain } = req.body;
    const walletData = WalletService.generateWallet();
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
        label: label || 'Generated Wallet',
        userId: req.userId!
      }
    });

    analyzeWalletRisk(wallet.id).catch(console.error);
    blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId).catch(console.error);

    res.status(201).json({
      wallet,
      mnemonic: walletData.mnemonic,
      privateKey: walletData.privateKey
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate wallet' });
  }
};

export const importFromMnemonic = async (req: AuthRequest, res: Response) => {
  try {
    const { mnemonic, label, blockchain, accountIndex } = req.body;
    
    if (!mnemonic) {
      return res.status(400).json({ error: 'Mnemonic required' });
    }

    const walletData = WalletService.importFromMnemonic(mnemonic, accountIndex || 0);
    
    const existingWallet = await prisma.wallet.findUnique({ where: { address: walletData.address } });
    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
        label: label || `Account ${accountIndex || 1}`,
        userId: req.userId!
      }
    });

    analyzeWalletRisk(wallet.id).catch(console.error);
    blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId).catch(console.error);

    res.status(201).json({ wallet });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import wallet from mnemonic' });
  }
};

export const importFromPrivateKey = async (req: AuthRequest, res: Response) => {
  try {
    const { privateKey, label, blockchain } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ error: 'Private key required' });
    }

    const walletData = WalletService.importFromPrivateKey(privateKey);
    
    const existingWallet = await prisma.wallet.findUnique({ where: { address: walletData.address } });
    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }
    
    const wallet = await prisma.wallet.create({
      data: {
        address: walletData.address,
        blockchain: (blockchain as Blockchain) || Blockchain.ETHEREUM,
        label: label || 'Imported Wallet',
        userId: req.userId!
      }
    });

    analyzeWalletRisk(wallet.id).catch(console.error);
    blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId).catch(console.error);

    res.status(201).json({ wallet });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import wallet from private key' });
  }
};

export const createWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { address, blockchain, label } = req.body;

    if (!address || !blockchain) {
      return res.status(400).json({ error: 'Address and blockchain are required' });
    }

    if (!validateAddress(address, blockchain)) {
      return res.status(400).json({ error: 'Invalid address format for selected blockchain' });
    }

    const existingWallet = await prisma.wallet.findUnique({ where: { address } });
    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }

    const wallet = await prisma.wallet.create({
      data: {
        address,
        blockchain,
        label,
        userId: req.userId!
      }
    });

    analyzeWalletRisk(wallet.id).catch(console.error);
    blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId).catch(console.error);

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wallet' });
  }
};

export const getWallets = async (req: AuthRequest, res: Response) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    const walletsWithCounts = await Promise.all(
      wallets.map(async (wallet) => {
        const [transactionCount, alertCount] = await Promise.all([
          prisma.transaction.count({ where: { walletId: wallet.id } }),
          prisma.alert.count({ where: { walletId: wallet.id } })
        ]);
        
        return {
          ...wallet,
          _count: {
            transactions: transactionCount,
            alerts: alertCount
          }
        };
      })
    );
    
    res.json(walletsWithCounts);
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
};

export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId: req.userId },
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 50
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

export const updateWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { label, isMonitored } = req.body;

    const wallet = await prisma.wallet.updateMany({
      where: { id, userId: req.userId },
      data: { label, isMonitored }
    });

    if (wallet.count === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const updatedWallet = await prisma.wallet.findFirst({
      where: { id, userId: req.userId }
    });

    res.json(updatedWallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wallet' });
  }
};

export const deleteWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const wallet = await prisma.wallet.deleteMany({
      where: { id, userId: req.userId }
    });

    if (wallet.count === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ success: true, message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete wallet' });
  }
};

export const syncWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const txCountBefore = await prisma.transaction.count({
      where: { walletId: wallet.id }
    });

    await blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);

    const txCountAfter = await prisma.transaction.count({
      where: { walletId: wallet.id }
    });

    const newTransactions = txCountAfter - txCountBefore;

    let balance = '0.0';
    let txCount = 0;
    
    if ([Blockchain.ETHEREUM, Blockchain.SEPOLIA, Blockchain.POLYGON, Blockchain.ARBITRUM, Blockchain.OPTIMISM, Blockchain.BASE, Blockchain.BNB_CHAIN].includes(wallet.blockchain)) {
      try {
        const provider = new ethers.JsonRpcProvider(getProviderUrl(wallet.blockchain));
        
        const [balanceWei, count] = await Promise.race([
          Promise.all([provider.getBalance(wallet.address), provider.getTransactionCount(wallet.address)]),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        
        balance = ethers.formatEther(balanceWei);
        txCount = count;
      } catch (error) {
        console.warn('Failed to get balance:', error);
      }
    }

    res.json({
      success: true,
      transactionsFound: newTransactions,
      balance,
      transactionCount: txCount || txCountAfter,
      message: 'Wallet synchronized successfully'
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync wallet' });
  }
};
