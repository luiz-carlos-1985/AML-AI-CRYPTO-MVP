import axios from 'axios';
import prisma from '../utils/prisma';
import { RiskLevel, AlertType } from '@prisma/client';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Check if ML service is available
let mlServiceAvailable = false;
axios.get(`${ML_SERVICE_URL}/health`, { timeout: 2000 })
  .then(() => {
    mlServiceAvailable = true;
    console.log('✅ ML Service connected');
  })
  .catch(() => {
    mlServiceAvailable = false;
    console.log('⚠️ ML Service offline, using fallback');
  });

export const analyzeWalletRisk = async (walletId: string) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: { transactions: true }
    });

    if (!wallet) return;

    let riskScore = 0;
    let riskLevel = RiskLevel.LOW;
    let flags: string[] = [];

    try {
      // Try ML service first
      const response = await axios.post(`${ML_SERVICE_URL}/analyze/wallet`, {
        address: wallet.address,
        blockchain: wallet.blockchain,
        transactions: wallet.transactions
      }, { timeout: 5000 });

      ({ riskScore, riskLevel, flags } = response.data);
    } catch (mlError) {
      // Fallback to basic rule-based analysis
      console.warn('ML service unavailable, using fallback analysis');
      
      const txCount = wallet.transactions.length;
      const totalValue = wallet.transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const highRiskTx = wallet.transactions.filter(tx => tx.riskLevel === RiskLevel.HIGH || tx.riskLevel === RiskLevel.CRITICAL).length;
      
      if (highRiskTx > 0) {
        riskScore += 50;
        flags.push('HIGH_RISK_TRANSACTIONS');
      }
      if (totalValue > 100000) {
        riskScore += 30;
        flags.push('HIGH_VALUE_WALLET');
      }
      if (txCount > 100) {
        riskScore += 20;
        flags.push('HIGH_ACTIVITY');
      }
      
      if (riskScore >= 70) riskLevel = RiskLevel.CRITICAL;
      else if (riskScore >= 50) riskLevel = RiskLevel.HIGH;
      else if (riskScore >= 30) riskLevel = RiskLevel.MEDIUM;
      else riskLevel = RiskLevel.LOW;
    }

    await prisma.wallet.update({
      where: { id: walletId },
      data: { riskScore, riskLevel }
    });

    if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL) {
      await prisma.alert.create({
        data: {
          userId: wallet.userId,
          walletId: wallet.id,
          type: AlertType.HIGH_RISK_TRANSACTION,
          severity: riskLevel,
          title: `High Risk Detected: ${wallet.address}`,
          description: `Wallet flagged with risk score ${riskScore}. Flags: ${flags.join(', ')}`
        }
      });
    }
  } catch (error) {
    console.error('Risk analysis failed:', error);
  }
};

export const analyzeTransaction = async (transactionId: string) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) return;

    let riskScore = 0;
    let riskLevel = RiskLevel.LOW;
    let flags: string[] = [];

    try {
      // Try ML service first
      const response = await axios.post(`${ML_SERVICE_URL}/analyze/transaction`, {
        hash: transaction.hash,
        fromAddress: transaction.fromAddress,
        toAddress: transaction.toAddress,
        amount: transaction.amount,
        blockchain: transaction.blockchain
      }, { timeout: 5000 });

      ({ riskScore, riskLevel, flags } = response.data);
    } catch (mlError) {
      // Fallback to basic rule-based analysis
      console.warn('ML service unavailable, using fallback analysis');
      
      if (transaction.amount > 50000) {
        riskScore += 40;
        flags.push('HIGH_VALUE');
      }
      if (transaction.amount > 10000) {
        riskScore += 20;
        flags.push('MEDIUM_VALUE');
      }
      
      // Check for round numbers (common in money laundering)
      if (transaction.amount % 1000 === 0) {
        riskScore += 15;
        flags.push('ROUND_AMOUNT');
      }
      
      if (riskScore >= 70) riskLevel = RiskLevel.CRITICAL;
      else if (riskScore >= 50) riskLevel = RiskLevel.HIGH;
      else if (riskScore >= 30) riskLevel = RiskLevel.MEDIUM;
      else riskLevel = RiskLevel.LOW;
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { riskScore, riskLevel, flags, analyzed: true }
    });

    if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL) {
      await prisma.alert.create({
        data: {
          userId: transaction.wallet.userId,
          walletId: transaction.walletId,
          transactionId: transaction.id,
          type: AlertType.HIGH_RISK_TRANSACTION,
          severity: riskLevel,
          title: `Suspicious Transaction Detected`,
          description: `Transaction ${transaction.hash} flagged with risk score ${riskScore}. Flags: ${flags.join(', ')}`
        }
      });
    }
  } catch (error) {
    console.error('Transaction analysis failed:', error);
  }
};
