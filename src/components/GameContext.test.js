import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';
import { INITIAL_STATE } from '../gameState';

beforeEach(() => sessionStorage.clear());

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
