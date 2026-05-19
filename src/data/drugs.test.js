import { DRUGS, LOCATION_MARKETS, getMarketPrice, getAvailableQuantity, initialStockLevels } from './drugs';

const EXPECTED_DRUG_IDS = ['weed', 'speed', 'heroin', 'cocaine', 'lsd', 'opium', 'hash', 'ecstasy', 'pharmacols'];
const LOCATIONS = Object.keys(LOCATION_MARKETS);

describe('DRUGS array', () => {
  test('contains all 9 drugs', () => {
    expect(DRUGS).toHaveLength(9);
    expect(DRUGS.map(d => d.id)).toEqual(expect.arrayContaining(EXPECTED_DRUG_IDS));
  });

  test.each(['hash', 'ecstasy', 'pharmacols'])('%s has required fields', id => {
    const drug = DRUGS.find(d => d.id === id);
    expect(drug).toBeDefined();
    expect(drug).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      emoji: expect.any(String),
      color: expect.any(String),
      basePrice: expect.any(Number),
      risk: expect.any(Number),
      description: expect.any(String),
    });
  });

  test('pharmacols has the lowest basePrice', () => {
    const pharmacols = DRUGS.find(d => d.id === 'pharmacols');
    const minPrice = Math.min(...DRUGS.map(d => d.basePrice));
    expect(pharmacols.basePrice).toBe(minPrice);
  });

  test('pharmacols has risk 0', () => {
    expect(DRUGS.find(d => d.id === 'pharmacols').risk).toBe(0);
  });
});

describe('LOCATION_MARKETS', () => {
  test('has 12 locations', () => {
    expect(LOCATIONS).toHaveLength(12);
  });

  test.each(LOCATIONS)('%s contains all 9 drug entries', location => {
    const drugIds = Object.keys(LOCATION_MARKETS[location].drugs);
    expect(drugIds).toEqual(expect.arrayContaining(EXPECTED_DRUG_IDS));
    expect(drugIds).toHaveLength(9);
  });

  test.each(LOCATIONS)('%s drug entries have buyMultiplier, sellMultiplier, qty', location => {
    for (const entry of Object.values(LOCATION_MARKETS[location].drugs)) {
      expect(entry.buyMultiplier).toBeGreaterThan(0);
      expect(entry.sellMultiplier).toBeGreaterThan(0);
      expect(entry.qty).toBeGreaterThan(0);
    }
  });

  test('Westport ecstasy has lower buy price than Northtown (party scene advantage)', () => {
    expect(LOCATION_MARKETS['Westport'].drugs.ecstasy.buyMultiplier)
      .toBeLessThan(LOCATION_MARKETS['Northtown'].drugs.ecstasy.buyMultiplier);
  });

  test('Independence pharmacols has lower buy price than Northtown', () => {
    expect(LOCATION_MARKETS['Independence'].drugs.pharmacols.buyMultiplier)
      .toBeLessThanOrEqual(LOCATION_MARKETS['Northtown'].drugs.pharmacols.buyMultiplier);
  });
});

describe('getMarketPrice', () => {
  test.each(['hash', 'ecstasy', 'pharmacols'])('returns a positive number for %s in Westport', id => {
    const price = getMarketPrice(id, 'Westport');
    expect(price).toBeGreaterThan(0);
  });

  test('hash buy price is higher than pharmacols buy price in all locations', () => {
    for (const loc of LOCATIONS) {
      const hashPrice = getMarketPrice('hash', loc);
      const pharmaPrice = getMarketPrice('pharmacols', loc);
      expect(hashPrice).toBeGreaterThan(pharmaPrice);
    }
  });

  test('returns null for unknown drug', () => {
    expect(getMarketPrice('unknowndrug', 'Westport')).toBeNull();
  });

  test('returns null for unknown location', () => {
    expect(getMarketPrice('hash', 'NowhereMO')).toBeNull();
  });
});

describe('getAvailableQuantity', () => {
  test.each(['hash', 'ecstasy', 'pharmacols'])('returns default qty for %s with empty stockLevels', id => {
    const qty = getAvailableQuantity(id, 'Westport', {});
    expect(qty).toBe(LOCATION_MARKETS['Westport'].drugs[id].qty);
  });

  test('returns overridden value from stockLevels', () => {
    const stock = { 'Westport': { hash: 7 } };
    expect(getAvailableQuantity('hash', 'Westport', stock)).toBe(7);
  });
});

describe('getMarketPrice — new options', () => {
  test('prestige sell bonus raises sell price at prestige >= 50', () => {
    // Use Downtown where weed sellMult (0.9) leaves headroom below the arbitrage cap
    const high = getMarketPrice('weed', 'Downtown', true, { prestige: 50 });
    const base = getMarketPrice('weed', 'Downtown', true, { prestige: 0 });
    expect(high).toBeGreaterThan(base);
  });

  test('rival buy pressure raises buy price', () => {
    const withRival = getMarketPrice('weed', 'Westport', false, { rivalLevel: 2 });
    const noRival   = getMarketPrice('weed', 'Westport', false, { rivalLevel: 0 });
    expect(withRival).toBeGreaterThan(noRival);
  });

  test('rival competition lowers sell price', () => {
    const withRival = getMarketPrice('weed', 'Westport', true, { rivalLevel: 2 });
    const noRival   = getMarketPrice('weed', 'Westport', true, { rivalLevel: 0 });
    expect(withRival).toBeLessThan(noRival);
  });

  test('flash buy deal lowers buy price', () => {
    const deal   = getMarketPrice('weed', 'Westport', false, { flashDeals: { weed: { type: 'buy', mult: 0.5, expiresDay: 99 } } });
    const noDeal = getMarketPrice('weed', 'Westport', false, {});
    expect(deal).toBeLessThan(noDeal);
  });

  test('flash sell deal raises sell price', () => {
    // Use Downtown where weed sellMult (0.9) leaves headroom below the arbitrage cap
    const deal   = getMarketPrice('weed', 'Downtown', true, { flashDeals: { weed: { type: 'sell', mult: 1.75, expiresDay: 99 } } });
    const noDeal = getMarketPrice('weed', 'Downtown', true, {});
    expect(deal).toBeGreaterThan(noDeal);
  });
});

describe('initialStockLevels', () => {
  test('includes all 9 drugs for every location', () => {
    const levels = initialStockLevels();
    for (const loc of LOCATIONS) {
      expect(Object.keys(levels[loc])).toEqual(expect.arrayContaining(EXPECTED_DRUG_IDS));
    }
  });

  test('stock values match LOCATION_MARKETS qty defaults', () => {
    const levels = initialStockLevels();
    for (const loc of LOCATIONS) {
      for (const id of EXPECTED_DRUG_IDS) {
        expect(levels[loc][id]).toBe(LOCATION_MARKETS[loc].drugs[id].qty);
      }
    }
  });
});
