# Publishing Guide

This guide explains how to publish the `admitad-api-client` package to npm and use it in other projects.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Make sure you have npm installed and are logged in:
   ```bash
   npm login
   ```

## Publishing to npm

### 1. Update package information

Before publishing, update the following in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/admitad-api-client.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/admitad-api-client/issues"
  },
  "homepage": "https://github.com/yourusername/admitad-api-client#readme"
}
```

### 2. Build the package

```bash
npm run build
```

### 3. Test the package locally

```bash
# Pack the package to see what will be published
npm pack

# This creates a .tgz file you can inspect
```

### 4. Publish to npm

```bash
# For first-time publishing
npm publish

# For subsequent versions, update version first
npm version patch  # or minor, major
npm publish
```

### 5. Verify publication

Visit `https://www.npmjs.com/package/admitad-api-client` to see your published package.

## Using in Other Projects

### Installation

```bash
npm install admitad-api-client
```

### Basic Usage

```typescript
// ESM (recommended)
import { createAdmitadClient } from 'admitad-api-client';

// CommonJS (if needed)
const { createAdmitadClient } = require('admitad-api-client');
```

### Environment Setup

Create a `.env` file in your project:

```env
ADMITAD_CLIENT_ID=your_client_id
ADMITAD_CLIENT_SECRET=your_client_secret
```

### Example Usage

```typescript
import { createAdmitadClient } from 'admitad-api-client';

async function main() {
  const client = createAdmitadClient();
  
  // Authenticate
  await client.authenticate(['advcampaigns', 'aliexpress_commission']);
  
  // Use the API
  const campaigns = await client.request('/advcampaigns/');
  console.log(campaigns);
  
  // Check AliExpress commission rates
  const rates = await client.getAliExpressCommissionRates([
    'https://aliexpress.com/item/123456789.html'
  ]);
  console.log(rates);
}

main().catch(console.error);
```

## TypeScript Support

The package includes full TypeScript definitions. No additional `@types` packages needed.

```typescript
import type { 
  AdmitadApiClient, 
  AdmitadScope,
  AliExpressCommissionResponse 
} from 'admitad-api-client';
```

## Version Management

### Semantic Versioning

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Update versions

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

## Package Contents

When published, the package includes:

```
admitad-api-client/
├── dist/           # Compiled JavaScript and type definitions
├── README.md       # Documentation
├── LICENSE         # MIT license
└── package.json    # Package metadata
```

## Troubleshooting

### Common Issues

1. **Build errors**: Make sure TypeScript compiles without errors
   ```bash
   npm run build
   ```

2. **Import errors**: Ensure you're using the correct import syntax for your environment

3. **Authentication errors**: Verify your Admitad credentials are correct

### Getting Help

- Check the [README.md](./README.md) for detailed API documentation
- Open an issue on GitHub if you encounter problems
- Review the examples in the repository

## Development Workflow

For contributors:

```bash
# Clone and setup
git clone https://github.com/yourusername/admitad-api-client.git
cd admitad-api-client
npm install

# Development
npm run build:watch    # Watch mode for development
npm run test          # Run tests
npm run example       # Run examples

# Before publishing
npm run clean         # Clean dist folder
npm run build         # Build for production
npm publish           # Publish to npm
``` 