import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { RiskLevel } from '@prisma/client';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalWallets,
      totalTransactions,
      totalAlerts,
      unreadAlerts,
      highRiskTransactions,
      recentTransactions,
      riskDistribution
    ] = await Promise.all([
      prisma.wallet.count({ where: { userId: req.userId } }),
      
      prisma.transaction.count({
        where: { wallet: { userId: req.userId } }
      }),
      
      prisma.alert.count({ where: { userId: req.userId } }),
      
      prisma.alert.count({
        where: { userId: req.userId, isRead: false }
      }),
      
      prisma.transaction.count({
        where: {
          wallet: { userId: req.userId },
          riskLevel: { in: [RiskLevel.HIGH, RiskLevel.CRITICAL] }
        }
      }),
      
      prisma.transaction.findMany({
        where: { wallet: { userId: req.userId } },
        include: {
          wallet: {
            select: { address: true, blockchain: true }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 10
      }),
      
      prisma.transaction.groupBy({
        by: ['riskLevel'],
        where: { wallet: { userId: req.userId } },
        _count: true
      })
    ]);

    const riskStats = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };

    riskDistribution.forEach(item => {
      riskStats[item.riskLevel as keyof typeof riskStats] = item._count;
    });

    res.json({
      totalWallets,
      totalTransactions,
      totalAlerts,
      unreadAlerts,
      highRiskTransactions,
      recentTransactions,
      riskDistribution: riskStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
