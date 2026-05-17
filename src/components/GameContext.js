import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadState, saveState } from '../gameState';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Initialize state with a function to avoid calling loadState on every render
  const [game, setGame] = useState(() => loadState());
  const saveTimeoutRef = useRef(null);

  // Debounce saves to avoid excessive storage writes
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 1 second of no changes
    saveTimeoutRef.current = setTimeout(() => {
      try {
        saveState(game);
      } catch (error) {
        console.error('Failed to save game state:', error);
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [game]);

  function updateGame(updates) {
    setGame(prev => ({ ...prev, ...updates }));
  }

  function buyItem(drugId, drugName, quantity, pricePerUnit, availableQty) {
    setGame(prev => {
      // Validate quantity
      if (quantity < 1 || quantity > availableQty) {
        throw new Error(`Invalid quantity. Available: ${availableQty}`);
      }

      const totalCost = pricePerUnit * quantity;

      // Validate cash
      if (prev.cash < totalCost) {
        throw new Error(`Insufficient cash. Need: $${totalCost}, Have: $${prev.cash}`);
      }

      // Calculate current bag usage
      const currentBagUsage = prev.bag.reduce((sum, item) => sum + item.qty, 0);
      
      // Validate bag capacity
      if (currentBagUsage + quantity > prev.bagCapacity) {
        throw new Error(`Bag capacity exceeded. Space available: ${prev.bagCapacity - currentBagUsage}`);
      }

      // Check if drug already in bag
      const existingItem = prev.bag.find(item => item.name === drugName);
      let newBag;

      if (existingItem) {
        newBag = prev.bag.map(item =>
          item.name === drugName 
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      } else {
        newBag = [...prev.bag, { name: drugName, qty: quantity }];
      }

      // Increase wanted level slightly based on transaction size
      const wantedLevelIncrease = Math.floor(quantity / 10) + (Math.random() > 0.7 ? 1 : 0);

      return {
        ...prev,
        cash: prev.cash - totalCost,
        bag: newBag,
        wantedLevel: prev.wantedLevel + wantedLevelIncrease,
      };
    });
  }

  function sellItem(drugId, drugName, quantity, pricePerUnit) {
    setGame(prev => {
      // Find item in bag
      const bagItem = prev.bag.find(item => item.name === drugName);
      
      if (!bagItem || bagItem.qty < quantity) {
        throw new Error(`Don't have ${quantity}x ${drugName}. Have: ${bagItem?.qty || 0}`);
      }

      const totalRevenue = pricePerUnit * quantity;

      // Remove or reduce item from bag
      const newBag = prev.bag
        .map(item =>
          item.name === drugName
            ? { ...item, qty: item.qty - quantity }
            : item
        )
        .filter(item => item.qty > 0); // Remove items with 0 qty

      // Increase wanted level slightly based on transaction size
      const wantedLevelIncrease = Math.floor(quantity / 15) + (Math.random() > 0.8 ? 1 : 0);

      return {
        ...prev,
        cash: prev.cash + totalRevenue,
        bag: newBag,
        wantedLevel: prev.wantedLevel + wantedLevelIncrease,
      };
    });
  }

  function dumpBag() {
    setGame(prev => ({
      ...prev,
      bag: [],
    }));
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
