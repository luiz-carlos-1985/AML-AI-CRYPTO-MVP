const axios = require('axios');
require('dotenv').config();

async function testComplete() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  
  console.log('='.repeat(60));
  console.log('TESTE COMPLETO DO SISTEMA');
  console.log('='.repeat(60));
  
  // Teste 1: Ethereum Mainnet
  console.log('\n1. Testando Ethereum Mainnet...');
  try {
    const res1 = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: 1,
        module: 'account',
        action: 'txlist',
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        page: 1,
        offset: 5,
        sort: 'desc',
        apikey: apiKey
      },
      timeout: 10000
    });
    
    if (res1.data.status === '1') {
      console.log('   ✅ Ethereum: OK -', res1.data.result.length, 'transações');
    } else {
      console.log('   ❌ Ethereum:', res1.data.message);
    }
  } catch (e) {
    console.log('   ❌ Ethereum: Erro -', e.message);
  }
  
  // Teste 2: Sepolia
  console.log('\n2. Testando Sepolia...');
  try {
    const res2 = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: 11155111,
        module: 'account',
        action: 'txlist',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        page: 1,
        offset: 5,
        sort: 'desc',
        apikey: apiKey
      },
      timeout: 10000
    });
    
    if (res2.data.status === '1') {
      console.log('   ✅ Sepolia: OK -', res2.data.result.length, 'transações');
    } else {
      console.log('   ❌ Sepolia:', res2.data.message);
    }
  } catch (e) {
    console.log('   ❌ Sepolia: Erro -', e.message);
  }
  
  // Teste 3: Bitcoin
  console.log('\n3. Testando Bitcoin...');
  try {
    const res3 = await axios.get('https://blockstream.info/api/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa/txs', {
      timeout: 10000
    });
    
    if (Array.isArray(res3.data)) {
      console.log('   ✅ Bitcoin: OK -', res3.data.length, 'transações');
    } else {
      console.log('   ❌ Bitcoin: Formato inválido');
    }
  } catch (e) {
    console.log('   ❌ Bitcoin: Erro -', e.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTADO FINAL');
  console.log('='.repeat(60));
  console.log('\nSe todos os testes passaram, o sistema está funcionando.');
  console.log('Reinicie o backend e teste no navegador.\n');
}

testComplete();
