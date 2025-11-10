const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
    
    console.log('\n📊 CARTEIRAS NO BANCO:\n');
    
    if (wallets.length === 0) {
      console.log('❌ Nenhuma carteira encontrada\n');
    } else {
      wallets.forEach(w => {
        console.log(`Endereço: ${w.address}`);
        console.log(`Blockchain: ${w.blockchain}`);
        console.log(`Transações: ${w._count.transactions}`);
        console.log('---');
      });
    }
    
    const txCount = await prisma.transaction.count();
    console.log(`\n💰 Total de transações no banco: ${txCount}\n`);
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
