import { createAdmitadClient } from '../index.js';

async function main() {
  try {
    // Create client using environment variables
    const client = createAdmitadClient();

    // Authenticate with AliExpress commission scope
    console.log('Authenticating with Admitad API...');
    await client.authenticate(['aliexpress_commission']);
    console.log('Authentication successful!');

    // Example AliExpress product URLs from the documentation
    const productUrls = [
      'https://aliexpress.ru/item/1005009062242176.html',
    ];

    console.log('Checking commission rates for AliExpress products...');
    const commissionData = await client.getAliExpressCommissionRates(productUrls);

    console.log('\nCommission rates results:', commissionData);
    commissionData.commission_rates.forEach((rate, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log(`  URL: ${rate.url}`);
      console.log(`  Product Name: ${rate.product_name || 'N/A'}`);
      console.log(`  Commission Rate: ${rate.commission_rate ? rate.commission_rate + '%' : 'N/A'}`);
      console.log(`  Hot Commission Rate: ${rate.hot_commission_rate ? rate.hot_commission_rate + '%' : 'N/A'}`);
      console.log(`  Is Hot Product: ${rate.is_hot ? 'Yes' : 'No'}`);
    });

    // Example: Filter only hot products
    const hotProducts = commissionData.commission_rates.filter(rate => rate.is_hot);
    console.log(`\nFound ${hotProducts.length} hot products with higher commission rates!`);

    // Example: Get the highest commission rate
    const validRates = commissionData.commission_rates.filter(rate => rate.commission_rate !== null);
    if (validRates.length > 0) {
      const maxRate = Math.max(...validRates.map(rate => rate.commission_rate!));
      console.log(`Highest commission rate: ${maxRate}%`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
if (import.meta.main) {
  main();
} 