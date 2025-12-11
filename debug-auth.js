// Debug script to check authentication state
console.log("=== Authentication Debug ===");

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const roles = localStorage.getItem('roles');
  const user = localStorage.getItem('user');
  const loginSuccessful = localStorage.getItem('loginSuccessfull');

  console.log('Access Token:', accessToken ? `Present (${accessToken.substring(0, 20)}...)` : 'Missing');
  console.log('Refresh Token:', refreshToken ? `Present (${refreshToken.substring(0, 20)}...)` : 'Missing');
  console.log('Roles:', roles);
  console.log('User:', user);
  console.log('Login Successful Flag:', loginSuccessful);

  console.log('\nAuthentication Status:', (accessToken && refreshToken) ? '✅ Authenticated' : '❌ Not Authenticated');
} else {
  console.log('Running in Node.js environment or localStorage not available');
}
