import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import prisma from '../utils/prisma';

export interface LGPDRequest extends Request {
  lgpdConsent?: boolean;
  dataProcessingPurpose?: string;
}

export const lgpdMiddleware = async (req: LGPDRequest, res: Response, next: NextFunction) => {
  try {
    // Log data processing activity
    if (req.method !== 'GET') {
      await prisma.dataProcessingLog.create({
        data: {
          userId: (req as any).userId || null,
          action: req.method,
          endpoint: req.path,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          timestamp: new Date(),
          legalBasis: 'legitimate_interest', // AML compliance
          purpose: 'aml_monitoring'
        }
      });
    }

    next();
  } catch (error) {
    logger.error('LGPD middleware error:', error);
    next();
  }
};

export const requireLGPDConsent = (req: LGPDRequest, res: Response, next: NextFunction) => {
  const consent = req.headers['x-lgpd-consent'];
  
  if (!consent || consent !== 'true') {
    return res.status(400).json({
      error: 'LGPD consent required',
      message: 'Consentimento LGPD necessário para processamento de dados pessoais'
    });
  }
  
  req.lgpdConsent = true;
  next();
};