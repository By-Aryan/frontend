const axios = require('axios');

// Load environment variables
require('dotenv').config();

async function testFrontendConnection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://147.93.98.24:5001/api/v1';
  
  console.log('Testing frontend to backend connection...');
  console.log('API URL:', apiUrl);
  
  try {
    // Test the endpoints that are failing
    console.log('\n1. Testing property types count...');
    const propertyTypesResponse = await axios.get(`${apiUrl}/property/property-types-count`);
    console.log('✅ Property types count:', propertyTypesResponse.data);
    
    console.log('\n2. Testing login endpoint...');
    try {
      const loginResponse = await axios.post(`${apiUrl}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    } catch (loginError) {
      if (loginError.response?.status === 400 || loginError.response?.status === 401) {
        console.log('✅ Login endpoint is accessible (returned expected error)');
      } else {
        console.log('❌ Login endpoint error:', loginError.message);
      }
    }
    
    console.log('\n3. Testing health endpoint...');
    const healthResponse = await axios.get(`${apiUrl.replace('/api/v1', '')}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
  } catch (error) {
    console.error('❌ Connection failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testFrontendConnection();