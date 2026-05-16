export const SESSION_KEY = 'drugwars_game';

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
    { name: 'Weed', qty: 10 },
    { name: 'Speed', qty: 5 },
  ],
  bagCapacity: 100,
};

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
