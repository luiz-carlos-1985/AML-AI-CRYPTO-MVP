import prisma from '../utils/prisma';

async function checkData() {
  console.log('🔍 Checking database data...\n');

  try {
    // Check users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log(`👥 Users: ${users.length}`);
    users.forEach(u => console.log(`  - ${u.email} (${u.id})`));

    // Check wallets
    const wallets = await prisma.wallet.findMany({
      include: {
        _count: {
          select: { transactions: true, alerts: true }
        }
      }
    });
    console.log(`\n💰 Wallets: ${wallets.length}`);
    wallets.forEach(w => {
      console.log(`  - ${w.address.substring(0, 10)}... (${w.blockchain})`);
      console.log(`    Transactions: ${w._count.transactions}, Alerts: ${w._count.alerts}`);
      console.log(`    Risk: ${w.riskLevel} (${w.riskScore})`);
    });

    // Check transactions
    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' }
    });
    console.log(`\n💸 Recent Transactions: ${transactions.length}`);
    transactions.forEach(t => {
      console.log(`  - ${t.hash.substring(0, 10)}... ${t.amount} (${t.blockchain})`);
      console.log(`    Risk: ${t.riskLevel} (${t.riskScore})`);
    });

    // Check alerts
    const alerts = await prisma.alert.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`\n🚨 Recent Alerts: ${alerts.length}`);
    alerts.forEach(a => {
      console.log(`  - ${a.title} (${a.severity})`);
      console.log(`    Read: ${a.isRead}, Resolved: ${a.isResolved}`);
    });

    console.log('\n✅ Data check complete');
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
