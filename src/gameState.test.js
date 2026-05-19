import { INITIAL_STATE, loadState, saveState, SESSION_KEY } from './gameState';

beforeEach(() => localStorage.clear());

describe('INITIAL_STATE', () => {
  test('has required game fields', () => {
    expect(INITIAL_STATE).toMatchObject({
      day: expect.any(Number),
      cash: expect.any(Number),
      debt: expect.any(Number),
      location: expect.any(String),
      bag: expect.any(Array),
      bagCapacity: expect.any(Number),
      wantedLevel: expect.any(Number),
    });
  });

  test('has stats object with all tracking fields', () => {
    expect(INITIAL_STATE.stats).toMatchObject({
      totalProfit: 0,
      biggestTrade: 0,
      drugsTraded: 0,
      timesBusted: 0,
    });
  });

  test('has achievement fields initialized correctly', () => {
    expect(INITIAL_STATE.unlockedAchievements).toEqual([]);
    expect(INITIAL_STATE.pendingAchievement).toBeNull();
  });

  test('tutorialSeen starts false', () => {
    expect(INITIAL_STATE.tutorialSeen).toBe(false);
  });

  test('priceHistory starts as empty object', () => {
    expect(INITIAL_STATE.priceHistory).toEqual({});
  });
});

describe('loadState', () => {
  test('returns INITIAL_STATE when storage is empty', () => {
    expect(loadState()).toEqual(INITIAL_STATE);
  });

  test('returns parsed state from localStorage', () => {
    const saved = { ...INITIAL_STATE, cash: 9999 };
    localStorage.setItem(SESSION_KEY, JSON.stringify(saved));
    expect(loadState().cash).toBe(9999);
  });

  test('returns INITIAL_STATE when storage contains corrupt JSON', () => {
    localStorage.setItem(SESSION_KEY, 'not-valid-json{{');
    expect(loadState()).toEqual(INITIAL_STATE);
  });
});

describe('saveState', () => {
  test('writes serialized state to localStorage', () => {
    saveState(INITIAL_STATE);
    const raw = localStorage.getItem(SESSION_KEY);
    expect(JSON.parse(raw)).toEqual(INITIAL_STATE);
  });

  test('overwrites previous state', () => {
    saveState({ ...INITIAL_STATE, cash: 100 });
    saveState({ ...INITIAL_STATE, cash: 500 });
    const raw = localStorage.getItem(SESSION_KEY);
    expect(JSON.parse(raw).cash).toBe(500);
  });
});
