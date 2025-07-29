import { scoreMLSProperties } from './mls-score';

export default defineEventHandler(async (event) => {
  const API_KEY = '3283b3d126616f16424f1f1f0bc722e66e1af416';
  const API_URL = 'https://api-demo.mlsgrid.com/v2';
  
  try {
    // Fetch MLS properties from the MLS Grid API
    const response = await $fetch<any>(`${API_URL}/Property`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Api-Version': '2.0',
        'Content-Type': 'application/json'
      },
      params: {
        // MLS Grid API parameters - get all properties first to see what's available
        $top: 50 // Get more properties to see what's available
      }
    });

    console.log('MLS Grid API Response:', response);
    console.log('Number of properties returned:', response.value?.length || 0);
    console.log('First property sample:', response.value?.[0] || 'No properties found');

    // Filter for residential properties with buildings
    const residentialProperties = response.value.filter((prop: any) => 
      prop.PropertyType === 'Residential' && 
      prop.BedroomsTotal > 0 && 
      prop.LivingArea > 0
    );
    
    console.log('Residential properties with buildings:', residentialProperties.length);

    // Transform the MLS Grid API response to match our scoring interface
    const properties = residentialProperties.map((mlsProperty: any) => {
      // Calculate proximity to Bellingham (approximate coordinates)
      const bellinghamLat = 48.7519;
      const bellinghamLng = -122.4787;
      const propertyLat = mlsProperty.Latitude || 0;
      const propertyLng = mlsProperty.Longitude || 0;
      
      // Simple distance calculation (rough approximation)
      const proximity = propertyLat && propertyLng ? 
        Math.sqrt(Math.pow(propertyLat - bellinghamLat, 2) + Math.pow(propertyLng - bellinghamLng, 2)) * 69 : 5.0;
      
      // Check if utilities are stubbed (simplified logic)
      const utilities = mlsProperty.Utilities || [];
      const utilitiesStubbed = utilities.some((util: string) => 
        util.toLowerCase().includes('electric') || util.toLowerCase().includes('water') || util.toLowerCase().includes('septic')
      );
      
      // Get the best available address
      const address = mlsProperty.UnparsedAddress || 
                     mlsProperty.PropertyAddress?.OneLine || 
                     `${mlsProperty.StreetNumber || ''} ${mlsProperty.StreetName || ''}, ${mlsProperty.City || ''}, ${mlsProperty.StateOrProvince || ''}`;
      
      return {
        lotSize: parseFloat(mlsProperty.LotSizeAcres) || 0,
        bedrooms: parseInt(mlsProperty.BedroomsTotal) || 0,
        bathrooms: parseFloat(mlsProperty.BathroomsTotalInteger) || 0,
        price: parseFloat(mlsProperty.ListPrice) || 0,
        utilitiesStubbed: utilitiesStubbed,
        zoning: 'Residential', // Default to residential for now
        proximity: proximity,
        address: address,
        mlsId: mlsProperty.ListingKey,
        listingDate: mlsProperty.ListingContractDate,
        propertyType: mlsProperty.PropertyType,
        propertySubType: mlsProperty.PropertySubType,
        squareFootage: mlsProperty.LivingArea || 0,
        // Additional MLS Grid specific fields
        media: mlsProperty.Media || [],
        status: mlsProperty.StandardStatus,
        latitude: mlsProperty.Latitude,
        longitude: mlsProperty.Longitude,
        originalData: mlsProperty // Keep original data for reference
      };
    });

    // Score the properties
    const scoredProperties = scoreMLSProperties(properties);

    return {
      success: true,
      properties: scoredProperties,
      total: scoredProperties.length,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching MLS properties:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      properties: [],
      total: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}); 