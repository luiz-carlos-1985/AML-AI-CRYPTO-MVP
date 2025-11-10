const axios = require('axios');
require('dotenv').config();

async function testAPI() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  
  console.log('Testing Etherscan API...');
  console.log('API Key:', apiKey);
  console.log('Address:', address);
  
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
    
    console.log('\nResponse status:', response.data.status);
    console.log('Response message:', response.data.message);
    console.log('Number of transactions:', response.data.result?.length || 0);
    
    if (response.data.result && response.data.result.length > 0) {
      console.log('\nFirst transaction:');
      console.log(JSON.stringify(response.data.result[0], null, 2));
    }
  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
