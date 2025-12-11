// Simple test to verify frontend can connect to backend
const axios = require('axios');

async function testFrontendLogin() {
  try {
    console.log('🧪 Testing frontend to backend connection...\n');

    const API_BASE_URL = 'http://localhost:5001/api/v1';
    
    // Test login with the working credentials
    const loginData = {
      email: 'test@example.com',
      password: 'test123'
    };

    console.log('📡 Sending login request to:', `${API_BASE_URL}/auth/login`);
    console.log('📄 Login data:', JSON.stringify(loginData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', JSON.stringify(response.data, null, 2));

    // Verify token structure
    if (response.data.data && response.data.data.accessToken) {
      console.log('\n🔑 Token verification:');
      console.log('- Access token length:', response.data.data.accessToken.length);
      console.log('- Refresh token length:', response.data.data.refreshToken.length);
      console.log('- User role:', response.data.data.role);
      console.log('- Is verified:', response.data.data.isVerified);
    }

  } catch (error) {
    console.error('❌ Login failed!');
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📋 Error data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      console.error('📡 Request details:', error.message);
    } else {
      console.error('⚠️ Request setup error:', error.message);
    }
  }
}

testFrontendLogin();