import axios from 'axios';
import prisma from '../utils/prisma';
import { notifyUser } from './websocket.service';
import { logger } from '../utils/logger';
import { RiskLevel, AlertType, Blockchain } from '@prisma/client';

// APIs gratuitas para dados blockchain
const BLOCKCHAIN_APIS = {
  bitcoin: 'https://blockstream.info/api',
  ethereum: 'https://api.etherscan.io/api',
  polygon: 'https://api.polygonscan.com/api',
  arbitrum: 'https://api.arbiscan.io/api',
  optimism: 'https://api-optimistic.etherscan.io/api',
  bsc: 'https://api.bscscan.com/api',
  base: 'https://api.basescan.org/api'
};

export class BlockchainMonitor {
  
  // Monitora uma carteira específica
  async monitorWallet(address: string, blockchain: Blockchain, userId: string) {
    try {
      logger.info(`Monitoring wallet: ${address} (${blockchain})`);
      
      const wallet = await prisma.wallet.upsert({
        where: { address },
        create: { address, blockchain, userId },
        update: { updatedAt: new Date() }
      });

      // Get existing transaction hashes to avoid duplicates
      const existingTxs = await prisma.transaction.findMany({
        where: { walletId: wallet.id },
        select: { hash: true }
      });
      const existingHashes = new Set(existingTxs.map(tx => tx.hash));

      const transactions = await this.fetchWalletTransactions(address, blockchain);
      const newTransactions = transactions.filter(tx => !existingHashes.has(tx.hash));
      
      logger.info(`Found ${transactions.length} total transactions, ${newTransactions.length} new for ${address}`);
      
      for (const tx of newTransactions) {
        await this.processTransaction(tx, wallet.id);
      }

      return wallet;
    } catch (error) {
      logger.error('Wallet monitoring failed', { error, address, blockchain });
      throw error;
    }
  }

  // Busca transações de uma carteira
  private async fetchWalletTransactions(address: string, blockchain: Blockchain) {
    // Validar formato do endereço
    if (blockchain === Blockchain.BITCOIN && address.startsWith('0x')) {
      logger.warn(`Invalid Bitcoin address format: ${address}`);
      return [];
    }
    
    const evmChains = [Blockchain.ETHEREUM, Blockchain.POLYGON, Blockchain.ARBITRUM, Blockchain.OPTIMISM, Blockchain.BASE, Blockchain.BNB_CHAIN];
    if (evmChains.includes(blockchain) && !address.startsWith('0x')) {
      logger.warn(`Invalid EVM address format: ${address}`);
      return [];
    }

    switch (blockchain) {
      case Blockchain.BITCOIN:
        return this.fetchBitcoinTransactions(address);
      case Blockchain.ETHEREUM:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.ethereum);
      case Blockchain.POLYGON:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.polygon);
      case Blockchain.ARBITRUM:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.arbitrum);
      case Blockchain.OPTIMISM:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.optimism);
      case Blockchain.BNB_CHAIN:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.bsc);
      case Blockchain.BASE:
        return this.fetchEVMTransactions(address, blockchain, BLOCKCHAIN_APIS.base);
      default:
        logger.warn(`Blockchain ${blockchain} not supported yet`);
        return [];
    }
  }

  // Bitcoin via Blockstream API (gratuita)
  private async fetchBitcoinTransactions(address: string) {
    try {
      const response = await axios.get(`${BLOCKCHAIN_APIS.bitcoin}/address/${address}/txs`);
      return response.data.map((tx: any) => ({
        hash: tx.txid,
        fromAddress: tx.vin[0]?.prevout?.scriptpubkey_address || 'unknown',
        toAddress: tx.vout[0]?.scriptpubkey_address || 'unknown',
        amount: tx.vout[0]?.value || 0,
        timestamp: new Date(tx.status.block_time * 1000),
        blockchain: Blockchain.BITCOIN
      }));
    } catch (error) {
      logger.error('Failed to fetch Bitcoin transactions', { error, address });
      return [];
    }
  }

  // EVM chains via Etherscan-like APIs (gratuita com rate limit)
  private async fetchEVMTransactions(address: string, blockchain: Blockchain, apiUrl: string) {
    try {
      const apiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
      const response = await axios.get(apiUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 100, // Limit to last 100 transactions
          sort: 'desc',
          apikey: apiKey
        },
        timeout: 10000
      });

      if (!response.data.result || !Array.isArray(response.data.result)) {
        return [];
      }

      return response.data.result.slice(0, 50).map((tx: any) => ({
        hash: tx.hash,
        fromAddress: tx.from,
        toAddress: tx.to,
        amount: parseFloat(tx.value) / 1e18,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        blockchain
      }));
    } catch (error) {
      logger.error(`Failed to fetch ${blockchain} transactions`, { error, address });
      return [];
    }
  }

  // Processa e salva transação
  private async processTransaction(txData: any, walletId: string) {
    try {
      const transaction = await prisma.transaction.upsert({
        where: { hash: txData.hash },
        create: {
          hash: txData.hash,
          fromAddress: txData.fromAddress,
          toAddress: txData.toAddress,
          amount: txData.amount,
          timestamp: txData.timestamp,
          blockchain: txData.blockchain,
          walletId,
          riskScore: 0,
          riskLevel: RiskLevel.LOW,
          flags: [],
          analyzed: false
        },
        update: {
          updatedAt: new Date()
        }
      });

      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (wallet) {
        notifyUser(wallet.userId, 'transaction:new', transaction);
      }

      await this.analyzeTransactionRisk(transaction.id);
    } catch (error) {
      logger.error('Failed to process transaction', { error, txData, walletId });
    }
  }

  // Análise de risco em tempo real
  private async analyzeTransactionRisk(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) return;

    // Regras básicas de detecção
    let riskScore = 0;
    const flags: string[] = [];

    // Valor alto
    if (transaction.amount > 10000) {
      riskScore += 30;
      flags.push('HIGH_VALUE');
    }

    // Endereços conhecidos suspeitos (lista negra)
    const suspiciousAddresses = await this.checkBlacklist(transaction.toAddress);
    if (suspiciousAddresses) {
      riskScore += 50;
      flags.push('BLACKLISTED_ADDRESS');
    }

    // Transações frequentes
    const recentTxCount = await prisma.transaction.count({
      where: {
        walletId: transaction.walletId,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    if (recentTxCount > 10) {
      riskScore += 25;
      flags.push('HIGH_FREQUENCY');
    }

    const riskLevel = this.calculateRiskLevel(riskScore);

    const updatedTx = await prisma.transaction.update({
      where: { id: transactionId },
      data: { riskScore, riskLevel, flags, analyzed: true }
    });

    const wallet = await prisma.wallet.findUnique({ where: { id: transaction.walletId } });
    if (wallet) {
      notifyUser(wallet.userId, 'transaction:analyzed', updatedTx);
    }

    if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL) {
      await this.createAlert(transaction, riskScore, flags);
    }
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 70) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 30) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private async checkBlacklist(address: string): Promise<boolean> {
    // Integração com listas de endereços suspeitos
    // Pode usar APIs como Chainalysis, Elliptic, ou listas públicas
    const blacklistedAddresses = [
      // Endereços conhecidos de exchanges hackeadas, mixers, etc.
    ];
    return blacklistedAddresses.includes(address);
  }

  private async createAlert(transaction: any, riskScore: number, flags: string[]) {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: { id: transaction.walletId }
      });

      if (!wallet) return;

      const alert = await prisma.alert.create({
        data: {
          userId: wallet.userId,
          walletId: wallet.id,
          transactionId: transaction.id,
          type: AlertType.SUSPICIOUS_PATTERN,
          severity: this.calculateRiskLevel(riskScore),
          title: `Transação Suspeita Detectada`,
          description: `Transação ${transaction.hash} com score ${riskScore}. Flags: ${flags.join(', ')}`
        }
      });

      notifyUser(wallet.userId, 'alert:new', alert);
    } catch (error) {
      logger.error('Failed to create alert', { error, transaction, riskScore });
    }
  }

  private monitoringInterval: NodeJS.Timeout | null = null;

  async startContinuousMonitoring() {
    if (this.monitoringInterval) {
      return;
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        const walletsToMonitor = await prisma.wallet.findMany({
          where: {
            isMonitored: true,
            updatedAt: {
              lt: new Date(Date.now() - 2 * 60 * 1000)
            }
          },
          take: 100
        });

        for (const wallet of walletsToMonitor) {
          await this.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);
        }
      } catch (error) {
        logger.error('Monitoring cycle failed', { error });
      }
    }, 30000);
  }

  stopContinuousMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('Monitoring stopped');
    }
  }
}

export const blockchainMonitor = new BlockchainMonitor();