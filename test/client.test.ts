import { AdmitadApiClient, encodeCredentials, createAuthHeader } from '../index.js';

// Test utility functions
console.log('Testing utility functions...');

const testClientId = 'test_client_id';
const testClientSecret = 'test_client_secret';

const encoded = encodeCredentials(testClientId, testClientSecret);
console.log('✓ Encoded credentials:', encoded);

const authHeader = createAuthHeader(encoded);
console.log('✓ Auth header:', authHeader);

// Test client instantiation
console.log('\nTesting client instantiation...');

try {
  const client = new AdmitadApiClient({
    clientId: testClientId,
    clientSecret: testClientSecret
  });
  
  console.log('✓ Client created successfully');
  console.log('✓ Is authenticated (should be false):', client.isAuthenticated());
  console.log('✓ Access token (should be null):', client.getAccessToken());
  console.log('✓ AliExpress method exists:', typeof client.getAliExpressCommissionRates === 'function');
  
} catch (error) {
  console.error('✗ Client creation failed:', error);
}

console.log('\nAll tests completed!'); 