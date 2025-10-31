import axios from 'axios';
import prisma from '../utils/prisma';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const analyzeWalletRisk = async (walletId: string) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: { transactions: true }
    });

    if (!wallet) return;

    const response = await axios.post(`${ML_SERVICE_URL}/analyze/wallet`, {
      address: wallet.address,
      blockchain: wallet.blockchain,
      transactions: wallet.transactions
    });

    const { riskScore, riskLevel, flags } = response.data;

    await prisma.wallet.update({
      where: { id: walletId },
      data: { riskScore, riskLevel }
    });

    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      await prisma.alert.create({
        data: {
          userId: wallet.userId,
          walletId: wallet.id,
          type: 'HIGH_RISK_TRANSACTION',
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

    const response = await axios.post(`${ML_SERVICE_URL}/analyze/transaction`, {
      hash: transaction.hash,
      fromAddress: transaction.fromAddress,
      toAddress: transaction.toAddress,
      amount: transaction.amount,
      blockchain: transaction.blockchain
    });

    const { riskScore, riskLevel, flags } = response.data;

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { riskScore, riskLevel, flags, analyzed: true }
    });

    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      await prisma.alert.create({
        data: {
          userId: transaction.wallet.userId,
          walletId: transaction.walletId,
          transactionId: transaction.id,
          type: 'HIGH_RISK_TRANSACTION',
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
