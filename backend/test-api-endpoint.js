const axios = require('axios');

async function testEndpoint() {
  try {
    // Primeiro, fazer login
    console.log('1. Fazendo login...');
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'luizcarlos_1985@hotmail.com',
      password: 'senha123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login OK\n');
    
    // Buscar carteiras
    console.log('2. Buscando carteiras...');
    const walletsRes = await axios.get('http://localhost:3001/api/wallets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ ${walletsRes.data.length} carteiras encontradas\n`);
    
    walletsRes.data.forEach(w => {
      console.log(`📍 ${w.address.substring(0, 10)}...`);
      console.log(`   Blockchain: ${w.blockchain}`);
      console.log(`   Transações: ${w._count?.transactions || 0}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testEndpoint();
