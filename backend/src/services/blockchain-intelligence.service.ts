import axios from 'axios';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import { RiskLevel, AlertType, Blockchain } from '@prisma/client';

// Inteligência Avançada de Blockchain - Sistema Proprietário
export class BlockchainIntelligenceService {
  private readonly graphDatabase: Map<string, AddressNode>;
  private readonly riskScoreCache: Map<string, CachedRiskScore>;
  private readonly sanctionLists: Set<string>;
  private readonly mixerAddresses: Set<string>;
  private readonly exchangeAddresses: Map<string, ExchangeInfo>;

  constructor() {
    this.graphDatabase = new Map();
    this.riskScoreCache = new Map();
    this.sanctionLists = new Set();
    this.mixerAddresses = new Set();
    this.exchangeAddresses = new Map();
    
    this.initializeIntelligenceData();
  }

  // Inicializar dados de inteligência
  private async initializeIntelligenceData(): Promise<void> {
    try {
      await Promise.all([
        this.loadSanctionLists(),
        this.loadMixerAddresses(),
        this.loadExchangeAddresses(),
        this.buildTransactionGraph()
      ]);
      
      logger.info('Blockchain intelligence data initialized');
    } catch (error) {
      logger.error('Failed to initialize intelligence data', { error });
    }
  }

  // Análise completa de endereço com inteligência avançada
  async analyzeAddressIntelligence(address: string, blockchain: Blockchain): Promise<AddressIntelligence> {
    try {
      const cacheKey = `${address}:${blockchain}`;
      const cached = this.riskScoreCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
        return cached.intelligence;
      }

      const [
        sanctionCheck,
        mixerAnalysis,
        exchangeAnalysis,
        graphAnalysis,
        behaviorAnalysis,
        clusterAnalysis
      ] = await Promise.all([
        this.checkSanctionLists(address),
        this.analyzeMixerActivity(address, blockchain),
        this.analyzeExchangeActivity(address, blockchain),
        this.performGraphAnalysis(address),
        this.analyzeBehaviorPattern(address, blockchain),
        this.performClusterAnalysis(address, blockchain)
      ]);

      const intelligence: AddressIntelligence = {
        address,
        blockchain,
        riskScore: this.calculateCompositeRiskScore([
          sanctionCheck, mixerAnalysis, exchangeAnalysis,
          graphAnalysis, behaviorAnalysis, clusterAnalysis
        ]),
        riskLevel: RiskLevel.LOW,
        categories: this.categorizeAddress([
          sanctionCheck, mixerAnalysis, exchangeAnalysis,
          graphAnalysis, behaviorAnalysis, clusterAnalysis
        ]),
        flags: this.extractFlags([
          sanctionCheck, mixerAnalysis, exchangeAnalysis,
          graphAnalysis, behaviorAnalysis, clusterAnalysis
        ]),
        confidence: this.calculateConfidence([
          sanctionCheck, mixerAnalysis, exchangeAnalysis,
          graphAnalysis, behaviorAnalysis, clusterAnalysis
        ]),
        lastUpdated: new Date(),
        sources: ['SANCTIONS', 'MIXERS', 'EXCHANGES', 'GRAPH', 'BEHAVIOR', 'CLUSTER'],
        metadata: {
          sanctionCheck,
          mixerAnalysis,
          exchangeAnalysis,
          graphAnalysis,
          behaviorAnalysis,
          clusterAnalysis
        }
      };

      intelligence.riskLevel = this.calculateRiskLevel(intelligence.riskScore);

      // Cache resultado
      this.riskScoreCache.set(cacheKey, {
        intelligence,
        timestamp: Date.now()
      });

      return intelligence;

    } catch (error) {
      logger.error('Address intelligence analysis failed', { error, address, blockchain });
      throw error;
    }
  }

  // Verificar listas de sanções
  private async checkSanctionLists(address: string): Promise<IntelligenceResult> {
    const isSanctioned = this.sanctionLists.has(address.toLowerCase());
    
    if (isSanctioned) {
      return {
        riskScore: 100,
        confidence: 0.95,
        flags: ['SANCTIONED_ADDRESS', 'OFAC_LIST'],
        category: 'SANCTIONED',
        details: 'Address found in international sanction lists'
      };
    }

    // Verificar similaridade com endereços sancionados
    const similarityScore = await this.checkAddressSimilarity(address);
    
    return {
      riskScore: similarityScore * 30,
      confidence: 0.7,
      flags: similarityScore > 0.8 ? ['SIMILAR_TO_SANCTIONED'] : [],
      category: 'CLEAN',
      details: `Similarity score: ${similarityScore}`
    };
  }

  // Analisar atividade de mixer
  private async analyzeMixerActivity(address: string, blockchain: Blockchain): Promise<IntelligenceResult> {
    const isMixer = this.mixerAddresses.has(address.toLowerCase());
    
    if (isMixer) {
      return {
        riskScore: 85,
        confidence: 0.9,
        flags: ['MIXER_ADDRESS', 'PRIVACY_COIN'],
        category: 'MIXER',
        details: 'Address identified as cryptocurrency mixer'
      };
    }

    // Verificar interações com mixers
    const mixerInteractions = await this.checkMixerInteractions(address, blockchain);
    
    return {
      riskScore: mixerInteractions.score,
      confidence: 0.8,
      flags: mixerInteractions.flags,
      category: mixerInteractions.score > 50 ? 'MIXER_USER' : 'CLEAN',
      details: `Mixer interactions: ${mixerInteractions.count}`
    };
  }

  // Analisar atividade de exchange
  private async analyzeExchangeActivity(address: string, blockchain: Blockchain): Promise<IntelligenceResult> {
    const exchangeInfo = this.exchangeAddresses.get(address.toLowerCase());
    
    if (exchangeInfo) {
      const riskScore = this.calculateExchangeRisk(exchangeInfo);
      
      return {
        riskScore,
        confidence: 0.85,
        flags: this.getExchangeFlags(exchangeInfo),
        category: 'EXCHANGE',
        details: `Exchange: ${exchangeInfo.name}, Jurisdiction: ${exchangeInfo.jurisdiction}`
      };
    }

    return {
      riskScore: 0,
      confidence: 0.9,
      flags: [],
      category: 'UNKNOWN',
      details: 'No exchange activity detected'
    };
  }

  // Análise de grafo de transações
  private async performGraphAnalysis(address: string): Promise<IntelligenceResult> {
    const node = this.graphDatabase.get(address);
    
    if (!node) {
      return {
        riskScore: 5,
        confidence: 0.5,
        flags: ['INSUFFICIENT_DATA'],
        category: 'UNKNOWN',
        details: 'Address not found in transaction graph'
      };
    }

    const centralityScore = this.calculateCentrality(node);
    const clusteringCoeff = this.calculateClustering(node);
    const pathLengths = this.calculateShortestPaths(node);

    let riskScore = 0;
    const flags: string[] = [];

    // Alto grau de centralidade pode indicar hub de lavagem
    if (centralityScore > 0.8) {
      riskScore += 30;
      flags.push('HIGH_CENTRALITY');
    }

    // Baixo coeficiente de clustering pode indicar intermediário
    if (clusteringCoeff < 0.2) {
      riskScore += 20;
      flags.push('LOW_CLUSTERING');
    }

    // Caminhos curtos para endereços de alto risco
    if (pathLengths.minRiskyPath < 3) {
      riskScore += 25;
      flags.push('CLOSE_TO_RISKY');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      confidence: 0.75,
      flags,
      category: riskScore > 50 ? 'HUB' : 'NORMAL',
      details: `Centrality: ${centralityScore}, Clustering: ${clusteringCoeff}`
    };
  }

  // Análise de padrão comportamental
  private async analyzeBehaviorPattern(address: string, blockchain: Blockchain): Promise<IntelligenceResult> {
    try {
      const transactions = await this.getAddressTransactions(address, blockchain);
      
      if (transactions.length < 5) {
        return {
          riskScore: 10,
          confidence: 0.3,
          flags: ['INSUFFICIENT_HISTORY'],
          category: 'NEW',
          details: 'Insufficient transaction history'
        };
      }

      const patterns = this.analyzeBehaviorPatterns(transactions);
      let riskScore = 0;
      const flags: string[] = [];

      // Padrão de peel chain (característica de lavagem)
      if (patterns.peelChainScore > 0.7) {
        riskScore += 40;
        flags.push('PEEL_CHAIN_PATTERN');
      }

      // Transações em horários suspeitos
      if (patterns.unusualTimingScore > 0.6) {
        riskScore += 25;
        flags.push('UNUSUAL_TIMING');
      }

      // Valores redondos frequentes
      if (patterns.roundAmountScore > 0.8) {
        riskScore += 20;
        flags.push('ROUND_AMOUNTS');
      }

      // Atividade de fim de semana
      if (patterns.weekendActivityScore > 0.7) {
        riskScore += 15;
        flags.push('WEEKEND_ACTIVITY');
      }

      return {
        riskScore: Math.min(riskScore, 100),
        confidence: 0.8,
        flags,
        category: riskScore > 60 ? 'SUSPICIOUS_BEHAVIOR' : 'NORMAL',
        details: `Behavior patterns detected: ${flags.length}`
      };

    } catch (error) {
      logger.error('Behavior analysis failed', { error, address });
      return {
        riskScore: 0,
        confidence: 0.1,
        flags: ['ANALYSIS_ERROR'],
        category: 'ERROR',
        details: 'Behavior analysis failed'
      };
    }
  }

  // Análise de cluster
  private async performClusterAnalysis(address: string, blockchain: Blockchain): Promise<IntelligenceResult> {
    try {
      const cluster = await this.identifyAddressCluster(address, blockchain);
      
      if (!cluster) {
        return {
          riskScore: 5,
          confidence: 0.4,
          flags: [],
          category: 'ISOLATED',
          details: 'Address not part of identified cluster'
        };
      }

      let riskScore = 0;
      const flags: string[] = [];

      // Cluster com endereços de alto risco
      if (cluster.highRiskAddresses > 0) {
        riskScore += cluster.highRiskAddresses * 15;
        flags.push('HIGH_RISK_CLUSTER');
      }

      // Cluster muito grande (possível serviço)
      if (cluster.size > 1000) {
        riskScore += 10;
        flags.push('LARGE_CLUSTER');
      }

      // Cluster com atividade coordenada
      if (cluster.coordinatedActivity > 0.8) {
        riskScore += 30;
        flags.push('COORDINATED_ACTIVITY');
      }

      return {
        riskScore: Math.min(riskScore, 100),
        confidence: 0.7,
        flags,
        category: cluster.type || 'UNKNOWN',
        details: `Cluster size: ${cluster.size}, Risk addresses: ${cluster.highRiskAddresses}`
      };

    } catch (error) {
      logger.error('Cluster analysis failed', { error, address });
      return {
        riskScore: 0,
        confidence: 0.1,
        flags: ['ANALYSIS_ERROR'],
        category: 'ERROR',
        details: 'Cluster analysis failed'
      };
    }
  }

  // Métodos auxiliares
  private async loadSanctionLists(): Promise<void> {
    // Carregar listas de sanções (OFAC, UN, EU, etc.)
    const sanctionedAddresses = [
      // Endereços de exemplo - em produção, carregar de APIs oficiais
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Genesis Bitcoin
      // Adicionar mais endereços sancionados
    ];

    sanctionedAddresses.forEach(addr => this.sanctionLists.add(addr.toLowerCase()));
  }

  private async loadMixerAddresses(): Promise<void> {
    // Carregar endereços conhecidos de mixers
    const mixerAddresses = [
      // Endereços de mixers conhecidos
      // Tornado Cash, ChipMixer, etc.
    ];

    mixerAddresses.forEach(addr => this.mixerAddresses.add(addr.toLowerCase()));
  }

  private async loadExchangeAddresses(): Promise<void> {
    // Carregar endereços de exchanges
    const exchanges = [
      {
        address: '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
        name: 'Binance',
        jurisdiction: 'Malta',
        riskLevel: 'LOW',
        kyc: true
      }
      // Adicionar mais exchanges
    ];

    exchanges.forEach(exchange => {
      this.exchangeAddresses.set(exchange.address.toLowerCase(), exchange);
    });
  }

  private async buildTransactionGraph(): Promise<void> {
    // Construir grafo de transações a partir do banco de dados
    try {
      const transactions = await prisma.transaction.findMany({
        take: 10000, // Limitar para performance
        orderBy: { timestamp: 'desc' }
      });

      for (const tx of transactions) {
        this.addTransactionToGraph(tx);
      }

      logger.info(`Transaction graph built with ${this.graphDatabase.size} nodes`);
    } catch (error) {
      logger.error('Failed to build transaction graph', { error });
    }
  }

  private addTransactionToGraph(transaction: any): void {
    const fromNode = this.getOrCreateNode(transaction.fromAddress);
    const toNode = this.getOrCreateNode(transaction.toAddress);

    fromNode.outgoing.push({
      to: transaction.toAddress,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      txHash: transaction.hash
    });

    toNode.incoming.push({
      from: transaction.fromAddress,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      txHash: transaction.hash
    });
  }

  private getOrCreateNode(address: string): AddressNode {
    let node = this.graphDatabase.get(address);
    if (!node) {
      node = {
        address,
        incoming: [],
        outgoing: [],
        riskScore: 0,
        lastUpdated: new Date()
      };
      this.graphDatabase.set(address, node);
    }
    return node;
  }

  private calculateCompositeRiskScore(results: IntelligenceResult[]): number {
    const weights = [0.3, 0.25, 0.15, 0.15, 0.1, 0.05]; // Pesos para cada análise
    let totalScore = 0;
    let totalWeight = 0;

    results.forEach((result, index) => {
      const weight = weights[index] || 0.05;
      totalScore += result.riskScore * weight * result.confidence;
      totalWeight += weight * result.confidence;
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  private categorizeAddress(results: IntelligenceResult[]): string[] {
    const categories = new Set<string>();
    
    results.forEach(result => {
      if (result.category && result.category !== 'CLEAN' && result.category !== 'UNKNOWN') {
        categories.add(result.category);
      }
    });

    return Array.from(categories);
  }

  private extractFlags(results: IntelligenceResult[]): string[] {
    const flags = new Set<string>();
    
    results.forEach(result => {
      result.flags.forEach(flag => flags.add(flag));
    });

    return Array.from(flags);
  }

  private calculateConfidence(results: IntelligenceResult[]): number {
    const avgConfidence = results.reduce((sum, result) => sum + result.confidence, 0) / results.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 80) return RiskLevel.CRITICAL;
    if (score >= 60) return RiskLevel.HIGH;
    if (score >= 30) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  // Implementações específicas dos métodos auxiliares
  private async checkAddressSimilarity(address: string): Promise<number> {
    // Implementar algoritmo de similaridade de endereços
    return 0;
  }

  private async checkMixerInteractions(address: string, blockchain: Blockchain): Promise<{ score: number, flags: string[], count: number }> {
    // Implementar verificação de interações com mixers
    return { score: 0, flags: [], count: 0 };
  }

  private calculateExchangeRisk(exchangeInfo: ExchangeInfo): number {
    // Calcular risco baseado nas características da exchange
    let risk = 0;
    
    if (!exchangeInfo.kyc) risk += 40;
    if (exchangeInfo.jurisdiction === 'Unknown') risk += 30;
    if (exchangeInfo.riskLevel === 'HIGH') risk += 50;
    
    return Math.min(risk, 100);
  }

  private getExchangeFlags(exchangeInfo: ExchangeInfo): string[] {
    const flags: string[] = ['EXCHANGE'];
    
    if (!exchangeInfo.kyc) flags.push('NO_KYC');
    if (exchangeInfo.riskLevel === 'HIGH') flags.push('HIGH_RISK_EXCHANGE');
    
    return flags;
  }

  private calculateCentrality(node: AddressNode): number {
    // Implementar cálculo de centralidade
    const totalConnections = node.incoming.length + node.outgoing.length;
    return Math.min(totalConnections / 100, 1); // Normalizar
  }

  private calculateClustering(node: AddressNode): number {
    // Implementar coeficiente de clustering
    return 0.5; // Placeholder
  }

  private calculateShortestPaths(node: AddressNode): { minRiskyPath: number } {
    // Implementar cálculo de caminhos mais curtos
    return { minRiskyPath: 5 }; // Placeholder
  }

  private async getAddressTransactions(address: string, blockchain: Blockchain): Promise<any[]> {
    return await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAddress: address },
          { toAddress: address }
        ],
        blockchain
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
  }

  private analyzeBehaviorPatterns(transactions: any[]): BehaviorPatterns {
    // Implementar análise de padrões comportamentais
    return {
      peelChainScore: 0,
      unusualTimingScore: 0,
      roundAmountScore: 0,
      weekendActivityScore: 0
    };
  }

  private async identifyAddressCluster(address: string, blockchain: Blockchain): Promise<AddressCluster | null> {
    // Implementar identificação de clusters
    return null;
  }
}

// Interfaces
interface AddressNode {
  address: string;
  incoming: TransactionEdge[];
  outgoing: TransactionEdge[];
  riskScore: number;
  lastUpdated: Date;
}

interface TransactionEdge {
  from?: string;
  to?: string;
  amount: number;
  timestamp: Date;
  txHash: string;
}

interface IntelligenceResult {
  riskScore: number;
  confidence: number;
  flags: string[];
  category: string;
  details: string;
}

interface AddressIntelligence {
  address: string;
  blockchain: Blockchain;
  riskScore: number;
  riskLevel: RiskLevel;
  categories: string[];
  flags: string[];
  confidence: number;
  lastUpdated: Date;
  sources: string[];
  metadata: any;
}

interface CachedRiskScore {
  intelligence: AddressIntelligence;
  timestamp: number;
}

interface ExchangeInfo {
  address?: string;
  name: string;
  jurisdiction: string;
  riskLevel: string;
  kyc: boolean;
}

interface BehaviorPatterns {
  peelChainScore: number;
  unusualTimingScore: number;
  roundAmountScore: number;
  weekendActivityScore: number;
}

interface AddressCluster {
  id: string;
  size: number;
  highRiskAddresses: number;
  coordinatedActivity: number;
  type?: string;
}

export const blockchainIntelligence = new BlockchainIntelligenceService();