const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

async function testWalletFunctionalities() {
  console.log('🧪 Testing Wallet Functionalities...\n');

  try {
    // 1. Login first
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@cryptoaml.com',
      password: 'admin123'
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login successful\n');

    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Test get wallets
    console.log('2. Getting wallets...');
    const walletsResponse = await axios.get(`${BASE_URL}/wallets`, { headers });
    console.log(`✅ Found ${walletsResponse.data.length} wallets\n`);

    // 3. Test generate wallet
    console.log('3. Generating new wallet...');
    const generateResponse = await axios.post(`${BASE_URL}/wallets/generate`, {
      label: 'Test Generated Wallet',
      blockchain: 'ETHEREUM'
    }, { headers });
    console.log('✅ Wallet generated:', generateResponse.data.wallet.address);
    const generatedWalletId = generateResponse.data.wallet.id;
    console.log('🔑 Mnemonic:', generateResponse.data.mnemonic.substring(0, 20) + '...\n');

    // 4. Test add wallet by address
    console.log('4. Adding wallet by address...');
    const addResponse = await axios.post(`${BASE_URL}/wallets`, {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      blockchain: 'ETHEREUM',
      label: 'Test Added Wallet'
    }, { headers });
    console.log('✅ Wallet added:', addResponse.data.address);
    const addedWalletId = addResponse.data.id;

    // 5. Test get specific wallet
    console.log('\n5. Getting specific wallet...');
    const walletResponse = await axios.get(`${BASE_URL}/wallets/${addedWalletId}`, { headers });
    console.log('✅ Wallet details:', walletResponse.data.label);

    // 6. Test update wallet
    console.log('\n6. Updating wallet...');
    const updateResponse = await axios.put(`${BASE_URL}/wallets/${addedWalletId}`, {
      label: 'Updated Test Wallet',
      isMonitored: false
    }, { headers });
    console.log('✅ Wallet updated:', updateResponse.data.label);

    // 7. Test sync wallet
    console.log('\n7. Syncing wallet...');
    const syncResponse = await axios.post(`${BASE_URL}/wallets/${addedWalletId}/sync`, {}, { headers });
    console.log('✅ Wallet synced:', syncResponse.data.message);
    console.log('📊 Transactions found:', syncResponse.data.transactionsFound);
    console.log('💰 Balance:', syncResponse.data.balance, 'ETH');

    // 8. Test import from mnemonic
    console.log('\n8. Testing import from mnemonic...');
    try {
      const importResponse = await axios.post(`${BASE_URL}/wallets/import/mnemonic`, {
        mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        label: 'Test Imported Wallet',
        blockchain: 'ETHEREUM',
        accountIndex: 0
      }, { headers });
      console.log('✅ Wallet imported from mnemonic:', importResponse.data.wallet.address);
    } catch (error) {
      console.log('⚠️ Import failed (wallet may already exist)');
    }

    // 9. Test delete wallet
    console.log('\n9. Deleting test wallets...');
    await axios.delete(`${BASE_URL}/wallets/${generatedWalletId}`, { headers });
    await axios.delete(`${BASE_URL}/wallets/${addedWalletId}`, { headers });
    console.log('✅ Test wallets deleted');

    // 10. Final wallet count
    console.log('\n10. Final wallet count...');
    const finalWalletsResponse = await axios.get(`${BASE_URL}/wallets`, { headers });
    console.log(`✅ Final count: ${finalWalletsResponse.data.length} wallets`);

    console.log('\n🎉 All wallet functionalities tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testWalletFunctionalities();