import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';
import { INITIAL_STATE } from '../gameState';

beforeEach(() => localStorage.clear());

const wrapper = ({ children }) => <GameProvider>{children}</GameProvider>;

describe('initial state', () => {
  test('provides INITIAL_STATE on first load', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash);
    expect(result.current.game.bag).toEqual(INITIAL_STATE.bag);
    expect(result.current.game.wantedLevel).toBe(INITIAL_STATE.wantedLevel);
  });
});

describe('updateGame', () => {
  test('merges a plain object into state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 5000 }));
    expect(result.current.game.cash).toBe(5000);
  });

  test('applies a function updater', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame(prev => ({ ...prev, day: prev.day + 1 })));
    expect(result.current.game.day).toBe(INITIAL_STATE.day + 1);
  });

  test('does not clobber unrelated fields', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 1 }));
    expect(result.current.game.debt).toBe(INITIAL_STATE.debt);
    expect(result.current.game.bag).toEqual(INITIAL_STATE.bag);
  });
});

describe('buyItem', () => {
  test('deducts cash and adds new item to bag', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.buyItem('1', 'Coke', 5, 100, 10));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash - 500);
    const item = result.current.game.bag.find(i => i.name === 'Coke');
    expect(item?.qty).toBe(5);
  });

  test('increases quantity when item already in bag', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.buyItem('1', 'Weed', 5, 1, 50));
    const weed = result.current.game.bag.find(i => i.name === 'Weed');
    expect(weed?.qty).toBe(INITIAL_STATE.bag.find(i => i.name === 'Weed').qty + 5);
  });

  test('throws on quantity less than 1', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.buyItem('1', 'Coke', 0, 10, 5)).toThrow(/invalid quantity/i);
  });

  test('throws on quantity exceeding available stock', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.buyItem('1', 'Coke', 10, 10, 5)).toThrow(/invalid quantity/i);
  });

  test('throws on insufficient cash', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.buyItem('1', 'Coke', 1, 999999, 1)).toThrow(/insufficient cash/i);
  });

  test('throws when purchase would exceed bag capacity', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.buyItem('1', 'Coke', 90, 1, 90)).toThrow(/bag capacity/i);
  });
});

describe('sellItem', () => {
  test('adds revenue and reduces item quantity', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const before = result.current.game.cash;
    act(() => result.current.sellItem('1', 'Weed', 5, 50));
    expect(result.current.game.cash).toBe(before + 250);
    const weed = result.current.game.bag.find(i => i.name === 'Weed');
    expect(weed?.qty).toBe(5);
  });

  test('removes item from bag when selling all', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.sellItem('1', 'Weed', 10, 50));
    expect(result.current.game.bag.find(i => i.name === 'Weed')).toBeUndefined();
  });

  test('throws when selling more than owned', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.sellItem('1', 'Weed', 999, 50)).toThrow();
  });

  test('throws when selling item not in bag', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.sellItem('1', 'NotReal', 1, 50)).toThrow();
  });
});

describe('dumpBag', () => {
  test('empties the bag', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.dumpBag());
    expect(result.current.game.bag).toHaveLength(0);
  });

  test('preserves other game state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.dumpBag());
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash);
    expect(result.current.game.day).toBe(INITIAL_STATE.day);
  });
});

describe('stat tracking', () => {
  test('buyItem increments drugsTraded', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const before = result.current.game.stats?.drugsTraded ?? 0;
    act(() => result.current.buyItem('weed', 'Weed', 3, 1, 50));
    expect(result.current.game.stats.drugsTraded).toBe(before + 3);
  });

  test('sellItem increments drugsTraded', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const before = result.current.game.stats?.drugsTraded ?? 0;
    act(() => result.current.sellItem('weed', 'Weed', 5, 100));
    expect(result.current.game.stats.drugsTraded).toBe(before + 5);
  });

  test('sellItem accumulates totalProfit', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.sellItem('weed', 'Weed', 5, 200));
    expect(result.current.game.stats.totalProfit).toBe(1000);
    act(() => result.current.sellItem('speed', 'Speed', 3, 100));
    expect(result.current.game.stats.totalProfit).toBe(1300);
  });

  test('sellItem tracks biggestTrade', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.sellItem('weed', 'Weed', 5, 100));   // 500
    expect(result.current.game.stats.biggestTrade).toBe(500);
    act(() => result.current.sellItem('speed', 'Speed', 2, 100)); // 200 — should not replace
    expect(result.current.game.stats.biggestTrade).toBe(500);
    act(() => result.current.sellItem('weed', 'Weed', 5, 300));   // 1500 — new max
    expect(result.current.game.stats.biggestTrade).toBe(1500);
  });

  test('stats object exists on fresh game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.game.stats).toBeDefined();
    expect(result.current.game.stats).toMatchObject({
      totalProfit: 0,
      biggestTrade: 0,
      drugsTraded: 0,
      timesBusted: 0,
    });
  });
});

describe('achievement system', () => {
  test('pendingAchievement is null on fresh game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.game.pendingAchievement).toBeNull();
  });

  test('unlockedAchievements is empty on fresh game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.game.unlockedAchievements).toEqual([]);
  });

  test('dismissAchievement clears pendingAchievement', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    // Force a pending achievement into state
    act(() => result.current.updateGame({ pendingAchievement: { id: 'test', label: 'Test', emoji: '⭐', description: 'x' } }));
    expect(result.current.game.pendingAchievement).not.toBeNull();
    act(() => result.current.dismissAchievement());
    expect(result.current.game.pendingAchievement).toBeNull();
  });

  test('selling enough to reach $10k triggers first_10k achievement', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    // Weed qty=10 in initial bag, sell all at high price to push cash over 10k
    // Initial cash = 2000; need 8001 more → sell 10 Weed @ 801 each
    act(() => result.current.sellItem('weed', 'Weed', 10, 1000));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash + 10000);
    expect(result.current.game.unlockedAchievements).toContain('first_10k');
  });

  test('same achievement is not unlocked twice', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.sellItem('weed', 'Weed', 10, 1000));
    act(() => result.current.sellItem('speed', 'Speed', 5, 1000));
    const count = result.current.game.unlockedAchievements.filter(id => id === 'first_10k').length;
    expect(count).toBe(1);
  });
});

describe('tutorial', () => {
  test('tutorialSeen is false on fresh game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.game.tutorialSeen).toBe(false);
  });

  test('markTutorialSeen sets tutorialSeen to true', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.markTutorialSeen());
    expect(result.current.game.tutorialSeen).toBe(true);
  });

  test('markTutorialSeen does not affect other state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.markTutorialSeen());
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash);
    expect(result.current.game.bag).toEqual(INITIAL_STATE.bag);
  });
});

describe('takeLoan / payLoan', () => {
  test('takeLoan adds to cash and debt', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.takeLoan(1000));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash + 1000);
    expect(result.current.game.debt).toBe(INITIAL_STATE.debt + 1000);
  });

  test('takeLoan caps at $5000', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.takeLoan(9999));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash + 5000);
  });

  test('payLoan reduces cash and debt', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.payLoan(500));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash - 500);
    expect(result.current.game.debt).toBe(INITIAL_STATE.debt - 500);
  });

  test('payLoan throws when cash is zero', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 0 }));
    expect(() => result.current.payLoan(100)).toThrow(/not enough cash/i);
  });

  test('paying off all debt triggers clear_debt achievement', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    // Set cash high enough and debt to small amount
    act(() => result.current.updateGame({ cash: 10000, debt: 500 }));
    act(() => result.current.payLoan(500));
    expect(result.current.game.debt).toBe(0);
    expect(result.current.game.unlockedAchievements).toContain('clear_debt');
  });
});

describe('hireCrew / fireCrew', () => {
  test('hireCrew deducts cash and increases crew and bagCapacity', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.hireCrew(1));
    expect(result.current.game.crew).toBe(1);
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash - 800);
    expect(result.current.game.bagCapacity).toBe(INITIAL_STATE.bagCapacity + 15);
  });

  test('hireCrew throws when insufficient cash', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 0 }));
    expect(() => result.current.hireCrew(1)).toThrow(/need/i);
  });

  test('hireCrew throws at max crew', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ crew: 8, cash: 99999 }));
    expect(() => result.current.hireCrew(1)).toThrow(/max crew/i);
  });

  test('hiring 8 crew triggers full_crew achievement', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 99999, crew: 7 }));
    act(() => result.current.hireCrew(1));
    expect(result.current.game.crew).toBe(8);
    expect(result.current.game.unlockedAchievements).toContain('full_crew');
  });

  test('fireCrew decreases crew and bagCapacity', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 99999, crew: 2, bagCapacity: 130 }));
    act(() => result.current.fireCrew(1));
    expect(result.current.game.crew).toBe(1);
    expect(result.current.game.bagCapacity).toBe(115);
  });

  test('fireCrew throws when no crew', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.fireCrew(1)).toThrow(/not enough crew/i);
  });

  test('bagCapacity does not drop below 100 when firing', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ crew: 1, bagCapacity: 100 }));
    act(() => result.current.fireCrew(1));
    expect(result.current.game.bagCapacity).toBe(100);
  });
});

describe('upgradeBag', () => {
  test('deducts $2000 and increases bagCapacity by 25', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 5000 }));
    act(() => result.current.upgradeBag());
    expect(result.current.game.cash).toBe(3000);
    expect(result.current.game.bagCapacity).toBe(INITIAL_STATE.bagCapacity + 25);
    expect(result.current.game.bagUpgradesUsed).toBe(1);
  });

  test('throws when insufficient cash', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 0 }));
    expect(() => result.current.upgradeBag()).toThrow(/need/i);
  });

  test('throws when max upgrades reached', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 99999, bagUpgradesUsed: 4 }));
    expect(() => result.current.upgradeBag()).toThrow(/maximum/i);
  });
});

describe('tipOff', () => {
  test('deducts cost, reduces wanted level, and sets cooldown', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 5000, wantedLevel: 3, tipOffCooldown: 0 }));
    act(() => result.current.tipOff());
    expect(result.current.game.cash).toBe(4500);
    expect(result.current.game.wantedLevel).toBe(1);
    expect(result.current.game.tipOffCooldown).toBe(5);
  });

  test('throws when on cooldown', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ tipOffCooldown: 3 }));
    expect(() => result.current.tipOff()).toThrow(/cooldown/i);
  });

  test('throws when insufficient cash', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ cash: 100, tipOffCooldown: 0 }));
    expect(() => result.current.tipOff()).toThrow(/need/i);
  });
});

describe('setDifficulty', () => {
  test('changes difficulty on day 1', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.setDifficulty('hard'));
    expect(result.current.game.difficulty).toBe('hard');
  });

  test('throws when tried after day 1', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ day: 5 }));
    expect(() => result.current.setDifficulty('easy')).toThrow(/only.*before/i);
  });

  test('throws for unknown difficulty', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(() => result.current.setDifficulty('insane')).toThrow(/unknown/i);
  });
});

describe('prestige accumulation', () => {
  test('selling $2000+ worth earns +2 prestige', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const before = result.current.game.prestige;
    act(() => result.current.sellItem('weed', 'Weed', 10, 210)); // 2100 >= 2000
    expect(result.current.game.prestige).toBe(before + 2);
  });

  test('selling under $2000 does not earn prestige', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    const before = result.current.game.prestige;
    act(() => result.current.sellItem('weed', 'Weed', 5, 100)); // 500 < 2000
    expect(result.current.game.prestige).toBe(before);
  });

  test('escaping encounter earns +5 prestige', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ pendingEncounter: { fine: 500 }, crew: 8, prestige: 0 }));
    const origMath = Math.random;
    Math.random = () => 0.01; // well below 1.2 escape threshold → always escaped
    act(() => result.current.resolveEncounter('run'));
    Math.random = origMath;
    expect(result.current.game.prestige).toBe(5);
  });
});

describe('resolveEncounter', () => {
  test('pay choice deducts fine and reduces wantedLevel', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ pendingEncounter: { fine: 500 }, wantedLevel: 3 }));
    act(() => result.current.resolveEncounter('pay'));
    expect(result.current.game.cash).toBe(INITIAL_STATE.cash - 500);
    expect(result.current.game.wantedLevel).toBe(2);
    expect(result.current.game.pendingEncounter).toBeNull();
  });

  test('dump choice clears bag and reduces wantedLevel by 2', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ pendingEncounter: { fine: 500 }, wantedLevel: 3 }));
    act(() => result.current.resolveEncounter('dump'));
    expect(result.current.game.bag).toHaveLength(0);
    expect(result.current.game.wantedLevel).toBe(1);
    expect(result.current.game.pendingEncounter).toBeNull();
  });

  test('run with guaranteed escape clears encounter', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ pendingEncounter: { fine: 500 }, crew: 8 })); // 40%+80%=120% → always escape
    const origMath = Math.random;
    Math.random = () => 0.99; // just below 1.2 escape threshold → escaped
    act(() => result.current.resolveEncounter('run'));
    Math.random = origMath;
    expect(result.current.game.pendingEncounter).toBeNull();
  });

  test('run with guaranteed failure increments timesBusted', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.updateGame({ pendingEncounter: { fine: 500 }, crew: 0, wantedLevel: 3 }));
    const origMath = Math.random;
    Math.random = () => 0.99; // above 40% escape chance → caught
    act(() => result.current.resolveEncounter('run'));
    Math.random = origMath;
    expect(result.current.game.stats.timesBusted).toBe(1);
  });
});
