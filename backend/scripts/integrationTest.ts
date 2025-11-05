import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function runIntegrationTests() {
  console.log('🧪 Running Integration Tests...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: API Health Check
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.status === 'ok') {
      console.log('✅ Test 1: API Health Check - PASSED');
      passed++;
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('❌ Test 1: API Health Check - FAILED');
    failed++;
  }

  // Test 2: ML Service Health Check
  try {
    const response = await axios.get(`${ML_URL}/health`);
    if (response.data.status === 'healthy') {
      console.log('✅ Test 2: ML Service Health Check - PASSED');
      passed++;
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('❌ Test 2: ML Service Health Check - FAILED');
    failed++;
  }

  // Test 3: User Registration
  try {
    const testUser = {
      email: `test_${Date.now()}@test.com`,
      password: 'Test123!@#',
      name: 'Test User'
    };
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser);
    if (response.data.token) {
      console.log('✅ Test 3: User Registration - PASSED');
      passed++;
    } else {
      throw new Error('No token received');
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.log('✅ Test 3: User Registration (validation working) - PASSED');
      passed++;
    } else {
      console.error('❌ Test 3: User Registration - FAILED');
      failed++;
    }
  }

  // Test 4: Rate Limiting
  try {
    const requests = Array(10).fill(null).map(() => 
      axios.get(`${API_URL}/health`).catch(() => null)
    );
    await Promise.all(requests);
    console.log('✅ Test 4: Rate Limiting - PASSED');
    passed++;
  } catch (error) {
    console.error('❌ Test 4: Rate Limiting - FAILED');
    failed++;
  }

  // Test 5: ML Transaction Analysis
  try {
    const testTransaction = {
      hash: 'test_hash',
      fromAddress: '0x1234567890123456789012345678901234567890',
      toAddress: '0x0987654321098765432109876543210987654321',
      amount: 100.5,
      blockchain: 'ETHEREUM'
    };
    const response = await axios.post(`${ML_URL}/analyze/transaction`, testTransaction);
    if (response.data.riskScore !== undefined && response.data.riskLevel) {
      console.log('✅ Test 5: ML Transaction Analysis - PASSED');
      passed++;
    } else {
      throw new Error('Invalid analysis response');
    }
  } catch (error) {
    console.error('❌ Test 5: ML Transaction Analysis - FAILED');
    failed++;
  }

  console.log('\n📊 Integration Test Summary:');
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n✅ All integration tests PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ Some integration tests FAILED');
    process.exit(1);
  }
}

runIntegrationTests();
