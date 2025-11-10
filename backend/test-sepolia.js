const axios = require('axios');
require('dotenv').config();

async function testSepolia(address) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  
  console.log(`\n🔍 Testando Sepolia para: ${address}\n`);
  
  try {
    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: 11155111,
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: apiKey
      },
      timeout: 15000
    });
    
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    
    if (response.data.status === '1' && Array.isArray(response.data.result)) {
      console.log(`\n✅ ${response.data.result.length} transações encontradas!\n`);
      
      if (response.data.result.length > 0) {
        console.log('Primeira transação:');
        const tx = response.data.result[0];
        console.log(`  Hash: ${tx.hash}`);
        console.log(`  From: ${tx.from}`);
        console.log(`  To: ${tx.to}`);
        console.log(`  Value: ${parseFloat(tx.value) / 1e18} ETH`);
      }
    } else {
      console.log('\n❌ Nenhuma transação encontrada');
      console.log('Resultado:', response.data.result);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Coloque o endereço da sua carteira Sepolia aqui
const address = process.argv[2] || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
testSepolia(address);
