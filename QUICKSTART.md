# Quick Start Guide

Get up and running with the Admitad API client in 5 minutes.

## 1. Set up your environment

Copy the example environment file and add your credentials:

```bash
cp env.example .env
```

Edit `.env` with your Admitad credentials:

```env
ADMITAD_CLIENT_ID=your_actual_client_id
ADMITAD_CLIENT_SECRET=your_actual_client_secret
```

## 2. Basic usage

Create a simple script:

```typescript
import { createAdmitadClient } from './index.js';

async function main() {
  // Create and authenticate client
  const client = createAdmitadClient();
  await client.authenticate(['advcampaigns', 'websites']);
  
  // Make your first API call
  const campaigns = await client.request('/advcampaigns/');
  console.log('Your campaigns:', campaigns);
}

main().catch(console.error);
```

## 3. Run the examples

```bash
bun run example                    # Basic usage
bun run example:aliexpress        # AliExpress commission rates
bun run example:links             # URL shortener and deeplinks
```

## 4. Available scopes

Choose the scopes you need for your application:

- `advcampaigns` - Access advertising campaigns
- `banners` - Access banners and creatives  
- `websites` - Access website information
- `statistics` - Access statistics data
- `manage_websites` - Manage websites
- `manage_advcampaigns` - Manage campaigns
- `aliexpress_commission` - Access AliExpress commission rates
- `short_link` - Access URL shortener service
- `deeplink_generator` - Access deeplink generator

## 5. Common API endpoints

Based on the [Admitad API documentation](https://developers.admitad.com/knowledge-base/article/client-authorization_2):

```typescript
// Get campaigns
const campaigns = await client.request('/advcampaigns/');

// Get websites  
const websites = await client.request('/websites/');

// Get banners
const banners = await client.request('/banners/');

// Get statistics (with parameters)
const stats = await client.request('/statistics/', {
  params: {
    date_start: '2024-01-01',
    date_end: '2024-01-31'
  }
});

// Check AliExpress commission rates
await client.authenticate(['aliexpress_commission']);
const commissionRates = await client.getAliExpressCommissionRates([
  'https://aliexpress.com/item/123456789.html'
]);

// Shorten URLs
await client.authenticate(['short_link']);
const shortUrl = await client.shortenUrl('http://ad.admitad.com/g/longurl/');

// Generate deeplinks
await client.authenticate(['deeplink_generator']);
const deeplinks = await client.generateDeeplinks('websiteId', 'campaignId', {
  subid: 'test',
  ulp: 'http://example.com/product'
});
```

## Need help?

- Check the full [README.md](./README.md) for detailed documentation
- Run `bun test` to verify your setup
- Visit [Admitad Developers](https://developers.admitad.com/) for API documentation 