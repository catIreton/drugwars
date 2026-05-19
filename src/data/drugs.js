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
  {
    id: 'hash',
    name: 'Hash',
    emoji: '🟤',
    color: '#92400e',
    basePrice: 400,
    risk: 1,
    description: 'Cannabis resin — smooth and steady',
  },
  {
    id: 'ecstasy',
    name: 'Ecstasy',
    emoji: '💊',
    color: '#ec4899',
    basePrice: 600,
    risk: 2,
    description: 'MDMA — party scene staple',
  },
  {
    id: 'pharmacols',
    name: 'Pharmacols',
    emoji: '🧪',
    color: '#0ea5e9',
    basePrice: 100,
    risk: 0,
    description: 'Legal substitute — minimal heat, minimal margin',
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
      weed:        { buyMultiplier: 0.8,  sellMultiplier: 1.2,  qty: 50 },
      speed:       { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 20 },
      heroin:      { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 10 },
      cocaine:     { buyMultiplier: 1.5,  sellMultiplier: 0.8,  qty: 5  },
      lsd:         { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 5  },
      opium:       { buyMultiplier: 2.0,  sellMultiplier: 0.5,  qty: 2  },
      hash:        { buyMultiplier: 0.85, sellMultiplier: 1.15, qty: 30 },
      ecstasy:     { buyMultiplier: 1.3,  sellMultiplier: 0.8,  qty: 8  },
      pharmacols:  { buyMultiplier: 1.1,  sellMultiplier: 0.95, qty: 25 },
    },
  },
  'Plaza': {
    specialty: 'High-end market',
    heatLevel: 'Hot',
    drugs: {
      weed:        { buyMultiplier: 1.5,  sellMultiplier: 0.8,  qty: 20 },
      speed:       { buyMultiplier: 1.3,  sellMultiplier: 0.9,  qty: 15 },
      heroin:      { buyMultiplier: 1.2,  sellMultiplier: 0.9,  qty: 8  },
      cocaine:     { buyMultiplier: 0.9,  sellMultiplier: 1.3,  qty: 30 },
      lsd:         { buyMultiplier: 0.8,  sellMultiplier: 1.3,  qty: 25 },
      opium:       { buyMultiplier: 1.5,  sellMultiplier: 1.0,  qty: 5  },
      hash:        { buyMultiplier: 1.2,  sellMultiplier: 1.0,  qty: 15 },
      ecstasy:     { buyMultiplier: 1.0,  sellMultiplier: 1.2,  qty: 20 },
      pharmacols:  { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 40 },
    },
  },
  'Downtown': {
    specialty: 'Business district',
    heatLevel: 'Hot',
    drugs: {
      weed:        { buyMultiplier: 1.2,  sellMultiplier: 0.9,  qty: 25 },
      speed:       { buyMultiplier: 1.0,  sellMultiplier: 1.2,  qty: 20 },
      heroin:      { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 12 },
      cocaine:     { buyMultiplier: 1.0,  sellMultiplier: 1.2,  qty: 25 },
      lsd:         { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 20 },
      opium:       { buyMultiplier: 1.8,  sellMultiplier: 0.7,  qty: 3  },
      hash:        { buyMultiplier: 1.1,  sellMultiplier: 1.0,  qty: 20 },
      ecstasy:     { buyMultiplier: 1.1,  sellMultiplier: 1.1,  qty: 15 },
      pharmacols:  { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 50 },
    },
  },
  'Westport': {
    specialty: 'Party scene',
    heatLevel: 'Moderate',
    drugs: {
      weed:        { buyMultiplier: 1.0,  sellMultiplier: 1.1,  qty: 40 },
      speed:       { buyMultiplier: 0.8,  sellMultiplier: 1.3,  qty: 30 },
      heroin:      { buyMultiplier: 1.3,  sellMultiplier: 0.8,  qty: 8  },
      cocaine:     { buyMultiplier: 1.1,  sellMultiplier: 1.1,  qty: 20 },
      lsd:         { buyMultiplier: 0.7,  sellMultiplier: 1.4,  qty: 35 },
      opium:       { buyMultiplier: 2.2,  sellMultiplier: 0.4,  qty: 1  },
      hash:        { buyMultiplier: 0.9,  sellMultiplier: 1.2,  qty: 25 },
      ecstasy:     { buyMultiplier: 0.75, sellMultiplier: 1.4,  qty: 40 },
      pharmacols:  { buyMultiplier: 1.0,  sellMultiplier: 1.05, qty: 35 },
    },
  },
  'Brookside': {
    specialty: 'Local market',
    heatLevel: 'Mild',
    drugs: {
      weed:        { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 35 },
      speed:       { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 15 },
      heroin:      { buyMultiplier: 1.2,  sellMultiplier: 0.8,  qty: 10 },
      cocaine:     { buyMultiplier: 1.4,  sellMultiplier: 0.7,  qty: 8  },
      lsd:         { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 12 },
      opium:       { buyMultiplier: 2.0,  sellMultiplier: 0.5,  qty: 2  },
      hash:        { buyMultiplier: 0.95, sellMultiplier: 1.05, qty: 30 },
      ecstasy:     { buyMultiplier: 1.2,  sellMultiplier: 0.9,  qty: 10 },
      pharmacols:  { buyMultiplier: 0.95, sellMultiplier: 1.0,  qty: 45 },
    },
  },
  'Martin City': {
    specialty: 'South KC dope',
    heatLevel: 'Very Hot',
    drugs: {
      weed:        { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 45 },
      speed:       { buyMultiplier: 0.85, sellMultiplier: 1.2,  qty: 25 },
      heroin:      { buyMultiplier: 0.7,  sellMultiplier: 1.4,  qty: 40 },
      cocaine:     { buyMultiplier: 1.3,  sellMultiplier: 0.8,  qty: 6  },
      lsd:         { buyMultiplier: 1.2,  sellMultiplier: 0.8,  qty: 8  },
      opium:       { buyMultiplier: 1.8,  sellMultiplier: 0.6,  qty: 3  },
      hash:        { buyMultiplier: 0.8,  sellMultiplier: 1.1,  qty: 35 },
      ecstasy:     { buyMultiplier: 1.1,  sellMultiplier: 0.85, qty: 12 },
      pharmacols:  { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 20 },
    },
  },
  'Independence': {
    specialty: 'Suburban hustle',
    heatLevel: 'Mild',
    drugs: {
      weed:        { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 30 },
      speed:       { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 12 },
      heroin:      { buyMultiplier: 1.3,  sellMultiplier: 0.7,  qty: 6  },
      cocaine:     { buyMultiplier: 1.6,  sellMultiplier: 0.6,  qty: 4  },
      lsd:         { buyMultiplier: 1.3,  sellMultiplier: 0.7,  qty: 10 },
      opium:       { buyMultiplier: 2.5,  sellMultiplier: 0.3,  qty: 1  },
      hash:        { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 25 },
      ecstasy:     { buyMultiplier: 1.3,  sellMultiplier: 0.8,  qty: 8  },
      pharmacols:  { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 60 },
    },
  },
  'JOCO': {
    specialty: 'Wealthy suburbs',
    heatLevel: 'Moderate',
    drugs: {
      weed:        { buyMultiplier: 1.6,  sellMultiplier: 0.6,  qty: 15 },
      speed:       { buyMultiplier: 1.4,  sellMultiplier: 0.8,  qty: 10 },
      heroin:      { buyMultiplier: 1.4,  sellMultiplier: 0.7,  qty: 8  },
      cocaine:     { buyMultiplier: 0.8,  sellMultiplier: 1.4,  qty: 40 },
      lsd:         { buyMultiplier: 0.9,  sellMultiplier: 1.2,  qty: 30 },
      opium:       { buyMultiplier: 1.6,  sellMultiplier: 0.9,  qty: 4  },
      hash:        { buyMultiplier: 1.5,  sellMultiplier: 0.7,  qty: 10 },
      ecstasy:     { buyMultiplier: 0.85, sellMultiplier: 1.3,  qty: 35 },
      pharmacols:  { buyMultiplier: 0.85, sellMultiplier: 1.15, qty: 50 },
    },
  },
  'Crossroads': {
    specialty: 'Arts district',
    heatLevel: 'Mild',
    drugs: {
      weed:        { buyMultiplier: 0.95, sellMultiplier: 1.15, qty: 35 },
      speed:       { buyMultiplier: 1.2,  sellMultiplier: 0.9,  qty: 12 },
      heroin:      { buyMultiplier: 1.5,  sellMultiplier: 0.7,  qty: 6  },
      cocaine:     { buyMultiplier: 1.3,  sellMultiplier: 0.9,  qty: 8  },
      lsd:         { buyMultiplier: 0.75, sellMultiplier: 1.45, qty: 30 },
      opium:       { buyMultiplier: 2.3,  sellMultiplier: 0.4,  qty: 1  },
      hash:        { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 20 },
      ecstasy:     { buyMultiplier: 0.80, sellMultiplier: 1.35, qty: 25 },
      pharmacols:  { buyMultiplier: 1.0,  sellMultiplier: 1.0,  qty: 40 },
    },
  },
  'Midtown': {
    specialty: 'Medical corridor',
    heatLevel: 'Moderate',
    drugs: {
      weed:        { buyMultiplier: 1.0,  sellMultiplier: 1.05, qty: 30 },
      speed:       { buyMultiplier: 1.1,  sellMultiplier: 0.95, qty: 18 },
      heroin:      { buyMultiplier: 1.1,  sellMultiplier: 0.95, qty: 10 },
      cocaine:     { buyMultiplier: 1.2,  sellMultiplier: 0.95, qty: 12 },
      lsd:         { buyMultiplier: 1.1,  sellMultiplier: 0.9,  qty: 10 },
      opium:       { buyMultiplier: 1.9,  sellMultiplier: 0.55, qty: 2  },
      hash:        { buyMultiplier: 0.85, sellMultiplier: 1.15, qty: 30 },
      ecstasy:     { buyMultiplier: 1.2,  sellMultiplier: 0.85, qty: 10 },
      pharmacols:  { buyMultiplier: 0.80, sellMultiplier: 1.25, qty: 55 },
    },
  },
  'Raytown': {
    specialty: 'Speed corridor',
    heatLevel: 'Hot',
    drugs: {
      weed:        { buyMultiplier: 0.85, sellMultiplier: 1.15, qty: 40 },
      speed:       { buyMultiplier: 0.75, sellMultiplier: 1.35, qty: 40 },
      heroin:      { buyMultiplier: 0.95, sellMultiplier: 1.05, qty: 20 },
      cocaine:     { buyMultiplier: 1.4,  sellMultiplier: 0.75, qty: 6  },
      lsd:         { buyMultiplier: 1.3,  sellMultiplier: 0.8,  qty: 8  },
      opium:       { buyMultiplier: 2.2,  sellMultiplier: 0.45, qty: 1  },
      hash:        { buyMultiplier: 1.0,  sellMultiplier: 0.95, qty: 15 },
      ecstasy:     { buyMultiplier: 1.3,  sellMultiplier: 0.85, qty: 10 },
      pharmacols:  { buyMultiplier: 0.95, sellMultiplier: 1.0,  qty: 30 },
    },
  },
  'Lenexa': {
    specialty: 'West suburbs',
    heatLevel: 'Mild',
    drugs: {
      weed:        { buyMultiplier: 1.5,  sellMultiplier: 0.65, qty: 12 },
      speed:       { buyMultiplier: 1.4,  sellMultiplier: 0.75, qty: 8  },
      heroin:      { buyMultiplier: 1.5,  sellMultiplier: 0.7,  qty: 8  },
      cocaine:     { buyMultiplier: 0.85, sellMultiplier: 1.35, qty: 35 },
      lsd:         { buyMultiplier: 0.9,  sellMultiplier: 1.1,  qty: 20 },
      opium:       { buyMultiplier: 1.7,  sellMultiplier: 0.85, qty: 3  },
      hash:        { buyMultiplier: 1.4,  sellMultiplier: 0.7,  qty: 10 },
      ecstasy:     { buyMultiplier: 0.88, sellMultiplier: 1.2,  qty: 25 },
      pharmacols:  { buyMultiplier: 0.82, sellMultiplier: 1.2,  qty: 50 },
    },
  },
};

export const GRADE_MULT = { low: 0.82, standard: 1.0, high: 1.28 };

// Returns the quality grade for a drug at a location on a given day.
// Deterministic so grade is stable within a day but changes daily.
export function getLocationGrade(drugId, location, day = 1) {
  const market = LOCATION_MARKETS[location];
  if (!market?.drugs[drugId]) return 'standard';
  const seed = ((drugId.charCodeAt(0) * 17 + location.charCodeAt(0) * 31 + day * 13) % 100 + 100) % 100;
  const buyMult = market.drugs[drugId].buyMultiplier;
  if (buyMult <= 0.85) {
    // Supply location — better quality odds
    if (seed < 15) return 'low';
    if (seed < 70) return 'standard';
    return 'high';
  } else if (buyMult >= 1.3) {
    // Non-specialty — worse quality odds
    if (seed < 40) return 'low';
    if (seed < 90) return 'standard';
    return 'high';
  } else {
    if (seed < 25) return 'low';
    if (seed < 80) return 'standard';
    return 'high';
  }
}

// options: { dailyMultipliers, eventEffects, wantedLevel, crew, prestige, rivalLevel, flashDeals, grade }
export function getMarketPrice(drugId, location, isSelling = false, options = {}) {
  const drug = DRUGS.find(d => d.id === drugId);
  const market = LOCATION_MARKETS[location];
  if (!drug || !market || !market.drugs[drugId]) return null;

  const {
    dailyMultipliers = {},
    eventEffects = {},
    wantedLevel = 0,
    crew = 0,
    prestige = 0,
    rivalLevel = 0,
    flashDeals = {},
    grade = 'standard',
    gangWar = false,
    wantedPosterActive = false,
  } = options;

  const locMult   = isSelling ? market.drugs[drugId].sellMultiplier : market.drugs[drugId].buyMultiplier;
  const dailyMult = dailyMultipliers[drugId] ?? 1.0;
  const eventMult = eventEffects.drugPrice?.[drugId] ?? eventEffects.globalPrice ?? 1.0;

  let price = Math.round(drug.basePrice * locMult * dailyMult * eventMult);

  // Flash deal multiplier (buy deal lowers buy price; sell deal raises sell price)
  const deal = flashDeals[drugId];
  if (deal && ((deal.type === 'buy' && !isSelling) || (deal.type === 'sell' && isSelling))) {
    price = Math.round(price * deal.mult);
  }

  // Rival pressure; level 4 = lockdown with harsher terms
  if (rivalLevel >= 4) {
    price = isSelling ? Math.round(price * 0.75) : Math.round(price * 1.25);
  } else if (rivalLevel > 0) {
    price = isSelling
      ? Math.round(price * (1 - rivalLevel * 0.05))
      : Math.round(price * (1 + rivalLevel * 0.07));
  }

  // Crew buy discount: crew 2+ = 5%, 4+ = 10%, 6+ = 15%
  if (!isSelling && crew >= 2) {
    const discount = crew >= 6 ? 0.85 : crew >= 4 ? 0.90 : 0.95;
    price = Math.round(price * discount);
  }

  // Wanted-level price penalty: nervous vendors charge more / pay less
  if (wantedLevel >= 5) {
    price = isSelling ? Math.round(price * 0.6) : Math.round(price * 1.35);
  } else if (wantedLevel >= 3) {
    price = isSelling ? Math.round(price * 0.82) : Math.round(price * 1.18);
  }

  // Wanted poster: recognized by vendors even after heat drops (extra penalty on top)
  if (wantedPosterActive && wantedLevel < 5) {
    price = isSelling ? Math.round(price * 0.75) : Math.round(price * 1.2);
  }

  // Gang war: prices spike — high-risk / high-reward turf war conditions
  if (gangWar) {
    price = Math.round(price * 1.2);
  }

  // Prestige sell bonus: reputation earns you better sell prices
  if (isSelling) {
    const prestigeMult = prestige >= 50 ? 1.08 : prestige >= 25 ? 1.05 : prestige >= 10 ? 1.03 : 1.0;
    price = Math.round(price * prestigeMult);
  }

  // Grade only affects sell price (buy price is same regardless of grade)
  if (isSelling) {
    price = Math.round(price * (GRADE_MULT[grade] ?? 1.0));
  }

  // Prevent instant arbitrage: sell price at same location must be < buy price.
  // Many locations have sellMultiplier > buyMultiplier by design (good demand + good supply),
  // which would let players buy and immediately sell for profit without traveling.
  if (isSelling) {
    const localBuyPrice = getMarketPrice(drugId, location, false, options);
    price = Math.min(price, localBuyPrice - 1);
  }

  return Math.max(1, price);
}

// stockLevels: { [location]: { [drugId]: number } } from game state
export function getAvailableQuantity(drugId, location, stockLevels = {}) {
  const market = LOCATION_MARKETS[location];
  if (!market || !market.drugs[drugId]) return 0;
  return stockLevels[location]?.[drugId] ?? market.drugs[drugId].qty;
}

export function initialStockLevels() {
  return Object.fromEntries(
    Object.entries(LOCATION_MARKETS).map(([loc, market]) => [
      loc,
      Object.fromEntries(Object.entries(market.drugs).map(([id, d]) => [id, d.qty])),
    ])
  );
}
