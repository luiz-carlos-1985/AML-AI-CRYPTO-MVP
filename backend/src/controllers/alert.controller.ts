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

    console.log(`Fetched ${alerts.length} alerts for user ${req.userId}`);
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.alert.updateMany({
      where: { id, userId: req.userId },
      data: { isRead: true }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    console.log(`Alert ${id} marked as read`);
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
};

export const markAsResolved = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.alert.updateMany({
      where: { id, userId: req.userId },
      data: { isResolved: true }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    console.log(`Alert ${id} marked as resolved`);
    res.json({ message: 'Alert marked as resolved' });
  } catch (error) {
    console.error('Mark as resolved error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
};
