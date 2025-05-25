import { createAdmitadClient } from '../index.js';

async function main() {
  try {
    // Create client using environment variables
    const client = createAdmitadClient();

    // Authenticate with required scopes
    console.log('Authenticating with Admitad API...');
    await client.authenticate(['short_link', 'deeplink_generator']);
    console.log('Authentication successful!');

    // Example 1: URL Shortener
    console.log('\n=== URL Shortener Example ===');
    
    const longUrl = 'http://ad.admitad.com/g/4657cb709efb21a781aacd1ff8c49e/';
    console.log('Original URL:', longUrl);
    
    try {
      const shortenerResult = await client.shortenUrl(longUrl);
      console.log('Shortened URL:', shortenerResult.short_link);
    } catch (error) {
      console.log('URL shortener failed (this is expected if URL is not valid):', error);
    }

    // Example 2: Deeplink Generator
    console.log('\n=== Deeplink Generator Example ===');
    
    const websiteId = '232236'; // Replace with your actual website ID
    const campaignId = '234433'; // Replace with your actual campaign ID
    
    const deeplinkParams = {
      subid: 'Reebok',
      subid1: 'white_sneakers',
      subid2: '40sale',
      ulp: [
        'http://admitad.com/post/250618/',
        'http://admitad.com/post/220658/'
      ]
    };

    console.log('Generating deeplinks for:');
    console.log('  Website ID:', websiteId);
    console.log('  Campaign ID:', campaignId);
    console.log('  Parameters:', deeplinkParams);

    try {
      const deeplinks = await client.generateDeeplinks(websiteId, campaignId, deeplinkParams);
      
      console.log('\nGenerated deeplinks:');
      deeplinks.forEach((deeplink, index) => {
        console.log(`\nDeeplink ${index + 1}:`);
        console.log(`  URL: ${deeplink.link}`);
        console.log(`  Is Affiliate Product: ${deeplink.is_affiliate_product}`);
      });

      // Example: Filter only affiliate products
      const affiliateLinks = deeplinks.filter(link => link.is_affiliate_product === true);
      console.log(`\nFound ${affiliateLinks.length} affiliate product links!`);

    } catch (error) {
      console.log('Deeplink generation failed (this is expected if IDs are not valid):', error);
    }

    // Example 3: Single URL deeplink
    console.log('\n=== Single URL Deeplink Example ===');
    
    try {
      const singleDeeplink = await client.generateDeeplinks(websiteId, campaignId, {
        subid: 'test',
        ulp: 'http://example.com/product'
      });
      
      console.log('Single deeplink generated:', singleDeeplink[0]?.link);
    } catch (error) {
      console.log('Single deeplink generation failed:', error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
if (import.meta.main) {
  main();
} 