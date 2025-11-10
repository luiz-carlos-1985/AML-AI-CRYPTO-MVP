import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { notifyUser } from '../services/websocket.service';
import { AlertType, RiskLevel } from '@prisma/client';

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { isRead, isResolved, severity, type, page = '1', limit = '50' } = req.query;

    const where: any = { userId: req.userId };

    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';
    if (severity) where.severity = severity;
    if (type) where.type = type;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        include: {
          wallet: {
            select: { address: true, blockchain: true, label: true }
          },
          transaction: {
            select: { hash: true, amount: true, fromAddress: true, toAddress: true, timestamp: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.alert.count({ where })
    ]);

    res.json({
      alerts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const getAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const alert = await prisma.alert.findFirst({
      where: { id, userId: req.userId },
      include: {
        wallet: {
          select: { address: true, blockchain: true, label: true }
        },
        transaction: {
          select: { 
            hash: true, 
            amount: true, 
            fromAddress: true, 
            toAddress: true, 
            timestamp: true,
            riskScore: true,
            flags: true
          }
        }
      }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
};

export const createAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { walletId, transactionId, type, severity, title, description } = req.body;

    if (!type || !severity || !title || !description) {
      return res.status(400).json({ error: 'Type, severity, title and description are required' });
    }

    if (walletId) {
      const wallet = await prisma.wallet.findFirst({
        where: { id: walletId, userId: req.userId }
      });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
    }

    const alert = await prisma.alert.create({
      data: {
        userId: req.userId!,
        walletId,
        transactionId,
        type: type as AlertType,
        severity: severity as RiskLevel,
        title,
        description
      },
      include: {
        wallet: {
          select: { address: true, blockchain: true, label: true }
        },
        transaction: {
          select: { hash: true, amount: true }
        }
      }
    });

    notifyUser(req.userId!, 'alert:new', alert);

    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
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

    const updatedAlert = await prisma.alert.findFirst({
      where: { id, userId: req.userId },
      include: {
        wallet: { select: { address: true, blockchain: true, label: true } },
        transaction: { select: { hash: true, amount: true } }
      }
    });

    notifyUser(req.userId!, 'alert:read', updatedAlert);

    res.json(updatedAlert);
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
      data: { isResolved: true, isRead: true }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await prisma.alert.findFirst({
      where: { id, userId: req.userId },
      include: {
        wallet: { select: { address: true, blockchain: true, label: true } },
        transaction: { select: { hash: true, amount: true } }
      }
    });

    notifyUser(req.userId!, 'alert:resolved', updatedAlert);

    res.json(updatedAlert);
  } catch (error) {
    console.error('Mark as resolved error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.alert.updateMany({
      where: { userId: req.userId, isRead: false },
      data: { isRead: true }
    });

    notifyUser(req.userId!, 'alerts:all_read', { count: result.count });

    res.json({ message: `${result.count} alerts marked as read` });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to update alerts' });
  }
};

export const deleteAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.alert.deleteMany({
      where: { id, userId: req.userId }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
};

export const getAlertStats = async (req: AuthRequest, res: Response) => {
  try {
    const [total, unread, unresolved, bySeverity, byType] = await Promise.all([
      prisma.alert.count({ where: { userId: req.userId } }),
      prisma.alert.count({ where: { userId: req.userId, isRead: false } }),
      prisma.alert.count({ where: { userId: req.userId, isResolved: false } }),
      prisma.alert.groupBy({
        by: ['severity'],
        where: { userId: req.userId },
        _count: { severity: true }
      }),
      prisma.alert.groupBy({
        by: ['type'],
        where: { userId: req.userId },
        _count: { type: true }
      })
    ]);

    const severityStats = bySeverity.reduce((acc, item) => {
      acc[item.severity] = item._count.severity;
      return acc;
    }, {} as Record<string, number>);

    const typeStats = byType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      total,
      unread,
      unresolved,
      bySeverity: severityStats,
      byType: typeStats
    });
  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({ error: 'Failed to fetch alert statistics' });
  }
};

export const bulkUpdateAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { alertIds, action } = req.body;

    if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
      return res.status(400).json({ error: 'Alert IDs array is required' });
    }

    if (!action || !['read', 'resolve', 'delete'].includes(action)) {
      return res.status(400).json({ error: 'Valid action is required (read, resolve, delete)' });
    }

    let result;
    const where = { id: { in: alertIds }, userId: req.userId };

    switch (action) {
      case 'read':
        result = await prisma.alert.updateMany({
          where,
          data: { isRead: true }
        });
        break;
      case 'resolve':
        result = await prisma.alert.updateMany({
          where,
          data: { isResolved: true, isRead: true }
        });
        break;
      case 'delete':
        result = await prisma.alert.deleteMany({ where });
        break;
    }

    notifyUser(req.userId!, `alerts:bulk_${action}`, { count: result.count });

    res.json({ 
      success: true, 
      message: `${result.count} alerts ${action === 'delete' ? 'deleted' : 'updated'}` 
    });
  } catch (error) {
    console.error('Bulk update alerts error:', error);
    res.status(500).json({ error: 'Failed to update alerts' });
  }
};