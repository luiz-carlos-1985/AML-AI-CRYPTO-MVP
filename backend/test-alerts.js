const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

async function testAlertFunctionalities() {
  console.log('🚨 Testing Alert Functionalities...\n');

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

    // 2. Get alert statistics
    console.log('2. Getting alert statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/alerts/stats`, { headers });
    console.log('✅ Alert stats:', {
      total: statsResponse.data.total,
      unread: statsResponse.data.unread,
      unresolved: statsResponse.data.unresolved
    });

    // 3. Get all alerts
    console.log('\n3. Getting all alerts...');
    const alertsResponse = await axios.get(`${BASE_URL}/alerts`, { headers });
    console.log(`✅ Found ${alertsResponse.data.alerts.length} alerts`);
    console.log('📄 Pagination:', alertsResponse.data.pagination);

    // 4. Create test alert
    console.log('\n4. Creating test alert...');
    const createResponse = await axios.post(`${BASE_URL}/alerts`, {
      type: 'SUSPICIOUS_PATTERN',
      severity: 'HIGH',
      title: 'Test Alert',
      description: 'This is a test alert created by automation'
    }, { headers });
    console.log('✅ Alert created:', createResponse.data.title);
    const testAlertId = createResponse.data.id;

    // 5. Get specific alert
    console.log('\n5. Getting specific alert...');
    const alertResponse = await axios.get(`${BASE_URL}/alerts/${testAlertId}`, { headers });
    console.log('✅ Alert details:', alertResponse.data.title);

    // 6. Mark alert as read
    console.log('\n6. Marking alert as read...');
    const readResponse = await axios.patch(`${BASE_URL}/alerts/${testAlertId}/read`, {}, { headers });
    console.log('✅ Alert marked as read:', readResponse.data.isRead);

    // 7. Mark alert as resolved
    console.log('\n7. Marking alert as resolved...');
    const resolveResponse = await axios.patch(`${BASE_URL}/alerts/${testAlertId}/resolve`, {}, { headers });
    console.log('✅ Alert resolved:', resolveResponse.data.isResolved);

    // 8. Test filtering
    console.log('\n8. Testing filters...');
    const filteredResponse = await axios.get(`${BASE_URL}/alerts?severity=HIGH&isRead=true`, { headers });
    console.log(`✅ Filtered alerts (HIGH severity, read): ${filteredResponse.data.alerts.length}`);

    // 9. Create multiple test alerts for bulk operations
    console.log('\n9. Creating multiple alerts for bulk test...');
    const bulkAlerts = [];
    for (let i = 0; i < 3; i++) {
      const alert = await axios.post(`${BASE_URL}/alerts`, {
        type: 'HIGH_RISK_TRANSACTION',
        severity: 'MEDIUM',
        title: `Bulk Test Alert ${i + 1}`,
        description: `Bulk test alert number ${i + 1}`
      }, { headers });
      bulkAlerts.push(alert.data.id);
    }
    console.log(`✅ Created ${bulkAlerts.length} alerts for bulk test`);

    // 10. Test bulk mark as read
    console.log('\n10. Testing bulk mark as read...');
    const bulkReadResponse = await axios.patch(`${BASE_URL}/alerts/bulk`, {
      alertIds: bulkAlerts,
      action: 'read'
    }, { headers });
    console.log('✅ Bulk read:', bulkReadResponse.data.message);

    // 11. Test mark all as read
    console.log('\n11. Testing mark all as read...');
    const allReadResponse = await axios.patch(`${BASE_URL}/alerts/read-all`, {}, { headers });
    console.log('✅ All read:', allReadResponse.data.message);

    // 12. Test bulk delete
    console.log('\n12. Testing bulk delete...');
    const bulkDeleteResponse = await axios.patch(`${BASE_URL}/alerts/bulk`, {
      alertIds: bulkAlerts,
      action: 'delete'
    }, { headers });
    console.log('✅ Bulk delete:', bulkDeleteResponse.data.message);

    // 13. Delete test alert
    console.log('\n13. Deleting test alert...');
    await axios.delete(`${BASE_URL}/alerts/${testAlertId}`, { headers });
    console.log('✅ Test alert deleted');

    // 14. Final statistics
    console.log('\n14. Final alert statistics...');
    const finalStatsResponse = await axios.get(`${BASE_URL}/alerts/stats`, { headers });
    console.log('✅ Final stats:', {
      total: finalStatsResponse.data.total,
      unread: finalStatsResponse.data.unread,
      unresolved: finalStatsResponse.data.unresolved
    });

    console.log('\n🎉 All alert functionalities tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAlertFunctionalities();