const axios = require('axios');
require('dotenv').config();

async function testV2() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  
  console.log('Testing API V2...\n');
  
  try {
    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: 1,
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
    
    if (response.data.status === '1') {
      console.log('Transactions:', response.data.result.length);
      console.log('\n✅ FUNCIONOU! Sistema pronto.\n');
    } else {
      console.log('❌ Erro:', response.data.result);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testV2();
