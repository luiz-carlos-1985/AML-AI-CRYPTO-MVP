import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { isRead, isResolved, severity } = req.query;

    const where: any = { userId: req.userId };

    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';
    if (severity) where.severity = severity;

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        wallet: {
          select: { address: true, blockchain: true }
        },
        transaction: {
          select: { hash: true, amount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.alert.updateMany({
      where: { id, userId: req.userId },
      data: { isRead: true }
    });

    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
};

export const markAsResolved = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.alert.updateMany({
      where: { id, userId: req.userId },
      data: { isResolved: true }
    });

    res.json({ message: 'Alert marked as resolved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
};
