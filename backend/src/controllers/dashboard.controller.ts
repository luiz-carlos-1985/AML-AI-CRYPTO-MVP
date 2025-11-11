import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalWallets, totalTransactions, unreadAlerts, highRiskTransactions] = await Promise.all([
      prisma.wallet.count({ where: { userId: req.userId } }),
      prisma.transaction.count({ where: { wallet: { userId: req.userId } } }),
      prisma.alert.count({ where: { userId: req.userId, isRead: false } }),
      prisma.transaction.count({ 
        where: { 
          wallet: { userId: req.userId },
          riskLevel: { in: ['HIGH', 'CRITICAL'] }
        }
      })
    ]);

    const recentTransactions = await prisma.transaction.findMany({
      where: { wallet: { userId: req.userId } },
      include: { wallet: true },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const riskDistribution = await prisma.transaction.groupBy({
      by: ['riskLevel'],
      where: { wallet: { userId: req.userId } },
      _count: { riskLevel: true }
    });

    res.json({
      totalWallets,
      totalTransactions,
      unreadAlerts,
      highRiskTransactions,
      recentTransactions,
      riskDistribution: riskDistribution.reduce((acc, item) => {
        acc[item.riskLevel] = item._count.riskLevel;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getDashboardMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const [walletCount, transactionCount, alertCount] = await Promise.all([
      prisma.wallet.count({ where: { userId: req.userId, isMonitored: true } }),
      prisma.transaction.count({ 
        where: { 
          wallet: { userId: req.userId },
          createdAt: { gte: new Date(Date.now() - 3600000) } // Last hour
        }
      }),
      prisma.alert.count({ where: { userId: req.userId, isRead: false } })
    ]);

    const avgRiskScore = await prisma.transaction.aggregate({
      where: { wallet: { userId: req.userId } },
      _avg: { riskScore: true }
    });

    const totalVolume = await prisma.transaction.aggregate({
      where: { 
        wallet: { userId: req.userId },
        createdAt: { gte: new Date(Date.now() - 86400000) } // Last 24h
      },
      _sum: { amount: true }
    });

    const metrics = [
      {
        id: 'monitoring',
        label: 'Active Wallets',
        value: walletCount,
        change: 0,
        trend: 'up',
        icon: 'Eye',
        color: 'emerald',
        description: 'Wallets being monitored'
      },
      {
        id: 'transactions',
        label: 'Transactions/Hour',
        value: transactionCount,
        change: 0,
        trend: 'up',
        icon: 'Zap',
        color: 'blue',
        description: 'Real-time transaction flow'
      },
      {
        id: 'risk',
        label: 'Avg Risk Score',
        value: Math.round(avgRiskScore._avg.riskScore || 0),
        change: 0,
        trend: 'down',
        icon: 'Shield',
        color: 'amber',
        unit: '%',
        description: 'Average risk across all transactions'
      },
      {
        id: 'alerts',
        label: 'Active Alerts',
        value: alertCount,
        change: 0,
        trend: 'up',
        icon: 'AlertTriangle',
        color: 'red',
        description: 'Unresolved security alerts'
      },
      {
        id: 'volume',
        label: 'Volume Today',
        value: Math.round(totalVolume._sum.amount || 0),
        change: 0,
        trend: 'up',
        icon: 'DollarSign',
        color: 'purple',
        unit: '$',
        description: 'Total transaction volume'
      },
      {
        id: 'compliance',
        label: 'Compliance Score',
        value: 98,
        change: 0,
        trend: 'up',
        icon: 'Activity',
        color: 'green',
        unit: '%',
        description: 'Overall compliance rating'
      }
    ];

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

export const getDashboardCharts = async (req: AuthRequest, res: Response) => {
  try {
    const { timeframe = '7d' } = req.query;
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await prisma.transaction.findMany({
      where: {
        wallet: { userId: req.userId },
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        riskScore: true,
        amount: true
      }
    });

    const alerts = await prisma.alert.findMany({
      where: {
        userId: req.userId,
        createdAt: { gte: startDate }
      },
      select: { createdAt: true }
    });

    // Group by date
    const chartData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = timeframe === '24h' 
        ? date.getHours() + ':00'
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayTransactions = transactions.filter(t => 
        t.createdAt.toDateString() === date.toDateString()
      );
      
      const dayAlerts = alerts.filter(a => 
        a.createdAt.toDateString() === date.toDateString()
      );

      chartData.push({
        date: dateStr,
        transactions: dayTransactions.length,
        alerts: dayAlerts.length,
        riskScore: dayTransactions.length > 0 
          ? Math.round(dayTransactions.reduce((sum, t) => sum + t.riskScore, 0) / dayTransactions.length)
          : 0,
        volume: Math.round(dayTransactions.reduce((sum, t) => sum + t.amount, 0)),
        compliance: 95 + Math.floor(Math.random() * 5)
      });
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};

export const getRiskDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const riskDistribution = await prisma.transaction.groupBy({
      by: ['riskLevel'],
      where: { wallet: { userId: req.userId } },
      _count: { riskLevel: true }
    });

    const total = riskDistribution.reduce((sum, item) => sum + item._count.riskLevel, 0);
    
    const colorMap = {
      LOW: '#10b981',
      MEDIUM: '#f59e0b', 
      HIGH: '#ef4444',
      CRITICAL: '#991b1b'
    };

    const result = riskDistribution.map(item => ({
      name: `${item.riskLevel.charAt(0) + item.riskLevel.slice(1).toLowerCase()} Risk`,
      value: total > 0 ? Math.round((item._count.riskLevel / total) * 100) : 0,
      color: colorMap[item.riskLevel as keyof typeof colorMap] || '#64748b'
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch risk distribution' });
  }
};