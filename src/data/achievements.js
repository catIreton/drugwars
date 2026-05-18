export const ACHIEVEMENTS = [
  {
    id: 'first_10k',
    label: 'First $10K',
    description: 'Cash on hand reached $10,000',
    emoji: '💰',
    check: (game) => game.cash >= 10000,
  },
  {
    id: 'big_trade',
    label: 'Whale',
    description: 'Single trade worth $5,000+',
    emoji: '🐋',
    check: (game) => (game.stats?.biggestTrade ?? 0) >= 5000,
  },
  {
    id: 'survived_30',
    label: 'Half-Timer',
    description: 'Survived 30 days on the streets',
    emoji: '📅',
    check: (game) => game.day >= 30,
  },
  {
    id: 'never_busted',
    label: 'Ghost',
    description: 'Reached day 30 without a single bust',
    emoji: '👻',
    check: (game) => game.day >= 30 && (game.stats?.timesBusted ?? 0) === 0,
  },
  {
    id: 'full_crew',
    label: 'Squad Up',
    description: 'Hired a full crew of 8',
    emoji: '👥',
    check: (game) => game.crew >= 8,
  },
  {
    id: 'clear_debt',
    label: 'Debt Free',
    description: 'Paid off all debt',
    emoji: '🧾',
    check: (game) => game.debt === 0,
  },
  {
    id: 'high_roller',
    label: 'High Roller',
    description: 'Traded 500+ units total',
    emoji: '🎲',
    check: (game) => (game.stats?.drugsTraded ?? 0) >= 500,
  },
];

export function checkNewAchievements(game) {
  const unlocked = new Set(game.unlockedAchievements ?? []);
  return ACHIEVEMENTS.filter(a => !unlocked.has(a.id) && a.check(game));
}
