const axios = require('axios');
require('dotenv').config();

async function testAPI() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  
  console.log('Testing Etherscan API V1...');
  
  try {
    const response = await axios.get('https://api-sepolia.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: apiKey
      }
    });
    
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    console.log('Transactions:', response.data.result?.length || 0);
    
    if (response.data.result && Array.isArray(response.data.result) && response.data.result.length > 0) {
      console.log('\n✅ API FUNCIONANDO!');
      console.log('Primeira transação:', response.data.result[0].hash);
    } else {
      console.log('\n⚠️ Nenhuma transação encontrada para este endereço');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testAPI();
