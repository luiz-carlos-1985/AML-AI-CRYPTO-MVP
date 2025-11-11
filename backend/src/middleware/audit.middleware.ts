import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

export interface AuditRequest extends Request {
  originalBody?: any;
}

export const auditMiddleware = (req: AuditRequest, res: Response, next: NextFunction) => {
  // Store original body for comparison
  req.originalBody = { ...req.body };
  
  // Override res.json to capture response and log audit trail
  const originalJson = res.json;
  
  res.json = function(body: any) {
    // Log the audit trail after response
    setImmediate(async () => {
      try {
        if (req.method !== 'GET') {
          await prisma.auditLog.create({
            data: {
              userId: (req as any).userId || null,
              action: `${req.method} ${req.path}`,
              resource: req.path.split('/')[2] || 'unknown',
              resourceId: req.params.id || null,
              oldValues: req.method === 'PUT' ? req.originalBody : null,
              newValues: req.method !== 'DELETE' ? req.body : null,
              ipAddress: req.ip,
              userAgent: req.get('User-Agent') || '',
              timestamp: new Date()
            }
          });
        }
      } catch (error) {
        logger.error('Audit logging error:', error);
      }
    });
    
    return originalJson.call(this, body);
  };
  
  next();
};