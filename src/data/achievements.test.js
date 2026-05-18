import { ACHIEVEMENTS, checkNewAchievements } from './achievements';
import { INITIAL_STATE } from '../gameState';

const base = {
  ...INITIAL_STATE,
  stats: { totalProfit: 0, biggestTrade: 0, drugsTraded: 0, timesBusted: 0 },
  unlockedAchievements: [],
};

describe('ACHIEVEMENTS', () => {
  test('contains at least 7 achievements with required fields', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(7);
    ACHIEVEMENTS.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('label');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('emoji');
      expect(typeof a.check).toBe('function');
    });
  });

  test('all ids are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('checkNewAchievements', () => {
  test('returns empty array for fresh game state', () => {
    expect(checkNewAchievements(base)).toHaveLength(0);
  });

  test('already-unlocked achievements are not returned again', () => {
    const state = { ...base, cash: 999999, unlockedAchievements: ACHIEVEMENTS.map(a => a.id) };
    expect(checkNewAchievements(state)).toHaveLength(0);
  });
});

describe('first_10k achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'first_10k');

  test('does not trigger below $10,000', () => {
    expect(ach.check({ ...base, cash: 9999 })).toBe(false);
  });

  test('triggers at exactly $10,000', () => {
    expect(ach.check({ ...base, cash: 10000 })).toBe(true);
  });

  test('triggers above $10,000', () => {
    expect(ach.check({ ...base, cash: 50000 })).toBe(true);
  });

  test('appears in checkNewAchievements when not yet unlocked', () => {
    const result = checkNewAchievements({ ...base, cash: 10000 });
    expect(result.some(a => a.id === 'first_10k')).toBe(true);
  });
});

describe('big_trade achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'big_trade');

  test('does not trigger below $5,000 biggest trade', () => {
    expect(ach.check({ ...base, stats: { ...base.stats, biggestTrade: 4999 } })).toBe(false);
  });

  test('triggers at $5,000 biggest trade', () => {
    expect(ach.check({ ...base, stats: { ...base.stats, biggestTrade: 5000 } })).toBe(true);
  });
});

describe('survived_30 achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'survived_30');

  test('does not trigger before day 30', () => {
    expect(ach.check({ ...base, day: 29 })).toBe(false);
  });

  test('triggers at day 30', () => {
    expect(ach.check({ ...base, day: 30 })).toBe(true);
  });
});

describe('never_busted achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'never_busted');

  test('does not trigger before day 30 even with 0 busts', () => {
    expect(ach.check({ ...base, day: 29, stats: { ...base.stats, timesBusted: 0 } })).toBe(false);
  });

  test('does not trigger at day 30 with any busts', () => {
    expect(ach.check({ ...base, day: 30, stats: { ...base.stats, timesBusted: 1 } })).toBe(false);
  });

  test('triggers at day 30 with zero busts', () => {
    expect(ach.check({ ...base, day: 30, stats: { ...base.stats, timesBusted: 0 } })).toBe(true);
  });
});

describe('full_crew achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'full_crew');

  test('does not trigger with 7 crew', () => {
    expect(ach.check({ ...base, crew: 7 })).toBe(false);
  });

  test('triggers with 8 crew', () => {
    expect(ach.check({ ...base, crew: 8 })).toBe(true);
  });
});

describe('clear_debt achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'clear_debt');

  test('does not trigger with any debt remaining', () => {
    expect(ach.check({ ...base, debt: 1 })).toBe(false);
  });

  test('triggers at zero debt', () => {
    expect(ach.check({ ...base, debt: 0 })).toBe(true);
  });
});

describe('high_roller achievement', () => {
  const ach = ACHIEVEMENTS.find(a => a.id === 'high_roller');

  test('does not trigger below 500 units traded', () => {
    expect(ach.check({ ...base, stats: { ...base.stats, drugsTraded: 499 } })).toBe(false);
  });

  test('triggers at 500 units traded', () => {
    expect(ach.check({ ...base, stats: { ...base.stats, drugsTraded: 500 } })).toBe(true);
  });
});
