# Admitad API Client

A TypeScript/JavaScript client for the Admitad API with built-in authentication and token management.

## Features

- 🔐 **Automatic Authentication**: Handles OAuth2 client credentials flow
- 🔄 **Token Management**: Automatic token expiration checking
- 📝 **TypeScript Support**: Full type definitions included
- 🛠 **Easy Configuration**: Environment variable support
- 🚀 **Modern API**: Promise-based with async/await support
- 🔧 **Flexible**: Works with Node.js, Bun, and modern browsers

## Installation

```bash
# Using npm
npm install admitad-api-client

# Using yarn
yarn add admitad-api-client

# Using pnpm
pnpm add admitad-api-client

# Using bun
bun add admitad-api-client
```

## Setup

### Environment Variables

Create a `.env` file in your project root:

```env
ADMITAD_CLIENT_ID=your_client_id_here
ADMITAD_CLIENT_SECRET=your_client_secret_here
# Optional: if you already have the base64 encoded auth header
ADMITAD_BASE64_AUTH=your_base64_encoded_auth_header_here
# Optional: custom API base URL (defaults to https://api.admitad.com)
ADMITAD_API_BASE_URL=https://api.admitad.com
```

### Getting Your Credentials

1. Log in to your Admitad publisher account
2. Navigate to your application settings
3. Click "Show credentials" to get your `client_id` and `client_secret`

## Usage

### Basic Usage

```typescript
import { createAdmitadClient } from 'admitad-api-client';

async function main() {
  // Create client using environment variables
  const client = createAdmitadClient();

  // Authenticate with required scopes
  await client.authenticate(['advcampaigns', 'banners', 'websites']);

  // Make API requests
  const campaigns = await client.request('/advcampaigns/');
  console.log(campaigns);
}
```

### Manual Configuration

```typescript
import { AdmitadApiClient } from 'admitad-api-client';

const client = new AdmitadApiClient({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  baseUrl: 'https://api.admitad.com' // optional
});

await client.authenticate(['advcampaigns']);
```

### Using Pre-encoded Base64 Auth

If you already have the base64-encoded authorization header:

```typescript
import { createAdmitadClient } from 'admitad-api-client';

const client = createAdmitadClient({
  clientId: 'your_client_id',
  base64Auth: 'your_base64_encoded_credentials'
});
```

## API Reference

### AdmitadApiClient

#### Methods

##### `authenticate(scopes: AdmitadScope[]): Promise<AdmitadTokenResponse>`

Authenticates with the Admitad API and stores the access token.

**Parameters:**
- `scopes`: Array of permission scopes to request

**Available Scopes:**
- `'advcampaigns'` - Access to advertising campaigns
- `'banners'` - Access to banners
- `'websites'` - Access to websites
- `'statistics'` - Access to statistics
- `'manage_websites'` - Manage websites
- `'manage_advcampaigns'` - Manage advertising campaigns
- `'aliexpress_commission'` - Access to AliExpress commission rates

##### `request<T>(endpoint: string, options?: AdmitadRequestOptions): Promise<T>`

Makes an authenticated request to the Admitad API.

**Parameters:**
- `endpoint`: API endpoint path (e.g., '/advcampaigns/')
- `options`: Request options (method, headers, body, params)

##### `isAuthenticated(): boolean`

Checks if the client has a valid, non-expired access token.

##### `getAccessToken(): string | null`

Returns the current access token.

##### `getRefreshToken(): string | null`

Returns the current refresh token.

##### `logout(): void`

Clears all stored authentication data.

##### `getAliExpressCommissionRates(urls: string[]): Promise<AliExpressCommissionResponse>`

Gets commission rates for AliExpress products.

**Parameters:**
- `urls`: Array of AliExpress product URLs to check commission rates for

**Returns:**
- Promise resolving to commission rates data including product names, commission rates, hot product status, etc.

### Factory Functions

#### `createAdmitadClient(customConfig?: Partial<AdmitadClientConfig>): AdmitadApiClient`

Creates a client using environment variables with optional overrides.

#### `createAdmitadClientWithConfig(config: AdmitadClientConfig): AdmitadApiClient`

Creates a client with explicit configuration.

### Utility Functions

#### `encodeCredentials(clientId: string, clientSecret: string): string`

Encodes client credentials to base64 for HTTP Basic authentication.

#### `createAuthHeader(base64Credentials: string): string`

Creates the Authorization header value for HTTP Basic authentication.

## Examples

### Making Different Types of Requests

```typescript
// GET request with query parameters
const campaigns = await client.request('/advcampaigns/', {
  params: {
    limit: 10,
    offset: 0
  }
});

// POST request with body
const newWebsite = await client.request('/websites/', {
  method: 'POST',
  body: {
    name: 'My Website',
    url: 'https://example.com'
  }
});

// Custom headers
const data = await client.request('/some-endpoint/', {
  headers: {
    'Custom-Header': 'value'
  }
});
```

### AliExpress Commission Rates

```typescript
// Authenticate with AliExpress commission scope
await client.authenticate(['aliexpress_commission']);

// Check commission rates for AliExpress products
const productUrls = [
  'https://aliexpress.com/item/123456789.html',
  'https://fas.st/shortlink'
];

const commissionData = await client.getAliExpressCommissionRates(productUrls);

commissionData.commission_rates.forEach(rate => {
  console.log(`Product: ${rate.product_name}`);
  console.log(`Commission: ${rate.commission_rate}%`);
  console.log(`Hot Product: ${rate.is_hot}`);
  if (rate.is_hot) {
    console.log(`Hot Commission: ${rate.hot_commission_rate}%`);
  }
});
```

### Error Handling

```typescript
try {
  await client.authenticate(['advcampaigns']);
  const data = await client.request('/advcampaigns/');
} catch (error) {
  if (error.message.includes('Authentication failed')) {
    console.error('Invalid credentials');
  } else {
    console.error('API request failed:', error.message);
  }
}
```

### Token Management

```typescript
// Check if authenticated before making requests
if (!client.isAuthenticated()) {
  await client.authenticate(['advcampaigns']);
}

// The client automatically checks token expiration before requests
// No need to manually refresh tokens
```

## Running Examples

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your actual credentials
# Then run the examples
bun run example                    # Basic usage example
bun run example:aliexpress        # AliExpress commission rates example
```

## API Documentation

For complete API documentation, visit: [Admitad Developers Documentation](https://developers.admitad.com/knowledge-base/article/client-authorization_2)

## License

MIT
