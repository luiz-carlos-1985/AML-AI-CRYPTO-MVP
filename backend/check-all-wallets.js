const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAll() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        _count: {
          select: { transactions: true }
        },
        transactions: {
          take: 3,
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('TODAS AS CARTEIRAS NO SISTEMA');
    console.log('='.repeat(70) + '\n');
    
    if (wallets.length === 0) {
      console.log('❌ Nenhuma carteira encontrada\n');
      return;
    }
    
    wallets.forEach((w, i) => {
      console.log(`${i + 1}. ${w.address}`);
      console.log(`   Blockchain: ${w.blockchain}`);
      console.log(`   Label: ${w.label || 'Sem label'}`);
      console.log(`   Transações: ${w._count.transactions}`);
      console.log(`   Risk Level: ${w.riskLevel}`);
      
      if (w.transactions.length > 0) {
        console.log(`   Últimas transações:`);
        w.transactions.forEach(tx => {
          console.log(`     - ${tx.hash.substring(0, 20)}... (${tx.amount} ETH)`);
        });
      } else {
        console.log(`   ⚠️  Sem transações sincronizadas`);
      }
      
      console.log('');
    });
    
    console.log('='.repeat(70));
    console.log(`Total: ${wallets.length} carteiras`);
    console.log('='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAll();
