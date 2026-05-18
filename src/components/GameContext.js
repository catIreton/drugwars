import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadState, saveState } from '../gameState';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [game, setGame] = useState(() => loadState());
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        saveState(game);
      } catch (error) {
        console.error('Failed to save game state:', error);
      }
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [game]);

  function updateGame(updates) {
    if (typeof updates === 'function') {
      setGame(updates);
    } else {
      setGame(prev => ({ ...prev, ...updates }));
    }
  }

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
        ? prev.bag.map(item => item.name === drugName ? { ...item, qty: item.qty + quantity } : item)
        : [...prev.bag, { name: drugName, qty: quantity }];
      const wantedIncrease = Math.floor(quantity / 10) + (Math.random() > 0.7 ? 1 : 0);
      return { ...prev, cash: prev.cash - totalCost, bag: newBag, wantedLevel: prev.wantedLevel + wantedIncrease };
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
      return { ...prev, cash: prev.cash + totalRevenue, bag: newBag, wantedLevel: prev.wantedLevel + wantedIncrease };
    });
  }

  function dumpBag() {
    setGame(prev => ({ ...prev, bag: [] }));
  }

  return (
    <GameContext.Provider value={{ game, updateGame, buyItem, sellItem, dumpBag }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
