const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const axios = require('axios');
require('dotenv').config();

const BLOCKCHAIN_APIS = {
  ethereum: { url: 'https://api.etherscan.io/v2/api', chainid: 1 }
};

async function fetchTransactions(address) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const response = await axios.get(BLOCKCHAIN_APIS.ethereum.url, {
    params: {
      chainid: BLOCKCHAIN_APIS.ethereum.chainid,
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 50,
      sort: 'desc',
      apikey: apiKey
    },
    timeout: 15000
  });
  
  if (response.data.status === '1' && Array.isArray(response.data.result)) {
    return response.data.result.map(tx => ({
      hash: tx.hash,
      fromAddress: tx.from,
      toAddress: tx.to,
      amount: parseFloat(tx.value) / 1e18,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      blockchain: 'ETHEREUM'
    }));
  }
  return [];
}

async function syncAll() {
  try {
    const wallets = await prisma.wallet.findMany();
    
    console.log(`\n🔄 Sincronizando ${wallets.length} carteiras...\n`);
    
    for (const wallet of wallets) {
      console.log(`📍 ${wallet.address.substring(0, 20)}...`);
      console.log(`   Blockchain: ${wallet.blockchain}`);
      
      try {
        const transactions = await fetchTransactions(wallet.address);
        
        for (const tx of transactions) {
          await prisma.transaction.upsert({
            where: { hash: tx.hash },
            create: {
              hash: tx.hash,
              fromAddress: tx.fromAddress,
              toAddress: tx.toAddress,
              amount: tx.amount,
              timestamp: tx.timestamp,
              blockchain: tx.blockchain,
              walletId: wallet.id,
              riskScore: 0,
              riskLevel: 'LOW',
              flags: [],
              analyzed: false
            },
            update: {}
          });
        }
        
        const updated = await prisma.wallet.findUnique({
          where: { id: wallet.id },
          include: { _count: { select: { transactions: true } } }
        });
        
        console.log(`   ✅ ${updated._count.transactions} transações\n`);
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}\n`);
      }
    }
    
    console.log('✅ Sincronização completa!\n');
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncAll();
