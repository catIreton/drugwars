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

  return (
    <GameContext.Provider value={{ game, updateGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
