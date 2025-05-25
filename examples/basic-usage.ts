import { createAdmitadClient, type AdmitadScope } from '../index.js';

async function main() {
  try {
    // Create client using environment variables
    const client = createAdmitadClient();

    // Define scopes you need access to
    const scopes: AdmitadScope[] = ['advcampaigns', 'banners', 'websites'];

    // Authenticate with Admitad API
    console.log('Authenticating with Admitad API...');
    const tokenResponse = await client.authenticate(scopes);
    console.log('Authentication successful!');
    console.log('User:', tokenResponse.username);
    console.log('Token expires in:', tokenResponse.expires_in, 'seconds');

    // Check if authenticated
    console.log('Is authenticated:', client.isAuthenticated());

    // Example API request (replace with actual endpoint)
    try {
      // This is just an example - replace with actual Admitad API endpoints
      const campaigns = await client.request('/advcampaigns/');
      console.log('Campaigns:', campaigns);
    } catch (error) {
      console.log('API request failed (this is expected if endpoint doesn\'t exist):', error);
    }

    // Get current tokens
    console.log('Access token:', client.getAccessToken()?.substring(0, 10) + '...');
    console.log('Refresh token:', client.getRefreshToken()?.substring(0, 10) + '...');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
if (import.meta.main) {
  main();
} 