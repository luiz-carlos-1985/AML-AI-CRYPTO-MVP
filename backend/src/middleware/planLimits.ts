import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlanLimits {
  maxWallets: number;
  maxTransactionsPerMonth: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  STARTER: { maxWallets: 5, maxTransactionsPerMonth: 100 },
  GROWTH: { maxWallets: 50, maxTransactionsPerMonth: 10000 },
  ENTERPRISE: { maxWallets: -1, maxTransactionsPerMonth: -1 }
};

export const checkWalletLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { wallets: true } } }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limits = PLAN_LIMITS[user.plan];
    
    if (limits.maxWallets !== -1 && user._count.wallets >= limits.maxWallets) {
      return res.status(403).json({ 
        error: 'Wallet limit reached',
        message: `Your ${user.plan} plan allows up to ${limits.maxWallets} wallets. Upgrade to add more.`,
        currentCount: user._count.wallets,
        limit: limits.maxWallets
      });
    }

    next();
  } catch (error) {
    console.error('Error checking wallet limit:', error);
    res.status(500).json({ error: 'Failed to check wallet limit' });
  }
};

export const checkTransactionLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limits = PLAN_LIMITS[user.plan];
    
    if (limits.maxTransactionsPerMonth !== -1) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const transactionCount = await prisma.transaction.count({
        where: {
          wallet: { userId },
          createdAt: { gte: startOfMonth }
        }
      });

      if (transactionCount >= limits.maxTransactionsPerMonth) {
        return res.status(403).json({ 
          error: 'Transaction limit reached',
          message: `Your ${user.plan} plan allows up to ${limits.maxTransactionsPerMonth} transactions per month. Upgrade for more.`,
          currentCount: transactionCount,
          limit: limits.maxTransactionsPerMonth
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error checking transaction limit:', error);
    res.status(500).json({ error: 'Failed to check transaction limit' });
  }
};
