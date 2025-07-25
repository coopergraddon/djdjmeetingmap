// Placeholder for MLS property scoring logic
// This will be used for the upcoming MLS integration

/**
 * Scores a property based on lot size, number of bedrooms/bathrooms, and listing price.
 * Higher score = better value relative to price.
 *
 * @param {number} lotSize - Lot size in square feet
 * @param {number} bedrooms - Number of bedrooms
 * @param {number} bathrooms - Number of bathrooms
 * @param {number} price - Listing price in dollars
 * @returns {number} score
 */
export function scoreMLSProperty({ lotSize, bedrooms, bathrooms, price }: {
  lotSize: number,
  bedrooms: number,
  bathrooms: number,
  price: number
}): number {
  // Simple scoring formula (to be refined with real data):
  // Give weight to lot size, bedrooms, bathrooms, and penalize high price
  if (!price || price <= 0) return 0;
  const sizeScore = lotSize / 1000; // 1 point per 1000 sqft
  const bedScore = bedrooms * 2;    // 2 points per bedroom
  const bathScore = bathrooms * 1.5; // 1.5 points per bathroom
  const valueScore = (sizeScore + bedScore + bathScore) / (price / 100000); // Normalize by price
  return Math.round(valueScore * 100) / 100; // Round to 2 decimals
}

/**
 * Given an array of MLS properties, returns a new array with a detailed 'scoreBreakdown' for each property.
 * The score is relative to the min/max values in the set, rewarding more land, beds, baths, lower price, utilities stubbed, zoning, and proximity.
 * @param {Array} properties - Array of MLS property objects with lotSize, bedrooms, bathrooms, price, utilitiesStubbed, zoning, proximity
 * @returns {Array} - Array of properties with added 'score', 'scoreBreakdown' fields
 */
export function scoreMLSProperties(properties: Array<{
  lotSize: number,
  bedrooms: number,
  bathrooms: number,
  price: number,
  utilitiesStubbed?: boolean,
  zoning?: string, // e.g. 'Residential', 'Commercial', etc.
  proximity?: number // e.g. distance to city center in miles
}>): Array<any> {
  if (!properties.length) return [];
  // Find min/max for normalization
  const lotSizes = properties.map(p => p.lotSize || 0);
  const bedrooms = properties.map(p => p.bedrooms || 0);
  const bathrooms = properties.map(p => p.bathrooms || 0);
  const prices = properties.map(p => p.price || 0);
  const proximities = properties.map(p => typeof p.proximity === 'number' ? p.proximity : Infinity);
  const minLot = Math.min(...lotSizes), maxLot = Math.max(...lotSizes);
  const minBed = Math.min(...bedrooms), maxBed = Math.max(...bedrooms);
  const minBath = Math.min(...bathrooms), maxBath = Math.max(...bathrooms);
  const minPrice = Math.min(...prices.filter(p => p > 0)), maxPrice = Math.max(...prices);
  const minProx = Math.min(...proximities), maxProx = Math.max(...proximities);

  // Avoid divide by zero
  const norm = (val: number, min: number, max: number): number => max > min ? (val - min) / (max - min) : 0;

  // Zoning weights (placeholder, to be refined)
  const zoningWeights: Record<string, number> = {
    'Residential': 1,
    'Commercial': 0.7,
    'Mixed': 0.85,
    'Agricultural': 0.9,
    'Other': 0.5
  };

  // Score each property
  return properties.map(p => {
    // Normalize each attribute (0-1)
    const lotScore = norm(p.lotSize || 0, minLot, maxLot);
    const bedScore = norm(p.bedrooms || 0, minBed, maxBed);
    const bathScore = norm(p.bathrooms || 0, minBath, maxBath);
    const priceScore = 1 - norm(p.price || 0, minPrice, maxPrice); // Lower price is better
    const utilitiesBonus = p.utilitiesStubbed ? 1 : 0; // 1 = full bonus, 0 = none
    // Zoning: use weight if known, else 0.5
    const zoningScore = p.zoning ? (zoningWeights[p.zoning] ?? 0.5) : 0.5;
    // Proximity: closer is better (normalize and invert)
    const proximityScore = (typeof p.proximity === 'number' && isFinite(p.proximity)) ? 1 - norm(p.proximity, minProx, maxProx) : 0.5;

    // Weights for each criterion (should total 1.0)
    const weights = {
      lot: 0.22,
      bedrooms: 0.16,
      bathrooms: 0.13,
      price: 0.15,
      utilities: 0.12,
      zoning: 0.12,
      proximity: 0.10
    };

    // Weighted sum
    const raw = (
      lotScore * weights.lot +
      bedScore * weights.bedrooms +
      bathScore * weights.bathrooms +
      priceScore * weights.price +
      utilitiesBonus * weights.utilities +
      zoningScore * weights.zoning +
      proximityScore * weights.proximity
    );
    // Scale to 0-100
    const score = Math.round(Math.min(raw, 1) * 100);
    // Itemized breakdown
    const scoreBreakdown = {
      lotScore: { value: lotScore, weight: weights.lot },
      bedScore: { value: bedScore, weight: weights.bedrooms },
      bathScore: { value: bathScore, weight: weights.bathrooms },
      priceScore: { value: priceScore, weight: weights.price },
      utilitiesBonus: { value: utilitiesBonus, weight: weights.utilities },
      zoningScore: { value: zoningScore, weight: weights.zoning },
      proximityScore: { value: proximityScore, weight: weights.proximity }
    };
    return { ...p, score, scoreBreakdown };
  });
}

// Usage (future):
// const scored = scoreMLSProperties(mlsDataFromApi);
// scored.forEach(p => console.log(p.address, p.score, p.scoreBreakdown)); 