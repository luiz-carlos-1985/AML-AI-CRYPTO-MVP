import prisma from '../utils/prisma';
import { notifyUser } from './websocket.service';
import { AlertType, RiskLevel } from '@prisma/client';

export class AlertService {
  static async createTransactionAlert(transactionId: string, riskScore: number, flags: string[]) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction?.wallet) return;

    const severity = riskScore >= 80 ? RiskLevel.CRITICAL : 
                    riskScore >= 60 ? RiskLevel.HIGH : 
                    riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;

    const alert = await prisma.alert.create({
      data: {
        userId: transaction.wallet.userId,
        walletId: transaction.walletId,
        transactionId,
        type: AlertType.HIGH_RISK_TRANSACTION,
        severity,
        title: `High Risk Transaction: ${transaction.amount} ${transaction.blockchain}`,
        description: `Transaction ${transaction.hash} flagged with risk score ${riskScore}. Flags: ${flags.join(', ')}`
      }
    });

    notifyUser(transaction.wallet.userId, 'alert:new', alert);
    return alert;
  }

  static async autoResolveOldAlerts() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return await prisma.alert.updateMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        isResolved: false,
        severity: { in: [RiskLevel.LOW, RiskLevel.MEDIUM] }
      },
      data: { isResolved: true, isRead: true }
    });
  }
}