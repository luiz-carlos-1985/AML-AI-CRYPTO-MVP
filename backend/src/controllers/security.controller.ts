import { Request, Response } from 'express';
import { securityAudit } from '../security/security-audit.service';
import { logger } from '../utils/logger';
import prisma from '../utils/prisma';

export class SecurityController {

  // Executar auditoria de segurança completa
  async runSecurityAudit(req: Request, res: Response) {
    try {
      logger.info('Starting security audit', { userId: (req as any).userId });
      
      const auditReport = await securityAudit.performSecurityAudit();
      
      // Salvar relatório no banco
      await prisma.securityAuditReport.create({
        data: {
          overallScore: auditReport.overallScore,
          vulnerabilitiesCount: auditReport.vulnerabilities.length,
          criticalVulns: auditReport.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
          highVulns: auditReport.vulnerabilities.filter(v => v.severity === 'HIGH').length,
          mediumVulns: auditReport.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
          lowVulns: auditReport.vulnerabilities.filter(v => v.severity === 'LOW').length,
          compliance: JSON.stringify(auditReport.compliance),
          reportData: JSON.stringify(auditReport),
          executedBy: (req as any).userId
        }
      });

      res.json({
        success: true,
        report: auditReport,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Security audit failed', { error, userId: (req as any).userId });
      res.status(500).json({
        error: 'Security audit failed',
        message: error.message
      });
    }
  }

  // Obter histórico de auditorias
  async getAuditHistory(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const audits = await prisma.securityAuditReport.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        select: {
          id: true,
          overallScore: true,
          vulnerabilitiesCount: true,
          criticalVulns: true,
          highVulns: true,
          mediumVulns: true,
          lowVulns: true,
          compliance: true,
          createdAt: true,
          executedBy: true
        }
      });

      const total = await prisma.securityAuditReport.count();

      res.json({
        success: true,
        audits: audits.map(audit => ({
          ...audit,
          compliance: JSON.parse(audit.compliance)
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      logger.error('Failed to get audit history', { error });
      res.status(500).json({
        error: 'Failed to get audit history',
        message: error.message
      });
    }
  }

  // Obter detalhes de auditoria específica
  async getAuditDetails(req: Request, res: Response) {
    try {
      const { auditId } = req.params;
      
      const audit = await prisma.securityAuditReport.findUnique({
        where: { id: auditId }
      });

      if (!audit) {
        return res.status(404).json({
          error: 'Audit report not found'
        });
      }

      res.json({
        success: true,
        audit: {
          ...audit,
          compliance: JSON.parse(audit.compliance),
          reportData: JSON.parse(audit.reportData)
        }
      });

    } catch (error) {
      logger.error('Failed to get audit details', { error, auditId: req.params.auditId });
      res.status(500).json({
        error: 'Failed to get audit details',
        message: error.message
      });
    }
  }

  // Dashboard de segurança
  async getSecurityDashboard(req: Request, res: Response) {
    try {
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Estatísticas gerais
      const [
        latestAudit,
        recentIncidents,
        totalUsers,
        usersWithout2FA,
        adminUsers
      ] = await Promise.all([
        prisma.securityAuditReport.findFirst({
          orderBy: { createdAt: 'desc' }
        }),
        prisma.securityIncident.count({
          where: {
            timestamp: { gte: last30Days },
            resolved: false
          }
        }),
        prisma.user.count(),
        prisma.user.count({
          where: { twoFactorEnabled: false }
        }),
        prisma.user.count({
          where: { role: 'ADMIN' }
        })
      ]);

      // Métricas de segurança
      const securityMetrics = {
        overallScore: latestAudit?.overallScore || 0,
        lastAuditDate: latestAudit?.createdAt || null,
        openIncidents: recentIncidents,
        twoFactorAdoption: totalUsers > 0 ? Math.round(((totalUsers - usersWithout2FA) / totalUsers) * 100) : 0,
        adminUserCount: adminUsers,
        compliance: latestAudit ? JSON.parse(latestAudit.compliance) : {
          iso27001: false,
          soc2: false,
          owasp: false,
          nist: false
        }
      };

      // Tendências de segurança (últimos 6 meses)
      const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      const auditTrends = await prisma.securityAuditReport.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo }
        },
        orderBy: { createdAt: 'asc' },
        select: {
          overallScore: true,
          createdAt: true,
          vulnerabilitiesCount: true
        }
      });

      res.json({
        success: true,
        dashboard: {
          metrics: securityMetrics,
          trends: auditTrends,
          recommendations: this.getSecurityRecommendations(securityMetrics)
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Failed to get security dashboard', { error });
      res.status(500).json({
        error: 'Failed to get security dashboard',
        message: error.message
      });
    }
  }

  // Gerar certificado de conformidade
  async generateComplianceCertificate(req: Request, res: Response) {
    try {
      const { standard } = req.params; // iso27001, soc2, owasp, nist
      
      const latestAudit = await prisma.securityAuditReport.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (!latestAudit) {
        return res.status(400).json({
          error: 'No security audit found. Please run a security audit first.'
        });
      }

      const compliance = JSON.parse(latestAudit.compliance);
      const isCompliant = compliance[standard];

      if (!isCompliant) {
        return res.status(400).json({
          error: `System is not compliant with ${standard.toUpperCase()} standards`,
          details: 'Please address security vulnerabilities first'
        });
      }

      // Gerar certificado
      const certificate = {
        id: `CERT-${standard.toUpperCase()}-${Date.now()}`,
        standard: standard.toUpperCase(),
        organization: 'CryptoAML',
        issuedDate: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        auditScore: latestAudit.overallScore,
        auditDate: latestAudit.createdAt,
        certificateHash: this.generateCertificateHash(latestAudit.id, standard)
      };

      // Salvar certificado
      await prisma.complianceCertificate.create({
        data: {
          certificateId: certificate.id,
          standard: certificate.standard,
          auditReportId: latestAudit.id,
          issuedDate: new Date(certificate.issuedDate),
          validUntil: new Date(certificate.validUntil),
          certificateData: JSON.stringify(certificate),
          issuedBy: (req as any).userId
        }
      });

      res.json({
        success: true,
        certificate,
        downloadUrl: `/api/security/certificates/${certificate.id}/download`
      });

    } catch (error) {
      logger.error('Failed to generate compliance certificate', { error });
      res.status(500).json({
        error: 'Failed to generate compliance certificate',
        message: error.message
      });
    }
  }

  // Métodos auxiliares
  private getSecurityRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.overallScore < 80) {
      recommendations.push('Run security audit and address critical vulnerabilities');
    }
    if (metrics.twoFactorAdoption < 90) {
      recommendations.push('Enforce 2FA for all users');
    }
    if (metrics.adminUserCount > 5) {
      recommendations.push('Reduce number of admin users');
    }
    if (metrics.openIncidents > 0) {
      recommendations.push('Resolve open security incidents');
    }
    if (!metrics.compliance.iso27001) {
      recommendations.push('Address ISO 27001 compliance requirements');
    }

    return recommendations;
  }

  private generateCertificateHash(auditId: string, standard: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
      .update(`${auditId}:${standard}:${Date.now()}`)
      .digest('hex');
  }
}

export const securityController = new SecurityController();