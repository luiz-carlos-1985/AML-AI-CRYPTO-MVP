import axios from 'axios';

async function testApi() {
  try {
    // Login first
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'luizcarlos_1985@hotmail.com',
      password: 'sua_senha_aqui'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful');
    
    // Get wallets
    const walletsRes = await axios.get('http://localhost:3000/api/wallets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n=== API RESPONSE ===');
    console.log(JSON.stringify(walletsRes.data, null, 2));
    
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testApi();
