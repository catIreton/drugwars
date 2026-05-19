import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadState, saveState, createInitialState } from '../gameState';
import { generatePriceMultipliers, WEATHER_OPTIONS } from '../data/events';
import { LOCATION_MARKETS, getMarketPrice } from '../data/drugs';
import { checkNewAchievements } from '../data/achievements';
import { ITEM_CATALOG } from '../data/items';

export const DIFF_CONFIG = {
  easy:   { rate: 0.03, loanCap: 8000, encounterThreshold: 4, maxRivalLevel: 1 },
  normal: { rate: 0.05, loanCap: 5000, encounterThreshold: 3, maxRivalLevel: 2 },
  hard:   { rate: 0.07, loanCap: 3000, encounterThreshold: 2, maxRivalLevel: 3 },
};

function withAchievements(next) {
  const newAchievements = checkNewAchievements(next);
  if (newAchievements.length === 0) return next;
  return {
    ...next,
    unlockedAchievements: [...(next.unlockedAchievements ?? []), ...newAchievements.map(a => a.id)],
    pendingAchievement: next.pendingAchievement ?? newAchievements[0],
  };
}

// Migrate a loaded save to add any missing fields introduced in later versions.
function migrateSave(saved) {
  let state = saved;

  // Suppress tutorial for returning players
  if (state.day > 1 && !state.tutorialSeen) {
    state = { ...state, tutorialSeen: true };
  }

  // Add grade/bagKey to bag items that predate the grade system
  if (state.bag?.some(item => !item.bagKey)) {
    state = {
      ...state,
      bag: state.bag.map(item => ({
        ...item,
        grade: item.grade ?? 'standard',
        bagKey: item.bagKey ?? `${item.id}_standard`,
      })),
    };
  }

  // Add stock levels for any new locations not in the save
  if (state.stockLevels) {
    const missing = Object.keys(LOCATION_MARKETS).filter(loc => !state.stockLevels[loc]);
    if (missing.length > 0) {
      const extra = Object.fromEntries(
        missing.map(loc => [
          loc,
          Object.fromEntries(Object.entries(LOCATION_MARKETS[loc].drugs).map(([id, d]) => [id, d.qty])),
        ])
      );
      state = { ...state, stockLevels: { ...state.stockLevels, ...extra } };
    }
  }

  // Add missing top-level fields
  if (state.scannerActive === undefined) state = { ...state, scannerActive: false };
  if (state.bulkImportCooldown === undefined) state = { ...state, bulkImportCooldown: 0 };

  return state;
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [game, setGame] = useState(() => {
    const saved = loadState();
    if (!saved.stockLevels || Object.keys(saved.stockLevels).length === 0) {
      return createInitialState();
    }
    return migrateSave(saved);
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
    const newDay  = game.day + 1;
    const diff    = DIFF_CONFIG[game.difficulty ?? 'normal'];

    const newDebt    = Math.round(game.debt * (1 + diff.rate));
    const bankrupted = newDebt > 30000 && game.cash < 100;

    const newPriceMultipliers = {
      ...game.priceMultipliers,
      [locationName]: generatePriceMultipliers(),
    };

    const todayEvent         = game.eventCalendar[newDay] ?? null;
    const activeEventEffects = todayEvent?.effects ?? {};

    // Partially restore stock at destination
    const marketDrugs    = LOCATION_MARKETS[locationName]?.drugs ?? {};
    const locStock       = game.stockLevels[locationName] ?? {};
    const refreshedStock = Object.fromEntries(
      Object.entries(marketDrugs).map(([id, d]) => {
        const current = locStock[id] ?? d.qty;
        return [id, Math.min(d.qty, Math.round(current + (d.qty - current) * 0.5))];
      })
    );

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

    const newWeather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];

    const heatDelta = activeEventEffects.heat ?? 0;
    const newWanted = Math.max(0, Math.min(5, game.wantedLevel - 1 + heatDelta));

    // ── Gang turf wars: escalate rival level on revisits, decay on absence ──
    const prevRival      = (game.rivals ?? {})[locationName] ?? { level: 0, lastVisitDay: 0 };
    const daysSinceVisit = prevRival.lastVisitDay > 0 ? newDay - prevRival.lastVisitDay : Infinity;
    let newRivalLevel;
    if (!isFinite(daysSinceVisit)) {
      newRivalLevel = Math.floor(Math.random() * (diff.maxRivalLevel + 1));
    } else if (daysSinceVisit <= 2) {
      newRivalLevel = Math.min(4, prevRival.level + 1);
    } else {
      const decay = Math.floor((daysSinceVisit - 1) / 2);
      newRivalLevel = Math.max(0, prevRival.level - decay);
      if (Math.random() < 0.3) newRivalLevel = Math.min(diff.maxRivalLevel, newRivalLevel + 1);
    }

    // Flash deals: expire old, maybe add new
    const currentFlash = game.flashDeals ?? {};
    const validFlashDeals = {};
    for (const [loc, drugs] of Object.entries(currentFlash)) {
      const valid = Object.fromEntries(
        Object.entries(drugs).filter(([, d]) => d.expiresDay >= newDay)
      );
      if (Object.keys(valid).length > 0) validFlashDeals[loc] = valid;
    }
    if (Math.random() < 0.25) {
      const drugIds = Object.keys(marketDrugs);
      if (drugIds.length > 0) {
        const dealDrug   = drugIds[Math.floor(Math.random() * drugIds.length)];
        const isBuyDeal  = Math.random() > 0.5;
        const mult       = isBuyDeal
          ? Math.round((0.4 + Math.random() * 0.3) * 100) / 100
          : Math.round((1.5 + Math.random() * 0.5) * 100) / 100;
        const expiresDay = newDay + 1 + Math.floor(Math.random() * 2);
        validFlashDeals[locationName] = {
          ...(validFlashDeals[locationName] ?? {}),
          [dealDrug]: { type: isBuyDeal ? 'buy' : 'sell', mult, expiresDay },
        };
      }
    }

    const cleanHeatBonus = Object.fromEntries(
      Object.entries(game.locationHeatBonus ?? {}).filter(([, v]) => v.expiresDay >= newDay)
    );

    const locBonus       = cleanHeatBonus[locationName]?.amount ?? 0;
    const effectiveHeat  = Math.min(5, game.wantedLevel + locBonus);
    const threshold      = diff.encounterThreshold;
    const encounterChance = Math.max(0, (effectiveHeat - threshold + 1) * 0.22);
    const hasEncounter   = effectiveHeat >= threshold && Math.random() < encounterChance;
    const fine           = hasEncounter ? Math.round(effectiveHeat * 400 + Math.random() * 400) : 0;

    const upkeep         = game.crew * 150;
    const dayPrestigeGain = newDay % 10 === 0 ? 5 : 0;

    setGame(prev => {
      const snapshotOptions = {
        dailyMultipliers: prev.priceMultipliers?.[locationName] ?? {},
        eventEffects: activeEventEffects,
        wantedLevel: prev.wantedLevel,
        crew: prev.crew,
        prestige: prev.prestige ?? 0,
        rivalLevel: newRivalLevel,
        flashDeals: validFlashDeals[locationName] ?? {},
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
        rivals: {
          ...(prev.rivals ?? {}),
          [locationName]: { level: newRivalLevel, lastVisitDay: newDay },
        },
        flashDeals: validFlashDeals,
        tipOffCooldown: Math.max(0, (prev.tipOffCooldown ?? 0) - 1),
        locationHeatBonus: cleanHeatBonus,
        prestige: (prev.prestige ?? 0) + dayPrestigeGain,
        scannerActive: false,
        bulkImportCooldown: Math.max(0, (prev.bulkImportCooldown ?? 0) - 1),
      };

      return withAchievements(next);
    });
  }

  // ── Buy / Sell ────────────────────────────────────────────────────────────
  function buyItem(drugId, drugName, quantity, pricePerUnit, availableQty, grade = 'standard') {
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
      const bagKey       = `${drugId}_${grade}`;
      // Fall back to name lookup so tests using arbitrary IDs still work
      const existingItem = prev.bag.find(item => item.bagKey === bagKey)
        ?? prev.bag.find(item => item.name === drugName);
      const effectiveKey = existingItem?.bagKey ?? bagKey;
      const newBag = existingItem
        ? prev.bag.map(item => (item.bagKey ?? item.name) === (effectiveKey ?? drugName) ? {
            ...item,
            qty: item.qty + quantity,
            avgCost: Math.round(
              (item.qty * (item.avgCost ?? pricePerUnit) + quantity * pricePerUnit) / (item.qty + quantity)
            ),
          } : item)
        : [...prev.bag, { id: drugId, name: drugName, qty: quantity, avgCost: pricePerUnit, grade, bagKey }];

      const wantedIncrease = Math.floor(quantity / 10) + (Math.random() > 0.7 ? 1 : 0);
      const curStock = prev.stockLevels[prev.location]?.[drugId] ?? 0;

      const next = {
        ...prev,
        cash: prev.cash - totalCost,
        bag: newBag,
        wantedLevel: Math.min(5, prev.wantedLevel + wantedIncrease),
        stockLevels: {
          ...prev.stockLevels,
          [prev.location]: {
            ...prev.stockLevels[prev.location],
            [drugId]: Math.max(0, curStock - quantity),
          },
        },
        stats: {
          ...(prev.stats ?? {}),
          drugsTraded: ((prev.stats?.drugsTraded) ?? 0) + quantity,
        },
      };

      return withAchievements(next);
    });
  }

  function sellItem(drugId, drugName, quantity, pricePerUnit, grade = 'standard') {
    const bagKey  = `${drugId}_${grade}`;
    // Primary: exact bagKey match; fallback: name match (for tests and legacy saves)
    const bagItem = game.bag.find(item => item.bagKey === bagKey)
      ?? game.bag.find(item => item.name === drugName);
    if (!bagItem || bagItem.qty < quantity) {
      throw new Error(`Don't have ${quantity}x ${drugName}. Have: ${bagItem?.qty || 0}`);
    }

    setGame(prev => {
      const totalRevenue   = pricePerUnit * quantity;
      const resolvedBagKey = bagItem.bagKey;
      const newBag         = prev.bag
        .map(item => item.bagKey === resolvedBagKey
          ? { ...item, qty: item.qty - quantity }
          : item)
        .filter(item => item.qty > 0);
      const wantedIncrease = Math.floor(quantity / 15) + (Math.random() > 0.8 ? 1 : 0);
      const prestigeGain   = totalRevenue >= 2000 ? 2 : 0;

      const next = {
        ...prev,
        cash: prev.cash + totalRevenue,
        bag: newBag,
        wantedLevel: Math.min(5, prev.wantedLevel + wantedIncrease),
        prestige: (prev.prestige ?? 0) + prestigeGain,
        stats: {
          ...(prev.stats ?? {}),
          totalProfit:  ((prev.stats?.totalProfit)  ?? 0) + totalRevenue,
          biggestTrade: Math.max((prev.stats?.biggestTrade) ?? 0, totalRevenue),
          drugsTraded:  ((prev.stats?.drugsTraded)  ?? 0) + quantity,
        },
      };

      return withAchievements(next);
    });
  }

  function dumpBag() {
    setGame(prev => ({ ...prev, bag: [] }));
  }

  // ── Loan Shark ────────────────────────────────────────────────────────────
  function takeLoan(amount) {
    const cap = DIFF_CONFIG[game.difficulty ?? 'normal'].loanCap;
    const amt = Math.max(0, Math.min(amount, cap));
    setGame(prev => ({ ...prev, cash: prev.cash + amt, debt: prev.debt + amt }));
  }

  function payLoan(amount) {
    const amt = Math.min(amount, game.cash, game.debt);
    if (amt < 1) throw new Error('Not enough cash to pay loan.');
    setGame(prev => withAchievements({
      ...prev,
      cash: prev.cash - amt,
      debt: Math.max(0, prev.debt - amt),
    }));
  }

  // ── Police Encounter ──────────────────────────────────────────────────────
  function resolveEncounter(choice) {
    setGame(prev => {
      const enc = prev.pendingEncounter;
      if (!enc) return prev;

      if (choice === 'pay') {
        return withAchievements({
          ...prev,
          cash: Math.max(0, prev.cash - enc.fine),
          wantedLevel: Math.max(0, prev.wantedLevel - 1),
          pendingEncounter: null,
        });
      }

      if (choice === 'bribe') {
        const bribeAmount = enc.fine * 2;
        if (prev.cash < bribeAmount) return prev;
        return withAchievements({
          ...prev,
          cash: prev.cash - bribeAmount,
          wantedLevel: Math.max(0, prev.wantedLevel - 2),
          pendingEncounter: null,
        });
      }

      if (choice === 'run') {
        const escapeChance = 0.4 + prev.crew * 0.1;
        const escaped      = Math.random() < escapeChance;
        if (escaped) {
          return withAchievements({
            ...prev,
            pendingEncounter: null,
            prestige: (prev.prestige ?? 0) + 5,
          });
        }
        const newBag = prev.bag
          .map(item => ({ ...item, qty: Math.floor(item.qty * 0.75) }))
          .filter(i => i.qty > 0);
        return withAchievements({
          ...prev,
          bag: newBag,
          wantedLevel: Math.min(5, prev.wantedLevel + 1),
          pendingEncounter: null,
          stats: { ...(prev.stats ?? {}), timesBusted: ((prev.stats?.timesBusted) ?? 0) + 1 },
        });
      }

      if (choice === 'dump') {
        return withAchievements({
          ...prev,
          bag: [],
          wantedLevel: Math.max(0, prev.wantedLevel - 2),
          pendingEncounter: null,
        });
      }

      return prev;
    });
  }

  // ── Crew ─────────────────────────────────────────────────────────────────
  const HIRE_COST  = 800;
  const BAG_BONUS  = 15;
  const MAX_CREW   = 8;

  function hireCrew(count = 1) {
    const total = HIRE_COST * count;
    if (game.cash < total) throw new Error(`Need $${total.toLocaleString()} to hire ${count} member${count > 1 ? 's' : ''}.`);
    if (game.crew + count > MAX_CREW) throw new Error(`Max crew size is ${MAX_CREW}.`);
    setGame(prev => withAchievements({
      ...prev,
      cash: prev.cash - total,
      crew: prev.crew + count,
      bagCapacity: prev.bagCapacity + count * BAG_BONUS,
    }));
  }

  function fireCrew(count = 1) {
    if (game.crew < count) throw new Error('Not enough crew to release.');
    setGame(prev => ({
      ...prev,
      crew: prev.crew - count,
      bagCapacity: Math.max(100, prev.bagCapacity - count * BAG_BONUS),
    }));
  }

  // ── Bag Upgrades ──────────────────────────────────────────────────────────
  const BAG_UPGRADE_COST  = 2000;
  const BAG_UPGRADE_SLOTS = 25;
  const MAX_BAG_UPGRADES  = 4;

  function upgradeBag() {
    const used = game.bagUpgradesUsed ?? 0;
    if (game.cash < BAG_UPGRADE_COST) throw new Error(`Need $${BAG_UPGRADE_COST.toLocaleString()} for bag upgrade.`);
    if (used >= MAX_BAG_UPGRADES) throw new Error('Maximum bag upgrades reached (4 of 4).');
    setGame(prev => ({
      ...prev,
      cash: prev.cash - BAG_UPGRADE_COST,
      bagCapacity: prev.bagCapacity + BAG_UPGRADE_SLOTS,
      bagUpgradesUsed: (prev.bagUpgradesUsed ?? 0) + 1,
    }));
  }

  // ── Tip-Off ───────────────────────────────────────────────────────────────
  const TIP_OFF_COST     = 500;
  const TIP_OFF_COOLDOWN = 5;

  function tipOff() {
    if ((game.tipOffCooldown ?? 0) > 0) {
      throw new Error(`Tip-off on cooldown — ${game.tipOffCooldown} more days.`);
    }
    if (game.cash < TIP_OFF_COST) {
      throw new Error(`Need $${TIP_OFF_COST} to pay the informant.`);
    }
    const location = game.location;
    setGame(prev => ({
      ...prev,
      cash: prev.cash - TIP_OFF_COST,
      wantedLevel: Math.max(0, prev.wantedLevel - 2),
      tipOffCooldown: TIP_OFF_COOLDOWN,
      locationHeatBonus: {
        ...(prev.locationHeatBonus ?? {}),
        [location]: { amount: 2, expiresDay: prev.day + 3 },
      },
    }));
  }

  // ── Difficulty ────────────────────────────────────────────────────────────
  function setDifficulty(level) {
    if (!DIFF_CONFIG[level]) throw new Error(`Unknown difficulty: ${level}`);
    if (game.day > 1) throw new Error('Difficulty can only be changed before your first move.');
    setGame(prev => ({ ...prev, difficulty: level }));
  }

  // ── Item Consumables ─────────────────────────────────────────────────────
  function buyConsumable(itemId) {
    const catalog = ITEM_CATALOG.find(i => i.id === itemId);
    if (!catalog) throw new Error(`Unknown item: ${itemId}`);
    if (game.cash < catalog.price) throw new Error(`Need $${catalog.price.toLocaleString()} to buy ${catalog.name}.`);
    const existing = game.items?.find(i => i.id === itemId);
    if ((existing?.qty ?? 0) >= catalog.maxStack) {
      throw new Error(`Already have max (${catalog.maxStack}x) ${catalog.name}.`);
    }
    setGame(prev => {
      const existingInPrev = prev.items?.find(i => i.id === itemId);
      const newItems = existingInPrev
        ? prev.items.map(i => i.id === itemId ? { ...i, qty: i.qty + 1 } : i)
        : [...(prev.items ?? []), { id: itemId, name: catalog.name, emoji: catalog.emoji, qty: 1 }];
      return { ...prev, cash: prev.cash - catalog.price, items: newItems };
    });
  }

  function useItem(itemId) {
    const itemEntry = game.items?.find(i => i.id === itemId);
    if (!itemEntry || itemEntry.qty < 1) throw new Error(`Don't have that item.`);
    setGame(prev => {
      const newItems = prev.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
      let update = { items: newItems };
      if (itemId === 'burner_phone') {
        update.wantedLevel = Math.max(0, prev.wantedLevel - 1);
      } else if (itemId === 'police_scanner') {
        update.scannerActive = true;
      } else if (itemId === 'stash_house') {
        update.wantedLevel    = Math.max(0, prev.wantedLevel - 2);
        update.pendingEncounter = null;
      }
      return { ...prev, ...update };
    });
  }

  // ── Negotiate (pure calc — no state mutation) ────────────────────────────
  function negotiate(currentPrice, isBuy) {
    const success = Math.random() > 0.45;
    if (success) {
      const pct = 0.08 + Math.random() * 0.10;
      const newPrice = isBuy
        ? Math.round(currentPrice * (1 - pct))
        : Math.round(currentPrice * (1 + pct));
      return { success: true, newPrice, pct: Math.round(pct * 100) };
    } else {
      const newPrice = isBuy
        ? Math.round(currentPrice * 1.05)
        : Math.round(currentPrice * 0.95);
      return { success: false, newPrice };
    }
  }

  // ── Bulk Import ───────────────────────────────────────────────────────────
  const BULK_DISCOUNT   = 0.70;
  const BULK_WANTED_HIT = 2;
  const BULK_COOLDOWN   = 3;

  function bulkImport(drugId, drugName, quantity, basePrice, availableQty) {
    if ((game.bulkImportCooldown ?? 0) > 0) {
      throw new Error(`Bulk import on cooldown — ${game.bulkImportCooldown} more days.`);
    }
    const pricePerUnit = Math.round(basePrice * BULK_DISCOUNT);
    const totalCost    = pricePerUnit * quantity;
    if (game.cash < totalCost) {
      throw new Error(`Insufficient cash. Need: $${totalCost.toLocaleString()}`);
    }
    const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);
    if (bagUsed + quantity > game.bagCapacity) {
      throw new Error(`Bag capacity exceeded. Space: ${game.bagCapacity - bagUsed}`);
    }
    if (quantity > availableQty) {
      throw new Error(`Only ${availableQty} units available.`);
    }

    setGame(prev => {
      const grade    = 'standard';
      const bagKey   = `${drugId}_${grade}`;
      const existing = prev.bag.find(i => i.bagKey === bagKey);
      const newBag   = existing
        ? prev.bag.map(i => i.bagKey === bagKey ? {
            ...i,
            qty: i.qty + quantity,
            avgCost: Math.round(
              (i.qty * (i.avgCost ?? pricePerUnit) + quantity * pricePerUnit) / (i.qty + quantity)
            ),
          } : i)
        : [...prev.bag, { id: drugId, name: drugName, qty: quantity, avgCost: pricePerUnit, grade, bagKey }];

      const curStock = prev.stockLevels[prev.location]?.[drugId] ?? 0;
      return {
        ...prev,
        cash: prev.cash - totalCost,
        bag: newBag,
        wantedLevel: Math.min(5, prev.wantedLevel + BULK_WANTED_HIT),
        bulkImportCooldown: BULK_COOLDOWN,
        stockLevels: {
          ...prev.stockLevels,
          [prev.location]: {
            ...prev.stockLevels[prev.location],
            [drugId]: Math.max(0, curStock - quantity),
          },
        },
        stats: {
          ...(prev.stats ?? {}),
          drugsTraded: ((prev.stats?.drugsTraded) ?? 0) + quantity,
        },
      };
    });
  }

  // ── Misc ──────────────────────────────────────────────────────────────────
  function dismissAchievement() {
    setGame(prev => ({ ...prev, pendingAchievement: null }));
  }

  function markTutorialSeen() {
    setGame(prev => ({ ...prev, tutorialSeen: true }));
  }

  function resetGame(difficulty) {
    setGame(createInitialState(difficulty ?? game.difficulty ?? 'normal'));
  }

  return (
    <GameContext.Provider value={{
      game, updateGame,
      travel, buyItem, sellItem, dumpBag,
      takeLoan, payLoan,
      hireCrew, fireCrew,
      upgradeBag,
      tipOff,
      setDifficulty,
      resolveEncounter,
      buyConsumable, useItem,
      negotiate,
      bulkImport,
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
