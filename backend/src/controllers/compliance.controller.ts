import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

// COAF - Comunicação de Operações Suspeitas
export const generateCOAFReport = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const suspiciousTransactions = await prisma.transaction.findMany({
      where: {
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
        timestamp: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      },
      include: {
        wallet: true,
        alerts: true
      }
    });

    const coafReport = {
      reportId: `COAF-${Date.now()}`,
      generatedAt: new Date(),
      period: { startDate, endDate },
      totalSuspiciousTransactions: suspiciousTransactions.length,
      totalValue: suspiciousTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
      transactions: suspiciousTransactions.map(tx => ({
        id: tx.id,
        hash: tx.hash,
        amount: tx.amount,
        riskLevel: tx.riskLevel,
        riskScore: tx.riskScore,
        flags: tx.flags,
        walletAddress: tx.wallet.address,
        blockchain: tx.wallet.blockchain,
        timestamp: tx.timestamp
      }))
    };

    // Log compliance report generation
    await prisma.complianceReport.create({
      data: {
        type: 'COAF',
        reportId: coafReport.reportId,
        userId: req.userId!,
        generatedAt: new Date(),
        data: coafReport
      }
    });

    res.json(coafReport);
  } catch (error) {
    logger.error('COAF report generation error:', error);
    res.status(500).json({ error: 'Failed to generate COAF report' });
  }
};

// BACEN - Relatório de Controles Internos
export const generateBACENReport = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;
    
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);

    const [totalTransactions, highRiskTransactions, alerts, wallets] = await Promise.all([
      prisma.transaction.count({
        where: {
          timestamp: { gte: startDate, lte: endDate }
        }
      }),
      prisma.transaction.count({
        where: {
          riskLevel: { in: ['HIGH', 'CRITICAL'] },
          timestamp: { gte: startDate, lte: endDate }
        }
      }),
      prisma.alert.count({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.wallet.count()
    ]);

    const bacenReport = {
      reportId: `BACEN-${year}-${month}`,
      period: { month, year },
      generatedAt: new Date(),
      statistics: {
        totalTransactions,
        highRiskTransactions,
        riskPercentage: ((highRiskTransactions / totalTransactions) * 100).toFixed(2),
        totalAlerts: alerts,
        monitoredWallets: wallets
      },
      controls: {
        amlPolicyImplemented: true,
        riskAssessmentActive: true,
        transactionMonitoring: true,
        alertSystem: true,
        reportingSystem: true,
        staffTraining: true
      }
    };

    await prisma.complianceReport.create({
      data: {
        type: 'BACEN',
        reportId: bacenReport.reportId,
        userId: req.userId!,
        generatedAt: new Date(),
        data: bacenReport
      }
    });

    res.json(bacenReport);
  } catch (error) {
    logger.error('BACEN report generation error:', error);
    res.status(500).json({ error: 'Failed to generate BACEN report' });
  }
};

// LGPD - Data Subject Rights
export const handleDataSubjectRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestType } = req.body; // 'access', 'rectification', 'erasure', 'portability'
    
    switch (requestType) {
      case 'access':
        const userData = await prisma.user.findUnique({
          where: { id: req.userId },
          include: {
            wallets: true,
            alerts: true,
            reports: true
          }
        });
        
        res.json({
          message: 'Dados pessoais coletados',
          data: userData
        });
        break;
        
      case 'erasure':
        // Anonymize user data (cannot delete due to AML retention requirements)
        await prisma.user.update({
          where: { id: req.userId },
          data: {
            email: `anonymized_${req.userId}@deleted.com`,
            name: 'Usuário Anonimizado',
            phone: null,
            isAnonymized: true
          }
        });
        
        res.json({
          message: 'Dados pessoais anonimizados conforme LGPD'
        });
        break;
        
      default:
        res.status(400).json({ error: 'Invalid request type' });
    }

    // Log LGPD request
    await prisma.dataProcessingLog.create({
      data: {
        userId: req.userId!,
        action: 'LGPD_REQUEST',
        endpoint: req.path,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        timestamp: new Date(),
        legalBasis: 'data_subject_rights',
        purpose: `lgpd_${requestType}`
      }
    });
    
  } catch (error) {
    logger.error('LGPD request handling error:', error);
    res.status(500).json({ error: 'Failed to process LGPD request' });
  }
};

// ISO 27001 - Security Incident Logging
export const logSecurityIncident = async (req: AuthRequest, res: Response) => {
  try {
    const { incidentType, severity, description } = req.body;
    
    const incident = await prisma.securityIncident.create({
      data: {
        type: incidentType,
        severity,
        description,
        reportedBy: req.userId!,
        timestamp: new Date(),
        status: 'OPEN'
      }
    });

    logger.warn(`Security incident reported: ${incidentType} - ${severity}`, {
      incidentId: incident.id,
      userId: req.userId
    });

    res.json({
      message: 'Security incident logged',
      incidentId: incident.id
    });
  } catch (error) {
    logger.error('Security incident logging error:', error);
    res.status(500).json({ error: 'Failed to log security incident' });
  }
};