const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleAuditLogs() {
  try {
    const sampleLogs = [
      {
        action: 'user_login',
        userId: 'system',
        resource: 'auth',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        action: 'wallet_added',
        userId: 'system',
        resource: 'wallet',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        action: 'high_risk_alert',
        userId: 'system',
        resource: 'alert',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        action: 'report_generated',
        userId: 'system',
        resource: 'report',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        action: 'config_updated',
        userId: 'system',
        resource: 'config',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    for (const log of sampleLogs) {
      await prisma.auditLog.create({
        data: log
      });
    }

    console.log('✅ Sample audit logs added successfully');
  } catch (error) {
    console.error('❌ Error adding sample audit logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleAuditLogs();