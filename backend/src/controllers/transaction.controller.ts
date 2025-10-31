import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { walletId, riskLevel, limit = '50' } = req.query;

    const where: any = {
      wallet: { userId: req.userId }
    };

    if (walletId) where.walletId = walletId;
    if (riskLevel) where.riskLevel = riskLevel;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        wallet: {
          select: { address: true, blockchain: true, label: true }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string)
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        wallet: { userId: req.userId }
      },
      include: {
        wallet: true,
        alerts: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};
