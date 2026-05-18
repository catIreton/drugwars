import { generateEventCalendar } from './data/events';
import { initialStockLevels } from './data/drugs';

export const SESSION_KEY = 'drugwars_game';

// Static shape used by tests and as a base for createInitialState
export const INITIAL_STATE = {
  day: 1,
  cash: 2000,
  debt: 5000,
  prestige: 1,
  crew: 0,
  wantedLevel: 0,
  weather: 'Sunny',
  location: 'Downtown',
  locationSrc: null,
  bag: [
    { id: 'weed',  name: 'Weed',  qty: 10, avgCost: 200 },
    { id: 'speed', name: 'Speed', qty: 5,  avgCost: 300 },
  ],
  bagCapacity: 100,
  priceMultipliers: {},   // { [location]: { [drugId]: multiplier } }
  eventCalendar: {},      // { [day]: event }
  activeEventEffects: {}, // effects active today
  todayEvent: null,
  stockLevels: {},        // { [location]: { [drugId]: qty } }
  bankrupted: false,
  pendingEncounter: null, // { fine } | null
  items: [],             // consumables bought from the store: [{ id, name, emoji }]
  stats: {
    totalProfit: 0,
    biggestTrade: 0,
    drugsTraded: 0,
    timesBusted: 0,
  },
  priceHistory: {},        // { [location]: { [drugId]: lastPrice } }
  unlockedAchievements: [],
  pendingAchievement: null,
  tutorialSeen: false,
};

// Called at game start and on reset — generates fresh dynamic state
export function createInitialState() {
  return {
    ...INITIAL_STATE,
    eventCalendar: generateEventCalendar(60),
    stockLevels: initialStockLevels(),
  };
}

export function loadState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return INITIAL_STATE;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load game state from storage, using defaults:', error);
    return INITIAL_STATE;
  }
}

export function saveState(state) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state to storage:', error);
  }
}
