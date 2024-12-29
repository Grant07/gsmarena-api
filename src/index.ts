import { GSMArenaAPI } from './gsmarena-api';

async function main() {
  const api = new GSMArenaAPI();

  try {
    // Search for phones
    const searchResults = await api.searchPhones('Google Pixel 7', { limit: 5 });
    console.log('Search Results:', JSON.stringify(searchResults, null, 2));

    // Get details for the first result
    if (searchResults.length > 0) {
      const details = await api.getPhoneDetails(searchResults[0].slug);
      console.log('Phone Details:', JSON.stringify(details, null, 2));
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

main();