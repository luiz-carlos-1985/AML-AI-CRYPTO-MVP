const axios = require('axios');
require('dotenv').config();

async function testMainnet() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  // Endereço Vitalik (tem muitas transações)
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  
  console.log('Testing Ethereum Mainnet...\n');
  
  try {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 5,
        sort: 'desc',
        apikey: apiKey
      }
    });
    
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    
    if (response.data.status === '1' && Array.isArray(response.data.result)) {
      console.log('Transactions:', response.data.result.length);
      console.log('\n✅ API KEY FUNCIONA!');
      console.log('\nPrimeira transação:');
      console.log('Hash:', response.data.result[0].hash);
      console.log('From:', response.data.result[0].from);
      console.log('To:', response.data.result[0].to);
    } else {
      console.log('\n❌ Erro:', response.data.result);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testMainnet();
