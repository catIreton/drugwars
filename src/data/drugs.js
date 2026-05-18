/**
 * Drug market data for Drug Wars: KC Edition
 * Each location has different prices and availability for drugs
 */

export const DRUGS = [
  {
    id: 'weed',
    name: 'Weed',
    emoji: '🌿',
    color: '#16a34a',
    basePrice: 200,
    risk: 1,
    description: 'Cannabis - low risk, steady demand',
  },
  {
    id: 'speed',
    name: 'Speed',
    emoji: '⚡',
    color: '#2563eb',
    basePrice: 300,
    risk: 2,
    description: 'Amphetamines - moderate risk, good profit',
  },
  {
    id: 'heroin',
    name: 'Heroin',
    emoji: '💉',
    color: '#dc2626',
    basePrice: 500,
    risk: 4,
    description: 'High risk, high reward - addictive',
  },
  {
    id: 'cocaine',
    name: 'Cocaine',
    emoji: '❄️',
    color: '#64748b',
    basePrice: 1500,
    risk: 3,
    description: 'Premium drug - high prices in right places',
  },
  {
    id: 'lsd',
    name: 'LSD',
    emoji: '🔮',
    color: '#9333ea',
    basePrice: 800,
    risk: 2,
    description: 'Acid - specialty item, university markets',
  },
  {
    id: 'opium',
    name: 'Opium',
    emoji: '🌺',
    color: '#be123c',
    basePrice: 2500,
    risk: 5,
    description: 'Extreme risk, extreme profit potential',
  },
];

/**
 * Market prices by location - adjusts base price by location-specific multipliers
 * Each location has price multipliers for each drug type
 */
export const LOCATION_MARKETS = {
  'Northtown': {
    specialty: 'Street goods, weed',
    heatLevel: 'Very Hot',
    drugs: {
      weed: { buyMultiplier: 0.8, sellMultiplier: 1.2, qty: 50 },
      speed: { buyMultiplier: 0.9, sellMultiplier: 1.1, qty: 20 },
      heroin: { buyMultiplier: 1.0, sellMultiplier: 1.0, qty: 10 },
      cocaine: { buyMultiplier: 1.5, sellMultiplier: 0.8, qty: 5 },
      lsd: { buyMultiplier: 1.1, sellMultiplier: 0.9, qty: 5 },
      opium: { buyMultiplier: 2.0, sellMultiplier: 0.5, qty: 2 },
    },
  },
  'Plaza': {
    specialty: 'High-end market',
    heatLevel: 'Hot',
    drugs: {
      weed: { buyMultiplier: 1.5, sellMultiplier: 0.8, qty: 20 },
      speed: { buyMultiplier: 1.3, sellMultiplier: 0.9, qty: 15 },
      heroin: { buyMultiplier: 1.2, sellMultiplier: 0.9, qty: 8 },
      cocaine: { buyMultiplier: 0.9, sellMultiplier: 1.3, qty: 30 },
      lsd: { buyMultiplier: 0.8, sellMultiplier: 1.3, qty: 25 },
      opium: { buyMultiplier: 1.5, sellMultiplier: 1.0, qty: 5 },
    },
  },
  'Downtown': {
    specialty: 'Business district',
    heatLevel: 'Hot',
    drugs: {
      weed: { buyMultiplier: 1.2, sellMultiplier: 0.9, qty: 25 },
      speed: { buyMultiplier: 1.0, sellMultiplier: 1.2, qty: 20 },
      heroin: { buyMultiplier: 1.1, sellMultiplier: 0.9, qty: 12 },
      cocaine: { buyMultiplier: 1.0, sellMultiplier: 1.2, qty: 25 },
      lsd: { buyMultiplier: 0.9, sellMultiplier: 1.1, qty: 20 },
      opium: { buyMultiplier: 1.8, sellMultiplier: 0.7, qty: 3 },
    },
  },
  'Westport': {
    specialty: 'Party scene',
    heatLevel: 'Moderate',
    drugs: {
      weed: { buyMultiplier: 1.0, sellMultiplier: 1.1, qty: 40 },
      speed: { buyMultiplier: 0.8, sellMultiplier: 1.3, qty: 30 },
      heroin: { buyMultiplier: 1.3, sellMultiplier: 0.8, qty: 8 },
      cocaine: { buyMultiplier: 1.1, sellMultiplier: 1.1, qty: 20 },
      lsd: { buyMultiplier: 0.7, sellMultiplier: 1.4, qty: 35 },
      opium: { buyMultiplier: 2.2, sellMultiplier: 0.4, qty: 1 },
    },
  },
  'Brookside': {
    specialty: 'Local market',
    heatLevel: 'Mild',
    drugs: {
      weed: { buyMultiplier: 1.0, sellMultiplier: 1.0, qty: 35 },
      speed: { buyMultiplier: 1.0, sellMultiplier: 1.0, qty: 15 },
      heroin: { buyMultiplier: 1.2, sellMultiplier: 0.8, qty: 10 },
      cocaine: { buyMultiplier: 1.4, sellMultiplier: 0.7, qty: 8 },
      lsd: { buyMultiplier: 1.1, sellMultiplier: 0.9, qty: 12 },
      opium: { buyMultiplier: 2.0, sellMultiplier: 0.5, qty: 2 },
    },
  },
  'Martin City': {
    specialty: 'South KC dope',
    heatLevel: 'Very Hot',
    drugs: {
      weed: { buyMultiplier: 0.9, sellMultiplier: 1.1, qty: 45 },
      speed: { buyMultiplier: 0.85, sellMultiplier: 1.2, qty: 25 },
      heroin: { buyMultiplier: 0.7, sellMultiplier: 1.4, qty: 40 },
      cocaine: { buyMultiplier: 1.3, sellMultiplier: 0.8, qty: 6 },
      lsd: { buyMultiplier: 1.2, sellMultiplier: 0.8, qty: 8 },
      opium: { buyMultiplier: 1.8, sellMultiplier: 0.6, qty: 3 },
    },
  },
  'Independence': {
    specialty: 'Suburban hustle',
    heatLevel: 'Mild',
    drugs: {
      weed: { buyMultiplier: 1.0, sellMultiplier: 1.0, qty: 30 },
      speed: { buyMultiplier: 1.1, sellMultiplier: 0.9, qty: 12 },
      heroin: { buyMultiplier: 1.3, sellMultiplier: 0.7, qty: 6 },
      cocaine: { buyMultiplier: 1.6, sellMultiplier: 0.6, qty: 4 },
      lsd: { buyMultiplier: 1.3, sellMultiplier: 0.7, qty: 10 },
      opium: { buyMultiplier: 2.5, sellMultiplier: 0.3, qty: 1 },
    },
  },
  'JOCO': {
    specialty: 'Wealthy suburbs',
    heatLevel: 'Moderate',
    drugs: {
      weed: { buyMultiplier: 1.6, sellMultiplier: 0.6, qty: 15 },
      speed: { buyMultiplier: 1.4, sellMultiplier: 0.8, qty: 10 },
      heroin: { buyMultiplier: 1.4, sellMultiplier: 0.7, qty: 8 },
      cocaine: { buyMultiplier: 0.8, sellMultiplier: 1.4, qty: 40 },
      lsd: { buyMultiplier: 0.9, sellMultiplier: 1.2, qty: 30 },
      opium: { buyMultiplier: 1.6, sellMultiplier: 0.9, qty: 4 },
    },
  },
};

/**
 * Get the market price for a specific drug in a specific location
 */
export function getMarketPrice(drugId, location, isSelling = false) {
  const drug = DRUGS.find(d => d.id === drugId);
  const market = LOCATION_MARKETS[location];

  if (!drug || !market || !market.drugs[drugId]) {
    return null;
  }

  const multiplier = isSelling 
    ? market.drugs[drugId].sellMultiplier 
    : market.drugs[drugId].buyMultiplier;

  return Math.round(drug.basePrice * multiplier);
}

/**
 * Get available quantity for a drug in a location
 */
export function getAvailableQuantity(drugId, location) {
  const market = LOCATION_MARKETS[location];
  if (!market || !market.drugs[drugId]) {
    return 0;
  }
  return market.drugs[drugId].qty;
}
