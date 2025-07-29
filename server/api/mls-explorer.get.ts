export default defineEventHandler(async (event) => {
  const API_KEY = '3283b3d126616f16424f1f1f0bc722e66e1af416';
  const API_URL = 'https://api-demo.mlsgrid.com/v2';
  
  try {
    // Get a sample of properties to explore the data structure
    const response = await $fetch<any>(`${API_URL}/Property`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Api-Version': '2.0',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      params: {
        $top: 10
      }
    });

    // Get all available fields from the first property
    const firstProperty = response.value[0];
    const allFields = firstProperty ? Object.keys(firstProperty) : [];
    
    // Get sample properties with key fields
    const sampleProperties = response.value.slice(0, 5).map((prop: any) => ({
      listingKey: prop.ListingKey,
      address: prop.UnparsedAddress || 'No address',
      propertyType: prop.PropertyType,
      propertySubType: prop.PropertySubType,
      listPrice: prop.ListPrice,
      bedrooms: prop.BedroomsTotal,
      bathrooms: prop.BathroomsTotalInteger,
      lotSize: prop.LotSizeAcres,
      livingArea: prop.LivingArea,
      status: prop.StandardStatus,
      city: prop.City,
      state: prop.StateOrProvince,
      utilities: prop.Utilities,
      latitude: prop.Latitude,
      longitude: prop.Longitude,
      listingDate: prop.ListingContractDate,
      closeDate: prop.CloseDate,
      closePrice: prop.ClosePrice
    }));

    return {
      success: true,
      totalProperties: response.value.length,
      hasMoreData: !!response['@odata.nextLink'],
      allAvailableFields: allFields,
      sampleProperties: sampleProperties,
      rawSample: firstProperty ? {
        listingKey: firstProperty.ListingKey,
        address: firstProperty.UnparsedAddress,
        propertyType: firstProperty.PropertyType,
        listPrice: firstProperty.ListPrice,
        bedrooms: firstProperty.BedroomsTotal,
        bathrooms: firstProperty.BathroomsTotalInteger,
        lotSize: firstProperty.LotSizeAcres,
        livingArea: firstProperty.LivingArea,
        status: firstProperty.StandardStatus,
        utilities: firstProperty.Utilities,
        // Include a few more key fields
        appliances: firstProperty.Appliances,
        architecturalStyle: firstProperty.ArchitecturalStyle,
        exteriorFeatures: firstProperty.ExteriorFeatures,
        interiorFeatures: firstProperty.InteriorFeatures,
        lotFeatures: firstProperty.LotFeatures,
        view: firstProperty.View,
        waterfrontYN: firstProperty.WaterfrontYN,
        yearBuilt: firstProperty.YearBuilt,
        zoningDescription: firstProperty.ZoningDescription
      } : null
    };

  } catch (error) {
    console.error('Error exploring MLS data:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      note: 'This endpoint helps explore the MLS Grid API data structure'
    };
  }
}); 