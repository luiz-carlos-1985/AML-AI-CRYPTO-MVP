import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    // Return user activity logs from various tables
    const [wallets, transactions, alerts, reports] = await Promise.all([
      prisma.wallet.findMany({
        where: { userId: req.userId },
        select: { id: true, address: true, blockchain: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.transaction.findMany({
        where: { wallet: { userId: req.userId } },
        select: { id: true, hash: true, amount: true, riskLevel: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 20
      }),
      prisma.alert.findMany({
        where: { userId: req.userId },
        select: { id: true, type: true, severity: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.report.findMany({
        where: { userId: req.userId },
        select: { id: true, type: true, format: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    const logs = [
      ...wallets.map(w => ({ action: 'WALLET_CREATED', entity: 'wallet', entityId: w.id, details: `${w.blockchain} wallet ${w.address}`, timestamp: w.createdAt })),
      ...transactions.map(t => ({ action: 'TRANSACTION_DETECTED', entity: 'transaction', entityId: t.id, details: `${t.amount} - Risk: ${t.riskLevel}`, timestamp: t.timestamp })),
      ...alerts.map(a => ({ action: 'ALERT_CREATED', entity: 'alert', entityId: a.id, details: `${a.type} - ${a.title}`, timestamp: a.createdAt })),
      ...reports.map(r => ({ action: 'REPORT_GENERATED', entity: 'report', entityId: r.id, details: `${r.type} ${r.format} - ${r.status}`, timestamp: r.createdAt }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
