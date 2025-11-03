import { Request, Response } from 'express';
import { blockchainMonitor } from '../services/blockchain.service';
import prisma from '../utils/prisma';

export const addWalletToMonitoring = async (req: Request, res: Response) => {
  try {
    const { address, blockchain } = req.body;
    const userId = req.user?.id;

    if (!address || !blockchain) {
      return res.status(400).json({ error: 'Address and blockchain are required' });
    }

    const wallet = await blockchainMonitor.monitorWallet(address, blockchain, userId);
    
    res.json({
      message: 'Wallet added to monitoring',
      wallet: {
        id: wallet?.id,
        address,
        blockchain,
        status: 'monitoring'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add wallet to monitoring' });
  }
};

export const getMonitoredWallets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 10
        },
        _count: {
          select: { transactions: true }
        }
      }
    });

    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monitored wallets' });
  }
};

export const getWalletTransactions = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const transactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { timestamp: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.transaction.count({
      where: { walletId }
    });

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getRiskAlerts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const alerts = await prisma.alert.findMany({
      where: { userId },
      include: {
        wallet: true,
        transaction: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};