import axios from 'axios';
import prisma from '../utils/prisma';

// APIs gratuitas para dados blockchain
const BLOCKCHAIN_APIS = {
  bitcoin: 'https://blockstream.info/api',
  ethereum: 'https://api.etherscan.io/api',
  polygon: 'https://api.polygonscan.com/api'
};

export class BlockchainMonitor {
  
  // Monitora uma carteira específica
  async monitorWallet(address: string, blockchain: string, userId: string) {
    try {
      const wallet = await prisma.wallet.upsert({
        where: { address },
        create: { address, blockchain, userId },
        update: { updatedAt: new Date() }
      });

      // Busca transações da carteira
      const transactions = await this.fetchWalletTransactions(address, blockchain);
      
      for (const tx of transactions) {
        await this.processTransaction(tx, wallet.id);
      }

      return wallet;
    } catch (error) {
      console.error('Wallet monitoring failed:', error);
    }
  }

  // Busca transações de uma carteira
  private async fetchWalletTransactions(address: string, blockchain: string) {
    switch (blockchain.toLowerCase()) {
      case 'bitcoin':
        return this.fetchBitcoinTransactions(address);
      case 'ethereum':
        return this.fetchEthereumTransactions(address);
      default:
        throw new Error(`Blockchain ${blockchain} not supported`);
    }
  }

  // Bitcoin via Blockstream API (gratuita)
  private async fetchBitcoinTransactions(address: string) {
    const response = await axios.get(`${BLOCKCHAIN_APIS.bitcoin}/address/${address}/txs`);
    return response.data.map((tx: any) => ({
      hash: tx.txid,
      fromAddress: tx.vin[0]?.prevout?.scriptpubkey_address || 'unknown',
      toAddress: tx.vout[0]?.scriptpubkey_address || 'unknown',
      amount: tx.vout[0]?.value || 0,
      timestamp: new Date(tx.status.block_time * 1000),
      blockchain: 'bitcoin',
      blockNumber: tx.status.block_height
    }));
  }

  // Ethereum via Etherscan API (gratuita com rate limit)
  private async fetchEthereumTransactions(address: string) {
    const apiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
    const response = await axios.get(`${BLOCKCHAIN_APIS.ethereum}`, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: apiKey
      }
    });

    return response.data.result.map((tx: any) => ({
      hash: tx.hash,
      fromAddress: tx.from,
      toAddress: tx.to,
      amount: parseFloat(tx.value) / 1e18, // Wei to ETH
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      blockchain: 'ethereum',
      blockNumber: parseInt(tx.blockNumber)
    }));
  }

  // Processa e salva transação
  private async processTransaction(txData: any, walletId: string) {
    const existingTx = await prisma.transaction.findUnique({
      where: { hash: txData.hash }
    });

    if (existingTx) return;

    const transaction = await prisma.transaction.create({
      data: {
        hash: txData.hash,
        fromAddress: txData.fromAddress,
        toAddress: txData.toAddress,
        amount: txData.amount,
        timestamp: txData.timestamp,
        blockchain: txData.blockchain,
        blockNumber: txData.blockNumber,
        walletId,
        analyzed: false
      }
    });

    // Analisa risco da transação
    await this.analyzeTransactionRisk(transaction.id);
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
        fromAddress: transaction.fromAddress,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
        }
      }
    });

    if (recentTxCount > 10) {
      riskScore += 25;
      flags.push('HIGH_FREQUENCY');
    }

    const riskLevel = this.calculateRiskLevel(riskScore);

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { riskScore, riskLevel, flags, analyzed: true }
    });

    // Cria alerta se necessário
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      await this.createAlert(transaction, riskScore, flags);
    }
  }

  private calculateRiskLevel(score: number): string {
    if (score >= 70) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
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
    const wallet = await prisma.wallet.findUnique({
      where: { id: transaction.walletId }
    });

    if (!wallet) return;

    await prisma.alert.create({
      data: {
        userId: wallet.userId,
        walletId: wallet.id,
        transactionId: transaction.id,
        type: 'SUSPICIOUS_TRANSACTION',
        severity: this.calculateRiskLevel(riskScore),
        title: `Transação Suspeita Detectada`,
        description: `Transação ${transaction.hash} com score ${riskScore}. Flags: ${flags.join(', ')}`
      }
    });
  }

  // Monitoramento contínuo
  async startContinuousMonitoring() {
    setInterval(async () => {
      const walletsToMonitor = await prisma.wallet.findMany({
        where: {
          isMonitored: true,
          updatedAt: {
            lt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutos atrás
          }
        }
      });

      for (const wallet of walletsToMonitor) {
        await this.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);
      }
    }, 60000); // Executa a cada minuto
  }
}

export const blockchainMonitor = new BlockchainMonitor();