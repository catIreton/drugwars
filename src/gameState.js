import { generateEventCalendar } from './data/events';
import { initialStockLevels } from './data/drugs';

export const SESSION_KEY = 'drugwars_game';
export const SCORES_KEY  = 'drugwars_scores';

export const INITIAL_STATE = {
  day: 1,
  cash: 2000,
  debt: 5000,
  prestige: 0,
  crew: 0,
  wantedLevel: 0,
  weather: 'Sunny',
  location: 'Downtown',
  locationSrc: null,
  difficulty: 'normal',         // 'easy' | 'normal' | 'hard'
  bag: [
    { id: 'weed',  name: 'Weed',  qty: 10, avgCost: 200, grade: 'standard', bagKey: 'weed_standard'  },
    { id: 'speed', name: 'Speed', qty: 5,  avgCost: 300, grade: 'standard', bagKey: 'speed_standard' },
  ],
  bagCapacity: 100,
  bagUpgradesUsed: 0,
  priceMultipliers: {},
  eventCalendar: {},
  activeEventEffects: {},
  todayEvent: null,
  stockLevels: {},
  bankrupted: false,
  pendingEncounter: null,
  items: [],
  scannerActive: false,
  bulkImportCooldown: 0,
  stats: {
    totalProfit: 0,
    biggestTrade: 0,
    drugsTraded: 0,
    timesBusted: 0,
  },
  priceHistory: {},
  unlockedAchievements: [],
  pendingAchievement: null,
  tutorialSeen: false,
  rivals: {},               // { [location]: { level: 0–4, lastVisitDay: 0 } }
  flashDeals: {},           // { [location]: { [drugId]: { type, mult, expiresDay } } }
  tipOffCooldown: 0,
  locationHeatBonus: {},    // { [location]: { amount, expiresDay } }
  surveillanceScores: {},   // { [location]: number 0–5 } — triggers undercover sting at 5
  deaHeat: 0,               // 0–5 federal heat; DEA raid fires when maxed
  pendingRetaliation: null, // { type: 'stash_robbed'|'crew_injured'|'cash_hit' } — rival payback next travel
  rivalAlliances: {},       // { [loc]: partnerLoc } — mutual pairs formed at day 30+
  gangWars: {},             // { [location]: endDay } — active 2-day turf war
  wantedPosterActive: false,// recognized by vendors even after heat drops (3-day cooloff)
  wantedPosterCooloffStart: null,
  snitchLeaked: null,       // location snitch tipped off; guaranteed encounter on arrival
  snitchEndDay: 0,
  layLowCooldown: 0,
  lastTakedown: null,       // { location, day } — ticker headline for 2 days
};

export function createInitialState(difficulty = 'normal') {
  return {
    ...INITIAL_STATE,
    difficulty,
    eventCalendar: generateEventCalendar(60),
    stockLevels: initialStockLevels(),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return INITIAL_STATE;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load game state from storage, using defaults:', error);
    return INITIAL_STATE;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state to storage:', error);
  }
}

export function loadHighScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHighScore(entry) {
  try {
    const scores = loadHighScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 5)));
  } catch (e) {
    console.error('Failed to save high score:', e);
  }
}
