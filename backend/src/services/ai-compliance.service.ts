import axios from 'axios';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import { RiskLevel, AlertType } from '@prisma/client';

// IA Avançada para Compliance e Detecção de Lavagem de Dinheiro
export class AIComplianceService {
  private readonly mlServiceUrl: string;
  private readonly complianceRules: ComplianceRule[];

  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    this.complianceRules = this.initializeComplianceRules();
  }

  // Regras de compliance baseadas em regulamentações internacionais
  private initializeComplianceRules(): ComplianceRule[] {
    return [
      // FATF Recommendations
      {
        id: 'FATF_R10',
        name: 'Customer Due Diligence',
        description: 'Verificação de identidade do cliente',
        riskWeight: 25,
        triggers: ['new_customer', 'high_value_transaction'],
        action: 'enhanced_kyc'
      },
      {
        id: 'FATF_R11',
        name: 'Record Keeping',
        description: 'Manutenção de registros por 5-10 anos',
        riskWeight: 15,
        triggers: ['transaction_completed'],
        action: 'archive_records'
      },
      // COAF Brazil
      {
        id: 'COAF_BR_001',
        name: 'Operações Suspeitas',
        description: 'Comunicação de operações suspeitas ao COAF',
        riskWeight: 40,
        triggers: ['suspicious_pattern', 'high_risk_score'],
        action: 'report_coaf'
      },
      // BACEN Brazil
      {
        id: 'BACEN_4658',
        name: 'Controles Internos',
        description: 'Implementação de controles internos AML',
        riskWeight: 30,
        triggers: ['monthly_review'],
        action: 'internal_audit'
      },
      // LGPD Brazil
      {
        id: 'LGPD_ART_6',
        name: 'Base Legal',
        description: 'Tratamento baseado em legítimo interesse',
        riskWeight: 20,
        triggers: ['data_processing'],
        action: 'validate_legal_basis'
      }
    ];
  }

  // Análise de risco com IA avançada
  async analyzeTransactionWithAI(transactionId: string): Promise<AIAnalysisResult> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          wallet: {
            include: {
              user: true,
              transactions: {
                take: 100,
                orderBy: { timestamp: 'desc' }
              }
            }
          }
        }
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Preparar dados para análise de IA
      const analysisData = {
        transaction: {
          amount: transaction.amount,
          timestamp: transaction.timestamp,
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          blockchain: transaction.blockchain
        },
        wallet: {
          address: transaction.wallet.address,
          totalTransactions: transaction.wallet.transactions.length,
          totalValue: transaction.wallet.transactions.reduce((sum, tx) => sum + tx.amount, 0),
          averageAmount: transaction.wallet.transactions.reduce((sum, tx) => sum + tx.amount, 0) / transaction.wallet.transactions.length,
          timeSpan: this.calculateTimeSpan(transaction.wallet.transactions)
        },
        user: {
          registrationDate: transaction.wallet.user.createdAt,
          country: transaction.wallet.user.country,
          plan: transaction.wallet.user.plan
        },
        context: {
          timeOfDay: new Date(transaction.timestamp).getHours(),
          dayOfWeek: new Date(transaction.timestamp).getDay(),
          isWeekend: [0, 6].includes(new Date(transaction.timestamp).getDay())
        }
      };

      // Análise com múltiplos modelos de IA
      const [
        mlAnalysis,
        patternAnalysis,
        complianceAnalysis,
        behavioralAnalysis
      ] = await Promise.all([
        this.performMLAnalysis(analysisData),
        this.performPatternAnalysis(analysisData),
        this.performComplianceAnalysis(analysisData),
        this.performBehavioralAnalysis(analysisData)
      ]);

      // Combinar resultados com pesos específicos
      const combinedScore = this.combineAnalysisResults([
        { result: mlAnalysis, weight: 0.4 },
        { result: patternAnalysis, weight: 0.25 },
        { result: complianceAnalysis, weight: 0.25 },
        { result: behavioralAnalysis, weight: 0.1 }
      ]);

      // Gerar explicação detalhada
      const explanation = this.generateExplanation(combinedScore, [
        mlAnalysis, patternAnalysis, complianceAnalysis, behavioralAnalysis
      ]);

      return {
        riskScore: combinedScore.riskScore,
        riskLevel: this.calculateRiskLevel(combinedScore.riskScore),
        confidence: combinedScore.confidence,
        flags: combinedScore.flags,
        explanation,
        recommendations: this.generateRecommendations(combinedScore),
        complianceStatus: this.assessComplianceStatus(complianceAnalysis),
        nextActions: this.determineNextActions(combinedScore)
      };

    } catch (error) {
      logger.error('AI analysis failed', { error, transactionId });
      throw error;
    }
  }

  // Análise com Machine Learning
  private async performMLAnalysis(data: any): Promise<AnalysisResult> {
    try {
      const response = await axios.post(`${this.mlServiceUrl}/analyze/advanced`, data, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });

      return {
        riskScore: response.data.riskScore || 0,
        confidence: response.data.confidence || 0.5,
        flags: response.data.flags || [],
        source: 'ML_MODEL'
      };
    } catch (error) {
      logger.warn('ML service unavailable, using fallback');
      return this.fallbackMLAnalysis(data);
    }
  }

  // Análise de padrões suspeitos
  private async performPatternAnalysis(data: any): Promise<AnalysisResult> {
    let riskScore = 0;
    const flags: string[] = [];

    // Padrão de estruturação (Smurfing)
    if (this.detectSmurfingPattern(data)) {
      riskScore += 35;
      flags.push('SMURFING_PATTERN');
    }

    // Padrão de round-tripping
    if (this.detectRoundTripping(data)) {
      riskScore += 40;
      flags.push('ROUND_TRIPPING');
    }

    // Transações em horários suspeitos
    if (data.context.timeOfDay < 6 || data.context.timeOfDay > 22) {
      riskScore += 15;
      flags.push('UNUSUAL_HOURS');
    }

    // Valores redondos suspeitos
    if (data.transaction.amount % 1000 === 0 && data.transaction.amount > 10000) {
      riskScore += 20;
      flags.push('ROUND_AMOUNT');
    }

    // Frequência anômala
    if (data.wallet.totalTransactions > 50 && data.wallet.timeSpan < 7) {
      riskScore += 25;
      flags.push('HIGH_FREQUENCY');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      confidence: 0.8,
      flags,
      source: 'PATTERN_ANALYSIS'
    };
  }

  // Análise de compliance regulatório
  private async performComplianceAnalysis(data: any): Promise<AnalysisResult> {
    let riskScore = 0;
    const flags: string[] = [];
    const applicableRules: string[] = [];

    // Verificar regras de compliance
    for (const rule of this.complianceRules) {
      if (this.isRuleApplicable(rule, data)) {
        applicableRules.push(rule.id);
        
        if (rule.id === 'COAF_BR_001' && data.transaction.amount > 50000) {
          riskScore += rule.riskWeight;
          flags.push('COAF_REPORTING_REQUIRED');
        }
        
        if (rule.id === 'FATF_R10' && !data.user.country) {
          riskScore += rule.riskWeight;
          flags.push('INCOMPLETE_KYC');
        }
      }
    }

    // Verificar limites regulatórios
    if (data.transaction.amount > 100000) { // Limite BACEN
      riskScore += 30;
      flags.push('REGULATORY_LIMIT_EXCEEDED');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      confidence: 0.9,
      flags,
      source: 'COMPLIANCE_RULES',
      metadata: { applicableRules }
    };
  }

  // Análise comportamental
  private async performBehavioralAnalysis(data: any): Promise<AnalysisResult> {
    let riskScore = 0;
    const flags: string[] = [];

    // Desvio do comportamento normal
    const avgAmount = data.wallet.averageAmount;
    const currentAmount = data.transaction.amount;
    
    if (currentAmount > avgAmount * 5) {
      riskScore += 25;
      flags.push('AMOUNT_DEVIATION');
    }

    // Padrão de fim de semana
    if (data.context.isWeekend && currentAmount > 10000) {
      riskScore += 15;
      flags.push('WEEKEND_ACTIVITY');
    }

    // Usuário novo com transação alta
    const daysSinceRegistration = (Date.now() - new Date(data.user.registrationDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceRegistration < 7 && currentAmount > 25000) {
      riskScore += 30;
      flags.push('NEW_USER_HIGH_VALUE');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      confidence: 0.7,
      flags,
      source: 'BEHAVIORAL_ANALYSIS'
    };
  }

  // Detectar padrão de smurfing
  private detectSmurfingPattern(data: any): boolean {
    const transactions = data.wallet.transactions || [];
    const recentTx = transactions.filter((tx: any) => 
      Date.now() - new Date(tx.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    // Múltiplas transações pequenas em 24h
    return recentTx.length > 10 && 
           recentTx.every((tx: any) => tx.amount < 10000) &&
           recentTx.reduce((sum: number, tx: any) => sum + tx.amount, 0) > 50000;
  }

  // Detectar round-tripping
  private detectRoundTripping(data: any): boolean {
    const transactions = data.wallet.transactions || [];
    const addresses = new Set();
    
    for (const tx of transactions) {
      if (addresses.has(tx.toAddress) && addresses.has(tx.fromAddress)) {
        return true; // Mesmo endereço aparece como origem e destino
      }
      addresses.add(tx.toAddress);
      addresses.add(tx.fromAddress);
    }
    
    return false;
  }

  // Combinar resultados de múltiplas análises
  private combineAnalysisResults(results: { result: AnalysisResult, weight: number }[]): CombinedResult {
    let totalScore = 0;
    let totalConfidence = 0;
    const allFlags: string[] = [];

    for (const { result, weight } of results) {
      totalScore += result.riskScore * weight;
      totalConfidence += result.confidence * weight;
      allFlags.push(...result.flags);
    }

    return {
      riskScore: Math.round(totalScore),
      confidence: Math.round(totalConfidence * 100) / 100,
      flags: [...new Set(allFlags)] // Remove duplicatas
    };
  }

  // Gerar explicação detalhada
  private generateExplanation(result: CombinedResult, analyses: AnalysisResult[]): string {
    const explanations: string[] = [];

    if (result.riskScore > 70) {
      explanations.push('Transação classificada como ALTO RISCO devido a múltiplos indicadores suspeitos.');
    }

    for (const analysis of analyses) {
      if (analysis.flags.includes('SMURFING_PATTERN')) {
        explanations.push('Detectado padrão de estruturação (smurfing) - múltiplas transações pequenas.');
      }
      if (analysis.flags.includes('COAF_REPORTING_REQUIRED')) {
        explanations.push('Transação requer comunicação ao COAF conforme regulamentação brasileira.');
      }
      if (analysis.flags.includes('ROUND_TRIPPING')) {
        explanations.push('Identificado possível round-tripping entre endereços relacionados.');
      }
    }

    return explanations.join(' ');
  }

  // Gerar recomendações
  private generateRecommendations(result: CombinedResult): string[] {
    const recommendations: string[] = [];

    if (result.riskScore > 70) {
      recommendations.push('Realizar investigação manual imediata');
      recommendations.push('Considerar bloqueio temporário da conta');
      recommendations.push('Comunicar ao COAF dentro de 24 horas');
    } else if (result.riskScore > 50) {
      recommendations.push('Monitoramento intensificado por 30 dias');
      recommendations.push('Solicitar documentação adicional');
    } else if (result.riskScore > 30) {
      recommendations.push('Incluir em lista de monitoramento');
    }

    if (result.flags.includes('INCOMPLETE_KYC')) {
      recommendations.push('Completar processo de KYC');
    }

    return recommendations;
  }

  // Avaliar status de compliance
  private assessComplianceStatus(analysis: AnalysisResult): ComplianceStatus {
    const criticalFlags = ['COAF_REPORTING_REQUIRED', 'REGULATORY_LIMIT_EXCEEDED'];
    const hasCriticalIssues = analysis.flags.some(flag => criticalFlags.includes(flag));

    return {
      status: hasCriticalIssues ? 'NON_COMPLIANT' : 'COMPLIANT',
      requiredActions: hasCriticalIssues ? ['IMMEDIATE_REPORTING', 'ENHANCED_MONITORING'] : [],
      deadline: hasCriticalIssues ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
    };
  }

  // Determinar próximas ações
  private determineNextActions(result: CombinedResult): NextAction[] {
    const actions: NextAction[] = [];

    if (result.riskScore > 70) {
      actions.push({
        type: 'MANUAL_REVIEW',
        priority: 'HIGH',
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        description: 'Revisão manual urgente necessária'
      });
    }

    if (result.flags.includes('COAF_REPORTING_REQUIRED')) {
      actions.push({
        type: 'REGULATORY_REPORTING',
        priority: 'CRITICAL',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        description: 'Comunicar operação suspeita ao COAF'
      });
    }

    return actions;
  }

  // Métodos auxiliares
  private calculateTimeSpan(transactions: any[]): number {
    if (transactions.length < 2) return 0;
    
    const timestamps = transactions.map(tx => new Date(tx.timestamp).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    
    return (maxTime - minTime) / (1000 * 60 * 60 * 24); // dias
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 70) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 30) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private isRuleApplicable(rule: ComplianceRule, data: any): boolean {
    return rule.triggers.some(trigger => {
      switch (trigger) {
        case 'high_value_transaction':
          return data.transaction.amount > 50000;
        case 'new_customer':
          const daysSinceReg = (Date.now() - new Date(data.user.registrationDate).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceReg < 30;
        case 'suspicious_pattern':
          return data.transaction.amount > 100000;
        default:
          return false;
      }
    });
  }

  private fallbackMLAnalysis(data: any): AnalysisResult {
    let riskScore = 0;
    const flags: string[] = [];

    if (data.transaction.amount > 100000) {
      riskScore += 40;
      flags.push('HIGH_VALUE');
    }

    if (data.wallet.totalTransactions > 100) {
      riskScore += 20;
      flags.push('HIGH_ACTIVITY');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      confidence: 0.6,
      flags,
      source: 'FALLBACK_RULES'
    };
  }
}

// Interfaces
interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  riskWeight: number;
  triggers: string[];
  action: string;
}

interface AnalysisResult {
  riskScore: number;
  confidence: number;
  flags: string[];
  source: string;
  metadata?: any;
}

interface CombinedResult {
  riskScore: number;
  confidence: number;
  flags: string[];
}

interface AIAnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  flags: string[];
  explanation: string;
  recommendations: string[];
  complianceStatus: ComplianceStatus;
  nextActions: NextAction[];
}

interface ComplianceStatus {
  status: 'COMPLIANT' | 'NON_COMPLIANT';
  requiredActions: string[];
  deadline: Date | null;
}

interface NextAction {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  deadline: Date;
  description: string;
}

export const aiCompliance = new AIComplianceService();