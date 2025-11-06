import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { analyzeWalletRisk } from '../services/riskAnalysis.service';
import { blockchainMonitor } from '../services/blockchain.service';

export const createWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { address, blockchain, label } = req.body;

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

    // Trigger risk analysis
    analyzeWalletRisk(wallet.id).catch(console.error);

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wallet' });
  }
};

export const getWallets = async (req: AuthRequest, res: Response) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: { transactions: true, alerts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(wallets);
  } catch (error) {
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

    res.json({ message: 'Wallet updated successfully' });
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

    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete wallet' });
  }
};

export const syncWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Syncing wallet:', id, 'for user:', req.userId);

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!wallet) {
      console.log('Wallet not found:', id);
      return res.status(404).json({ error: 'Wallet not found' });
    }

    console.log('Monitoring wallet:', wallet.address, wallet.blockchain);
    await blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);

    res.json({ message: 'Wallet synchronized successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync wallet' });
  }
};
