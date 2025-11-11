import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    let startDate = new Date();
    switch (timeRange) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 1);
    }

    const logs = await prisma.auditLog.findMany({
      where: {
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    // Transform to match frontend interface
    const formattedLogs = logs.map(log => ({
      id: log.id,
      action: log.action,
      user: log.userId || 'system',
      timestamp: log.timestamp.toISOString(),
      details: `${log.action} on ${log.resource || 'system'}`,
      type: getLogType(log.action),
      severity: getLogSeverity(log.action),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      resource: log.resource
    }));

    res.json(formattedLogs);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

function getLogType(action: string): string {
  if (action.includes('login') || action.includes('auth')) return 'auth';
  if (action.includes('security') || action.includes('alert')) return 'security';
  if (action.includes('wallet') || action.includes('config')) return 'config';
  if (action.includes('compliance') || action.includes('report')) return 'compliance';
  if (action.includes('data') || action.includes('export')) return 'data';
  return 'config';
}

function getLogSeverity(action: string): string {
  if (action.includes('failed') || action.includes('error') || action.includes('critical')) return 'critical';
  if (action.includes('alert') || action.includes('high')) return 'high';
  if (action.includes('warning') || action.includes('medium')) return 'medium';
  return 'low';
}