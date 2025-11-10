const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
require('dotenv').config();

const prisma = new PrismaClient();

async function fixAndSync() {
  const address = '0x43Fe6F8BBF8bEecdB0F2d9D486c4546C307097c6';
  
  console.log('\n🔧 Corrigindo blockchain da carteira...\n');
  
  // Atualizar para SEPOLIA
  await prisma.wallet.updateMany({
    where: { address },
    data: { blockchain: 'SEPOLIA' }
  });
  
  console.log('✅ Blockchain atualizado para SEPOLIA\n');
  console.log('🔄 Sincronizando transações...\n');
  
  // Buscar transações
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const response = await axios.get('https://api.etherscan.io/v2/api', {
    params: {
      chainid: 11155111,
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 50,
      sort: 'desc',
      apikey: apiKey
    }
  });
  
  const wallet = await prisma.wallet.findUnique({ where: { address } });
  
  if (response.data.status === '1' && Array.isArray(response.data.result)) {
    for (const tx of response.data.result) {
      await prisma.transaction.upsert({
        where: { hash: tx.hash },
        create: {
          hash: tx.hash,
          fromAddress: tx.from,
          toAddress: tx.to,
          amount: parseFloat(tx.value) / 1e18,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000),
          blockchain: 'SEPOLIA',
          walletId: wallet.id,
          riskScore: 0,
          riskLevel: 'LOW',
          flags: [],
          analyzed: false
        },
        update: {}
      });
    }
    
    console.log(`✅ ${response.data.result.length} transações sincronizadas!\n`);
  }
  
  await prisma.$disconnect();
}

fixAndSync();
