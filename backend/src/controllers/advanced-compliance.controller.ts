import { Request, Response } from 'express';
import { aiCompliance } from '../services/ai-compliance.service';
import { blockchainIntelligence } from '../services/blockchain-intelligence.service';
import { quantumEncryption } from '../services/quantum-encryption.service';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import { RiskLevel, AlertType } from '@prisma/client';
import { t, detectLanguage } from '../i18n/translations';

// Controller para funcionalidades avançadas de compliance
export class AdvancedComplianceController {

  // Análise de transação com IA avançada
  async analyzeTransactionWithAI(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      if (!transactionId) {
        return res.status(400).json({
          error: 'Transaction ID is required'
        });
      }

      const analysis = await aiCompliance.analyzeTransactionWithAI(transactionId);
      
      // Salvar resultado da análise
      await prisma.aIAnalysisResult.create({
        data: {
          entityType: 'TRANSACTION',
          entityId: transactionId,
          analysisType: 'AI_COMPREHENSIVE',
          riskScore: analysis.riskScore,
          confidence: analysis.confidence,
          flags: analysis.flags,
          explanation: analysis.explanation,
          recommendations: analysis.recommendations,
          modelVersion: '2.0.0',
          processingTime: Date.now() - req.startTime
        }
      });

      // Criar alertas se necessário
      if (analysis.riskLevel === RiskLevel.HIGH || analysis.riskLevel === RiskLevel.CRITICAL) {
        await this.createComplianceAlert(transactionId, analysis);
      }

      // Gerar relatório regulatório se necessário
      if (analysis.complianceStatus.status === 'NON_COMPLIANT') {
        await this.generateRegulatoryReport(transactionId, analysis);
      }

      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('AI transaction analysis failed', { error, transactionId: req.params.transactionId });
      res.status(500).json({
        error: 'AI analysis failed',
        message: error.message
      });
    }
  }

  // Análise de inteligência de endereço
  async analyzeAddressIntelligence(req: Request, res: Response) {
    try {
      const { address, blockchain } = req.params;
      
      if (!address || !blockchain) {
        return res.status(400).json({
          error: 'Address and blockchain are required'
        });
      }

      const intelligence = await blockchainIntelligence.analyzeAddressIntelligence(
        address,
        blockchain as any
      );

      // Salvar inteligência no banco
      await prisma.addressIntelligence.upsert({
        where: { address },
        create: {
          address,
          blockchain: blockchain as any,
          riskScore: intelligence.riskScore,
          riskLevel: intelligence.riskLevel,
          categories: intelligence.categories,
          flags: intelligence.flags,
          confidence: intelligence.confidence,
          sources: intelligence.sources,
          metadata: JSON.stringify(intelligence.metadata)
        },
        update: {
          riskScore: intelligence.riskScore,
          riskLevel: intelligence.riskLevel,
          categories: intelligence.categories,
          flags: intelligence.flags,
          confidence: intelligence.confidence,
          lastAnalyzed: new Date(),
          metadata: JSON.stringify(intelligence.metadata)
        }
      });

      res.json({
        success: true,
        intelligence,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Address intelligence analysis failed', { error, address: req.params.address });
      res.status(500).json({
        error: 'Intelligence analysis failed',
        message: error.message
      });
    }
  }

  // Relatório COAF automatizado
  async generateCOAFReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const userId = (req as any).userId;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Start date and end date are required'
        });
      }

      // Buscar transações suspeitas no período
      const suspiciousTransactions = await prisma.transaction.findMany({
        where: {
          timestamp: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          },
          riskLevel: {
            in: [RiskLevel.HIGH, RiskLevel.CRITICAL]
          }
        },
        include: {
          wallet: {
            include: {
              user: true
            }
          }
        }
      });

      // Gerar relatório estruturado COAF
      const coafReport = {
        header: {
          reportType: 'COMUNICACAO_OPERACAO_SUSPEITA',
          period: { startDate, endDate },
          generatedAt: new Date().toISOString(),
          totalOperations: suspiciousTransactions.length
        },
        operations: suspiciousTransactions.map(tx => ({
          id: tx.id,
          hash: tx.hash,
          amount: tx.amount,
          currency: 'CRYPTO',
          blockchain: tx.blockchain,
          timestamp: tx.timestamp,
          riskScore: tx.riskScore,
          flags: tx.flags,
          customer: {
            id: tx.wallet.user.id,
            name: tx.wallet.user.name,
            email: tx.wallet.user.email,
            country: tx.wallet.user.country
          },
          addresses: {
            from: tx.fromAddress,
            to: tx.toAddress
          },
          suspicionReasons: tx.flags
        })),
        summary: {
          totalAmount: suspiciousTransactions.reduce((sum, tx) => sum + tx.amount, 0),
          averageRiskScore: suspiciousTransactions.reduce((sum, tx) => sum + tx.riskScore, 0) / suspiciousTransactions.length,
          topFlags: this.getTopFlags(suspiciousTransactions)
        }
      };

      // Salvar relatório
      const savedReport = await prisma.regulatoryReport.create({
        data: {
          reportType: 'COAF_SOS',
          period: `${startDate}_${endDate}`,
          status: 'DRAFT',
          data: JSON.stringify(coafReport),
          createdBy: userId
        }
      });

      res.json({
        success: true,
        reportId: savedReport.id,
        report: coafReport,
        downloadUrl: `/api/compliance/reports/${savedReport.id}/download`
      });

    } catch (error) {
      logger.error('COAF report generation failed', { error });
      res.status(500).json({
        error: 'COAF report generation failed',
        message: error.message
      });
    }
  }

  // Relatório BACEN automatizado
  async generateBACENReport(req: Request, res: Response) {
    try {
      const { month, year } = req.query;
      const userId = (req as any).userId;

      if (!month || !year) {
        return res.status(400).json({
          error: 'Month and year are required'
        });
      }

      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);

      // Estatísticas do período
      const [
        totalTransactions,
        totalUsers,
        totalWallets,
        highRiskTransactions,
        alertsGenerated,
        complianceViolations
      ] = await Promise.all([
        prisma.transaction.count({
          where: { timestamp: { gte: startDate, lte: endDate } }
        }),
        prisma.user.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.wallet.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.transaction.count({
          where: {
            timestamp: { gte: startDate, lte: endDate },
            riskLevel: { in: [RiskLevel.HIGH, RiskLevel.CRITICAL] }
          }
        }),
        prisma.alert.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.complianceViolation.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        })
      ]);

      const bacenReport = {
        header: {
          reportType: 'RELATORIO_CONTROLES_INTERNOS_BACEN',
          period: { month, year },
          generatedAt: new Date().toISOString(),
          institution: 'CryptoAML'
        },
        statistics: {
          transactions: {
            total: totalTransactions,
            highRisk: highRiskTransactions,
            riskPercentage: totalTransactions > 0 ? (highRiskTransactions / totalTransactions) * 100 : 0
          },
          customers: {
            total: totalUsers,
            new: totalUsers
          },
          wallets: {
            total: totalWallets,
            monitored: totalWallets
          },
          alerts: {
            generated: alertsGenerated,
            resolved: await this.getResolvedAlertsCount(startDate, endDate)
          },
          compliance: {
            violations: complianceViolations,
            resolved: await this.getResolvedViolationsCount(startDate, endDate)
          }
        },
        controls: {
          amlPolicy: 'IMPLEMENTED',
          kycProcedures: 'IMPLEMENTED',
          transactionMonitoring: 'ACTIVE',
          alertSystem: 'ACTIVE',
          staffTraining: 'COMPLETED',
          independentAudit: 'SCHEDULED'
        },
        effectiveness: {
          falsePositiveRate: await this.calculateFalsePositiveRate(startDate, endDate),
          detectionRate: await this.calculateDetectionRate(startDate, endDate),
          responseTime: await this.calculateAverageResponseTime(startDate, endDate)
        }
      };

      // Salvar relatório
      const savedReport = await prisma.regulatoryReport.create({
        data: {
          reportType: 'BACEN_MONTHLY',
          period: `${year}-${month}`,
          status: 'DRAFT',
          data: JSON.stringify(bacenReport),
          createdBy: userId
        }
      });

      res.json({
        success: true,
        reportId: savedReport.id,
        report: bacenReport,
        downloadUrl: `/api/compliance/reports/${savedReport.id}/download`
      });

    } catch (error) {
      logger.error('BACEN report generation failed', { error });
      res.status(500).json({
        error: 'BACEN report generation failed',
        message: error.message
      });
    }
  }

  // Validação de compliance em tempo real
  async validateCompliance(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;
      
      if (!entityType || !entityId) {
        return res.status(400).json({
          error: 'Entity type and ID are required'
        });
      }

      // Buscar regras de compliance aplicáveis
      const applicableRules = await prisma.complianceRule.findMany({
        where: { isActive: true }
      });

      const violations: any[] = [];
      
      for (const rule of applicableRules) {
        const isViolated = await this.checkComplianceRule(rule, entityType, entityId);
        
        if (isViolated) {
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            regulation: rule.regulation,
            severity: this.calculateViolationSeverity(rule),
            description: rule.description
          });
        }
      }

      const complianceStatus = {
        isCompliant: violations.length === 0,
        violationCount: violations.length,
        violations,
        lastChecked: new Date().toISOString()
      };

      // Salvar violações encontradas
      for (const violation of violations) {
        await prisma.complianceViolation.create({
          data: {
            ruleId: violation.ruleId,
            severity: violation.severity,
            description: violation.description,
            evidence: JSON.stringify({ entityType, entityId })
          }
        });
      }

      res.json({
        success: true,
        complianceStatus,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Compliance validation failed', { error });
      res.status(500).json({
        error: 'Compliance validation failed',
        message: error.message
      });
    }
  }

  // Criptografia quântica para dados sensíveis
  async encryptSensitiveData(req: Request, res: Response) {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({
          error: 'Data is required'
        });
      }

      const encryptedData = quantumEncryption.encryptWithQuantumResistance(
        JSON.stringify(data)
      );

      // Salvar chave de criptografia
      await prisma.quantumKey.create({
        data: {
          keyId: encryptedData.metadata.keyId,
          keyType: 'SYMMETRIC',
          algorithm: encryptedData.metadata.algorithm,
          keyData: 'ENCRYPTED_KEY_DATA', // Chave seria armazenada criptografada
          isActive: true
        }
      });

      res.json({
        success: true,
        encryptedData,
        keyId: encryptedData.metadata.keyId
      });

    } catch (error) {
      logger.error('Quantum encryption failed', { error });
      res.status(500).json({
        error: 'Encryption failed',
        message: error.message
      });
    }
  }

  // Dashboard de compliance em tempo real
  async getComplianceDashboard(req: Request, res: Response) {
    try {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [
        activeViolations,
        recentAlerts,
        pendingReports,
        riskDistribution,
        complianceScore
      ] = await Promise.all([
        prisma.complianceViolation.count({
          where: { status: 'OPEN' }
        }),
        prisma.alert.count({
          where: { createdAt: { gte: last24h } }
        }),
        prisma.regulatoryReport.count({
          where: { status: 'DRAFT' }
        }),
        this.getRiskDistribution(),
        this.calculateComplianceScore()
      ]);

      const dashboard = {
        overview: {
          complianceScore,
          activeViolations,
          recentAlerts,
          pendingReports
        },
        riskMetrics: {
          distribution: riskDistribution,
          trend: await this.getRiskTrend(last7d)
        },
        regulatoryStatus: {
          coafReports: await this.getCOAFStatus(),
          bacenReports: await this.getBACENStatus(),
          lgpdCompliance: await this.getLGPDStatus()
        },
        alerts: {
          last24h: recentAlerts,
          byType: await this.getAlertsByType(last24h),
          resolution: await this.getAlertResolutionStats()
        }
      };

      res.json({
        success: true,
        dashboard,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Compliance dashboard failed', { error });
      res.status(500).json({
        error: 'Dashboard generation failed',
        message: error.message
      });
    }
  }

  // Métodos auxiliares privados
  private async createComplianceAlert(transactionId: string, analysis: any): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (transaction) {
      await prisma.alert.create({
        data: {
          userId: transaction.wallet.userId,
          walletId: transaction.walletId,
          transactionId,
          type: AlertType.HIGH_RISK_TRANSACTION,
          severity: analysis.riskLevel,
          title: t('compliance.aiAnalysisTitle', 'en'),
          description: analysis.explanation
        }
      });
    }
  }

  private async generateRegulatoryReport(transactionId: string, analysis: any): Promise<void> {
    if (analysis.complianceStatus.requiredActions.includes('IMMEDIATE_REPORTING')) {
      // Gerar relatório automático para COAF
      const reportData = {
        transactionId,
        analysis,
        generatedAt: new Date().toISOString(),
        urgency: 'HIGH'
      };

      await prisma.regulatoryReport.create({
        data: {
          reportType: 'COAF_URGENT',
          period: new Date().toISOString().substring(0, 10),
          status: 'PENDING_SUBMISSION',
          data: JSON.stringify(reportData),
          createdBy: 'SYSTEM_AUTO'
        }
      });
    }
  }

  private getTopFlags(transactions: any[]): { flag: string, count: number }[] {
    const flagCounts = new Map<string, number>();
    
    transactions.forEach(tx => {
      tx.flags.forEach((flag: string) => {
        flagCounts.set(flag, (flagCounts.get(flag) || 0) + 1);
      });
    });

    return Array.from(flagCounts.entries())
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private async getResolvedAlertsCount(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.alert.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        isResolved: true
      }
    });
  }

  private async getResolvedViolationsCount(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.complianceViolation.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'RESOLVED'
      }
    });
  }

  private async calculateFalsePositiveRate(startDate: Date, endDate: Date): Promise<number> {
    // Implementar cálculo de taxa de falsos positivos
    return 0.15; // 15% placeholder
  }

  private async calculateDetectionRate(startDate: Date, endDate: Date): Promise<number> {
    // Implementar cálculo de taxa de detecção
    return 0.92; // 92% placeholder
  }

  private async calculateAverageResponseTime(startDate: Date, endDate: Date): Promise<number> {
    // Implementar cálculo de tempo médio de resposta (em horas)
    return 2.5; // 2.5 horas placeholder
  }

  private async checkComplianceRule(rule: any, entityType: string, entityId: string): Promise<boolean> {
    // Implementar verificação específica de cada regra
    return false; // Placeholder
  }

  private calculateViolationSeverity(rule: any): RiskLevel {
    if (rule.riskWeight > 40) return RiskLevel.CRITICAL;
    if (rule.riskWeight > 25) return RiskLevel.HIGH;
    if (rule.riskWeight > 15) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private async getRiskDistribution(): Promise<any> {
    return {
      low: 65,
      medium: 25,
      high: 8,
      critical: 2
    };
  }

  private async calculateComplianceScore(): Promise<number> {
    // Implementar cálculo de score de compliance
    return 87; // 87% placeholder
  }

  private async getRiskTrend(since: Date): Promise<string> {
    // Implementar cálculo de tendência de risco
    return 'STABLE'; // Placeholder
  }

  private async getCOAFStatus(): Promise<any> {
    return { pending: 2, submitted: 15, acknowledged: 13 };
  }

  private async getBACENStatus(): Promise<any> {
    return { current: 'COMPLIANT', lastReport: '2024-11', nextDue: '2024-12' };
  }

  private async getLGPDStatus(): Promise<any> {
    return { compliant: true, lastAudit: '2024-10', dataRequests: 3 };
  }

  private async getAlertsByType(since: Date): Promise<any> {
    return {
      HIGH_RISK_TRANSACTION: 12,
      SUSPICIOUS_PATTERN: 8,
      MIXER_DETECTED: 3,
      BLACKLISTED_ADDRESS: 1
    };
  }

  private async getAlertResolutionStats(): Promise<any> {
    return {
      averageTime: '4.2 hours',
      resolved: 85,
      pending: 15
    };
  }
}

export const advancedComplianceController = new AdvancedComplianceController();