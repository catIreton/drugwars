import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadState, saveState, createInitialState } from '../gameState';
import { generatePriceMultipliers, WEATHER_OPTIONS } from '../data/events';
import { LOCATION_MARKETS, getMarketPrice } from '../data/drugs';
import { checkNewAchievements } from '../data/achievements';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [game, setGame] = useState(() => {
    const saved = loadState();
    // Saved games from before this version won't have stockLevels etc — patch them in
    if (!saved.stockLevels || Object.keys(saved.stockLevels).length === 0) {
      return createInitialState();
    }
    return saved;
  });

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try { saveState(game); } catch (e) { console.error('Failed to save game state:', e); }
    }, 1000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [game]);

  function updateGame(updates) {
    if (typeof updates === 'function') setGame(updates);
    else setGame(prev => ({ ...prev, ...updates }));
  }

  // ── Travel / Day Advance ──────────────────────────────────────────────────
  function travel(locationName, locationSrc) {
    const newDay = game.day + 1;

    // 5% daily compound interest on debt
    const newDebt = Math.round(game.debt * 1.05);
    const bankrupted = newDebt > 30000 && game.cash < 100;

    // Refresh price multipliers for destination
    const newPriceMultipliers = {
      ...game.priceMultipliers,
      [locationName]: generatePriceMultipliers(),
    };

    // Pull today's event
    const todayEvent = game.eventCalendar[newDay] ?? null;
    const activeEventEffects = todayEvent?.effects ?? {};

    // Partially restore stock at destination (50% recovery toward max)
    const marketDrugs = LOCATION_MARKETS[locationName]?.drugs ?? {};
    const locStock = game.stockLevels[locationName] ?? {};
    const refreshedStock = Object.fromEntries(
      Object.entries(marketDrugs).map(([id, d]) => {
        const current = locStock[id] ?? d.qty;
        return [id, Math.min(d.qty, Math.round(current + (d.qty - current) * 0.5))];
      })
    );

    // Apply event stock multipliers citywide
    let newStockLevels = { ...game.stockLevels, [locationName]: refreshedStock };
    if (activeEventEffects.stockMult) {
      newStockLevels = Object.fromEntries(
        Object.entries(newStockLevels).map(([loc, drugs]) => [
          loc,
          Object.fromEntries(
            Object.entries(drugs).map(([id, qty]) =>
              activeEventEffects.stockMult[id]
                ? [id, Math.max(0, Math.round(qty * activeEventEffects.stockMult[id]))]
                : [id, qty]
            )
          ),
        ])
      );
    }

    // Weather changes each day
    const newWeather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];

    // Wanted level: natural -1 decay + event heat delta
    const heatDelta = activeEventEffects.heat ?? 0;
    const newWanted = Math.max(0, Math.min(5, game.wantedLevel - 1 + heatDelta));

    // Police encounter: wantedLevel 3+ has a random chance
    const encounterChance = Math.max(0, (game.wantedLevel - 2) * 0.22);
    const hasEncounter = game.wantedLevel >= 3 && Math.random() < encounterChance;
    const fine = hasEncounter ? Math.round(game.wantedLevel * 400 + Math.random() * 400) : 0;

    // Crew upkeep ($150/member/day) — deducted from cash, capped at 0
    const upkeep = game.crew * 150;

    setGame(prev => {
      // Snapshot current prices at this location before moving (for price history arrows)
      const snapshotOptions = {
        dailyMultipliers: prev.priceMultipliers?.[locationName] ?? {},
        eventEffects: activeEventEffects,
        wantedLevel: prev.wantedLevel,
        crew: prev.crew,
      };
      const marketDrugIds = Object.keys(LOCATION_MARKETS[locationName]?.drugs ?? {});
      const priceSnapshot = Object.fromEntries(
        marketDrugIds.map(id => [id, getMarketPrice(id, locationName, false, snapshotOptions)])
      );

      const next = {
        ...prev,
        day: newDay,
        location: locationName,
        locationSrc,
        cash: Math.max(0, prev.cash - upkeep),
        debt: newDebt,
        bankrupted,
        priceMultipliers: newPriceMultipliers,
        activeEventEffects,
        todayEvent,
        stockLevels: newStockLevels,
        weather: newWeather,
        wantedLevel: newWanted,
        pendingEncounter: hasEncounter ? { fine } : null,
        priceHistory: { ...(prev.priceHistory ?? {}), [locationName]: priceSnapshot },
      };

      const newAchievements = checkNewAchievements(next);
      if (newAchievements.length > 0) {
        return {
          ...next,
          unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
          pendingAchievement: newAchievements[0],
        };
      }
      return next;
    });
  }

  // ── Buy / Sell ────────────────────────────────────────────────────────────
  function buyItem(drugId, drugName, quantity, pricePerUnit, availableQty) {
    if (quantity < 1 || quantity > availableQty) {
      throw new Error(`Invalid quantity. Available: ${availableQty}`);
    }
    const totalCost = pricePerUnit * quantity;
    if (game.cash < totalCost) {
      throw new Error(`Insufficient cash. Need: $${totalCost}, Have: $${game.cash}`);
    }
    const currentBagUsage = game.bag.reduce((sum, item) => sum + item.qty, 0);
    if (currentBagUsage + quantity > game.bagCapacity) {
      throw new Error(`Bag capacity exceeded. Space available: ${game.bagCapacity - currentBagUsage}`);
    }

    setGame(prev => {
      const existingItem = prev.bag.find(item => item.name === drugName);
      const newBag = existingItem
        ? prev.bag.map(item => item.name === drugName ? {
            ...item,
            qty: item.qty + quantity,
            avgCost: Math.round((item.qty * (item.avgCost ?? pricePerUnit) + quantity * pricePerUnit) / (item.qty + quantity)),
          } : item)
        : [...prev.bag, { id: drugId, name: drugName, qty: quantity, avgCost: pricePerUnit }];

      const wantedIncrease = Math.floor(quantity / 10) + (Math.random() > 0.7 ? 1 : 0);

      const curStock = prev.stockLevels[prev.location]?.[drugId] ?? 0;
      const newStockLevels = {
        ...prev.stockLevels,
        [prev.location]: {
          ...prev.stockLevels[prev.location],
          [drugId]: Math.max(0, curStock - quantity),
        },
      };

      const prevStats = prev.stats ?? {};
      const next = {
        ...prev,
        cash: prev.cash - totalCost,
        bag: newBag,
        wantedLevel: Math.min(5, prev.wantedLevel + wantedIncrease),
        stockLevels: newStockLevels,
        stats: {
          ...prevStats,
          drugsTraded: (prevStats.drugsTraded ?? 0) + quantity,
        },
      };

      const newAchievements = checkNewAchievements(next);
      if (newAchievements.length > 0) {
        return {
          ...next,
          unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
          pendingAchievement: next.pendingAchievement ?? newAchievements[0],
        };
      }
      return next;
    });
  }

  function sellItem(drugId, drugName, quantity, pricePerUnit) {
    const bagItem = game.bag.find(item => item.name === drugName);
    if (!bagItem || bagItem.qty < quantity) {
      throw new Error(`Don't have ${quantity}x ${drugName}. Have: ${bagItem?.qty || 0}`);
    }

    setGame(prev => {
      const totalRevenue = pricePerUnit * quantity;
      const newBag = prev.bag
        .map(item => item.name === drugName ? { ...item, qty: item.qty - quantity } : item)
        .filter(item => item.qty > 0);
      const wantedIncrease = Math.floor(quantity / 15) + (Math.random() > 0.8 ? 1 : 0);
      const prevStats = prev.stats ?? {};
      const next = {
        ...prev,
        cash: prev.cash + totalRevenue,
        bag: newBag,
        wantedLevel: Math.min(5, prev.wantedLevel + wantedIncrease),
        stats: {
          ...prevStats,
          totalProfit: (prevStats.totalProfit ?? 0) + totalRevenue,
          biggestTrade: Math.max(prevStats.biggestTrade ?? 0, totalRevenue),
          drugsTraded: (prevStats.drugsTraded ?? 0) + quantity,
        },
      };

      const newAchievements = checkNewAchievements(next);
      if (newAchievements.length > 0) {
        return {
          ...next,
          unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
          pendingAchievement: next.pendingAchievement ?? newAchievements[0],
        };
      }
      return next;
    });
  }

  function dumpBag() {
    setGame(prev => ({ ...prev, bag: [] }));
  }

  // ── Loan Shark ────────────────────────────────────────────────────────────
  function takeLoan(amount) {
    const amt = Math.max(0, Math.min(amount, 5000));
    setGame(prev => ({ ...prev, cash: prev.cash + amt, debt: prev.debt + amt }));
  }

  function payLoan(amount) {
    const amt = Math.min(amount, game.cash, game.debt);
    if (amt < 1) throw new Error('Not enough cash to pay loan.');
    setGame(prev => {
      const next = { ...prev, cash: prev.cash - amt, debt: Math.max(0, prev.debt - amt) };
      const newAchievements = checkNewAchievements(next);
      if (newAchievements.length > 0) {
        return {
          ...next,
          unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
          pendingAchievement: next.pendingAchievement ?? newAchievements[0],
        };
      }
      return next;
    });
  }

  // ── Police Encounter ──────────────────────────────────────────────────────
  function resolveEncounter(choice) {
    setGame(prev => {
      const enc = prev.pendingEncounter;
      if (!enc) return prev;

      if (choice === 'pay') {
        return {
          ...prev,
          cash: Math.max(0, prev.cash - enc.fine),
          wantedLevel: Math.max(0, prev.wantedLevel - 1),
          pendingEncounter: null,
        };
      }

      if (choice === 'run') {
        const escapeChance = 0.4 + prev.crew * 0.1;
        const escaped = Math.random() < escapeChance;
        if (escaped) {
          return { ...prev, pendingEncounter: null };
        }
        const newBag = prev.bag
          .map(item => ({ ...item, qty: Math.floor(item.qty * 0.75) }))
          .filter(i => i.qty > 0);
        const prevStats = prev.stats ?? {};
        return {
          ...prev,
          bag: newBag,
          wantedLevel: Math.min(5, prev.wantedLevel + 1),
          pendingEncounter: null,
          stats: { ...prevStats, timesBusted: (prevStats.timesBusted ?? 0) + 1 },
        };
      }

      if (choice === 'dump') {
        return {
          ...prev,
          bag: [],
          wantedLevel: Math.max(0, prev.wantedLevel - 2),
          pendingEncounter: null,
        };
      }

      return prev;
    });
  }

  // ── Crew ─────────────────────────────────────────────────────────────────
  const HIRE_COST = 800;
  const BAG_BONUS = 15;
  const MAX_CREW  = 8;

  function hireCrew(count = 1) {
    const total = HIRE_COST * count;
    if (game.cash < total) throw new Error(`Need $${total.toLocaleString()} to hire ${count} member${count > 1 ? 's' : ''}.`);
    if (game.crew + count > MAX_CREW) throw new Error(`Max crew size is ${MAX_CREW}.`);
    setGame(prev => {
      const next = {
        ...prev,
        cash: prev.cash - total,
        crew: prev.crew + count,
        bagCapacity: prev.bagCapacity + count * BAG_BONUS,
      };
      const newAchievements = checkNewAchievements(next);
      if (newAchievements.length > 0) {
        return {
          ...next,
          unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
          pendingAchievement: next.pendingAchievement ?? newAchievements[0],
        };
      }
      return next;
    });
  }

  function fireCrew(count = 1) {
    if (game.crew < count) throw new Error('Not enough crew to release.');
    setGame(prev => ({
      ...prev,
      crew: prev.crew - count,
      bagCapacity: Math.max(100, prev.bagCapacity - count * BAG_BONUS),
    }));
  }

  function dismissAchievement() {
    setGame(prev => ({ ...prev, pendingAchievement: null }));
  }

  function markTutorialSeen() {
    setGame(prev => ({ ...prev, tutorialSeen: true }));
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetGame() {
    setGame(createInitialState());
  }

  return (
    <GameContext.Provider value={{
      game, updateGame,
      travel, buyItem, sellItem, dumpBag,
      takeLoan, payLoan,
      hireCrew, fireCrew,
      resolveEncounter,
      dismissAchievement, markTutorialSeen,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
