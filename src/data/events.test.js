import { generateEventCalendar, generatePriceMultipliers } from './events';
import { DRUGS } from './drugs';

describe('generateEventCalendar', () => {
  test('returns an object keyed by day numbers', () => {
    const cal = generateEventCalendar(60);
    expect(typeof cal).toBe('object');
    for (const day of Object.keys(cal)) {
      expect(Number(day)).toBeGreaterThanOrEqual(5);
      expect(Number(day)).toBeLessThanOrEqual(56); // max: floor(rand * 52) + 5
    }
  });

  test('contains between 18 and 30 events', () => {
    const cal = generateEventCalendar(60);
    const count = Object.keys(cal).length;
    expect(count).toBeGreaterThanOrEqual(18);
    expect(count).toBeLessThanOrEqual(30);
  });

  test('no duplicate days', () => {
    const cal = generateEventCalendar(60);
    const days = Object.keys(cal);
    expect(new Set(days).size).toBe(days.length);
  });

  test('each event has id, text, and effects', () => {
    const cal = generateEventCalendar(60);
    for (const ev of Object.values(cal)) {
      expect(ev).toMatchObject({
        id: expect.any(String),
        text: expect.any(String),
        effects: expect.any(Object),
      });
    }
  });

  test('no event appears more than once across 5 runs', () => {
    for (let i = 0; i < 5; i++) {
      const cal = generateEventCalendar(60);
      const ids = Object.values(cal).map(ev => ev.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test('season-weighted placement: fall events appear more in days 41–60', () => {
    const fallEventIds = new Set(['chiefs_run', 'college_weekend', 'cold_snap', 'hash_drought', 'crossroads_festival', 'royals_playoff_push', 'polar_vortex']);
    const fallDayCount = { inSeason: 0, outOfSeason: 0 };

    for (let run = 0; run < 20; run++) {
      const cal = generateEventCalendar(60);
      for (const [dayStr, ev] of Object.entries(cal)) {
        if (fallEventIds.has(ev.id)) {
          const day = Number(dayStr);
          if (day >= 41) fallDayCount.inSeason++;
          else fallDayCount.outOfSeason++;
        }
      }
    }
    // Fall events should land in-season more often than out-of-season
    expect(fallDayCount.inSeason).toBeGreaterThan(fallDayCount.outOfSeason);
  });
});

describe('generatePriceMultipliers', () => {
  test('returns a multiplier for every drug', () => {
    const mults = generatePriceMultipliers();
    for (const drug of DRUGS) {
      expect(mults[drug.id]).toBeDefined();
    }
  });

  test('includes new drugs hash, ecstasy, pharmacols', () => {
    const mults = generatePriceMultipliers();
    expect(mults.hash).toBeDefined();
    expect(mults.ecstasy).toBeDefined();
    expect(mults.pharmacols).toBeDefined();
  });

  test('all multipliers are within 0.55–1.45', () => {
    for (let i = 0; i < 10; i++) {
      const mults = generatePriceMultipliers();
      for (const val of Object.values(mults)) {
        expect(val).toBeGreaterThanOrEqual(0.55);
        expect(val).toBeLessThanOrEqual(1.45);
      }
    }
  });

  test('returns a fresh independent object each call', () => {
    const a = generatePriceMultipliers();
    const b = generatePriceMultipliers();
    // Same keys, but values should differ across calls (statistically certain over 9 drugs)
    expect(Object.keys(a)).toEqual(Object.keys(b));
    const allSame = Object.keys(a).every(k => a[k] === b[k]);
    expect(allSame).toBe(false);
  });
});
