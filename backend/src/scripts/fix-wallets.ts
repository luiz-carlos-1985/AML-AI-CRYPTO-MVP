import prisma from '../utils/prisma';
import { Blockchain } from '@prisma/client';

async function fixWallets() {
  console.log('🔧 Fixing wallets with incorrect blockchain...');

  const result = await prisma.wallet.updateMany({
    where: {
      address: { startsWith: '0x' },
      blockchain: Blockchain.BITCOIN
    },
    data: {
      blockchain: Blockchain.ETHEREUM
    }
  });

  console.log(`✅ Fixed ${result.count} wallets`);

  const wallets = await prisma.wallet.findMany({
    select: { id: true, address: true, blockchain: true }
  });

  console.log('\n📋 Current wallets:');
  wallets.forEach(w => {
    console.log(`  ${w.address.substring(0, 20)}... -> ${w.blockchain}`);
  });

  await prisma.$disconnect();
}

fixWallets().catch(console.error);
