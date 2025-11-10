import prisma from '../utils/prisma';

async function checkCounts() {
  const wallets = await prisma.wallet.findMany({
    include: {
      _count: {
        select: {
          transactions: true,
          alerts: true
        }
      }
    }
  });

  console.log('\n=== WALLET COUNTS ===');
  for (const wallet of wallets) {
    console.log(`\nWallet: ${wallet.label || wallet.address}`);
    console.log(`  ID: ${wallet.id}`);
    console.log(`  Transactions (via _count): ${wallet._count.transactions}`);
    console.log(`  Alerts (via _count): ${wallet._count.alerts}`);
    
    const txCount = await prisma.transaction.count({ where: { walletId: wallet.id } });
    const alertCount = await prisma.alert.count({ where: { walletId: wallet.id } });
    
    console.log(`  Transactions (manual count): ${txCount}`);
    console.log(`  Alerts (manual count): ${alertCount}`);
  }

  await prisma.$disconnect();
}

checkCounts();
