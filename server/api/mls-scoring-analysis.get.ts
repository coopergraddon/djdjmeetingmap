import { scoreMLSProperties } from './mls-score';

export default defineEventHandler(async (event) => {
  // SECURITY: This endpoint is for internal analysis only
  // It should not be exposed to clients in production
  
  // Check for internal access only (server-side only)
  const userAgent = getHeader(event, 'user-agent') || '';
  const referer = getHeader(event, 'referer') || '';
  
  // Block direct client access
  if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      data: {
        message: 'This endpoint is for internal use only'
      }
    });
  }
  
  // Additional security: Check for server-side context
  if (process.client) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      data: {
        message: 'Server-side access only'
      }
    });
  }
  
  try {
    // Fetch MLS properties (reuse the same logic)
    const API_KEY = '3283b3d126616f16424f1f1f0bc722e66e1af416';
    const API_URL = 'https://api-demo.mlsgrid.com/v2';
    
    const response = await $fetch<any>(`${API_URL}/Property`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Api-Version': '2.0',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      params: {
        $top: 50
      }
    });

    // Filter for residential properties with buildings
    const residentialProperties = response.value.filter((prop: any) =>
      prop.PropertyType === 'Residential' &&
      prop.BedroomsTotal > 0 &&
      prop.LivingArea > 0
    );

    const properties = residentialProperties.map((mlsProperty: any) => {
      const bellinghamLat = 48.7519;
      const bellinghamLng = -122.4787;
      const propertyLat = mlsProperty.Latitude || 0;
      const propertyLng = mlsProperty.Longitude || 0;
      
      const proximity = propertyLat && propertyLng ? 
        Math.sqrt(Math.pow(propertyLat - bellinghamLat, 2) + Math.pow(propertyLng - bellinghamLng, 2)) * 69 : 5.0;
      
      const utilities = mlsProperty.Utilities || [];
      const utilitiesStubbed = utilities.some((util: string) => 
        util.toLowerCase().includes('electric') || util.toLowerCase().includes('water') || util.toLowerCase().includes('septic')
      );
      
      const address = mlsProperty.UnparsedAddress || 
                     mlsProperty.PropertyAddress?.OneLine || 
                     `${mlsProperty.StreetNumber || ''} ${mlsProperty.StreetName || ''}, ${mlsProperty.City || ''}, ${mlsProperty.StateOrProvince || ''}`;
      
      return {
        lotSize: parseFloat(mlsProperty.LotSizeAcres) || 0,
        bedrooms: parseInt(mlsProperty.BedroomsTotal) || 0,
        bathrooms: parseFloat(mlsProperty.BathroomsTotalInteger) || 0,
        price: parseFloat(mlsProperty.ListPrice) || 0,
        utilitiesStubbed: utilitiesStubbed,
        zoning: 'Residential',
        proximity: proximity,
        address: address,
        mlsId: mlsProperty.ListingKey,
        listingDate: mlsProperty.ListingContractDate,
        propertyType: mlsProperty.PropertyType,
        propertySubType: mlsProperty.PropertySubType,
        squareFootage: mlsProperty.LivingArea || 0,
        media: mlsProperty.Media || [],
        status: mlsProperty.StandardStatus,
        latitude: mlsProperty.Latitude,
        longitude: mlsProperty.Longitude
      };
    });

    // Score the properties with full breakdown (for internal analysis)
    const scoredProperties = scoreMLSProperties(properties);

    // Return detailed analysis including scoring breakdown
    return {
      success: true,
      analysis: {
        totalProperties: scoredProperties.length,
        averageScore: scoredProperties.reduce((sum, p) => sum + p.score, 0) / scoredProperties.length,
        scoreDistribution: {
          excellent: scoredProperties.filter(p => p.score >= 80).length,
          good: scoredProperties.filter(p => p.score >= 60 && p.score < 80).length,
          fair: scoredProperties.filter(p => p.score >= 40 && p.score < 60).length,
          poor: scoredProperties.filter(p => p.score < 40).length
        },
        topProperties: scoredProperties
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map(p => ({
            address: p.address,
            score: p.score,
            scoreBreakdown: p.scoreBreakdown,
            price: p.price,
            lotSize: p.lotSize,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms
          }))
      },
      properties: scoredProperties, // Full data including breakdown
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in MLS scoring analysis:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      analysis: null,
      properties: [],
      lastUpdated: new Date().toISOString()
    };
  }
}); 