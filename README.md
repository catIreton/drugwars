# Drug Wars 2026: KC Edition

A Kansas City-themed remake of the classic 1984 drug trading game, built with React and MUI.

Play the streets of KC — buy low, sell high, dodge the heat, and cash out before day 60.

**Live demo:** [cat-ireton.github.io/drugwars](https://cat-ireton.github.io/drugwars)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Create React App |
| UI | Material UI v5 (`@mui/material`, `@mui/icons-material`) |
| State | React Context + sessionStorage persistence |
| Map | Google Maps JavaScript API |
| Deploy | GitHub Pages (`gh-pages`) |
| Tests | Jest + `@testing-library/react` |

---

## Getting Started

```bash
npm install
npm start        # dev server at localhost:3000
npm test         # unit tests
npm run build    # production bundle
npm run deploy   # push to GitHub Pages
```

> **Windows hot reload:** `WATCHPACK_POLLING=true` is set in `.env` — no manual restarts needed.

---

## Project Layout

```
src/
  components/
    main/
      actions/      # Terminal-style action panel (Dump, Loan, Finances, Crew)
      bag/          # "The Case" — briefcase-themed inventory panel
      events/       # Daily Events chyron ticker
      market/       # Drug market table with buy/sell dialog + price history arrows
      status/       # Status card (cash, debt, prestige, crew, heat, weather) with flash animations
      travel/       # Google Maps travel panel + CurrentLoc image
    GameContext.js  # Global game state + all game actions
    GameOver.js     # End-game results screen with stat summary
    EncounterModal.js # Police encounter dialog
    AchievementToast.js # Achievement unlock notification
    Tutorial.js     # First-run onboarding overlay
  data/
    drugs.js        # Drug definitions, location markets, dynamic price functions
    events.js       # KC event pool, calendar generator, price multiplier generator
    achievements.js # Achievement definitions and unlock checks
  utils/
    sounds.js       # Web Audio API synthesized sound effects
  gameState.js      # INITIAL_STATE, createInitialState, sessionStorage load/save
public/
  images/           # KC neighborhood photos
  favicon.svg       # Split pill icon (purple/gold)
```

---

## What's Working (Phase 1)

### Core Loop
- 60-day game with day counter; travel advances the day
- Game over screen at day 60 — scores cash − debt + prestige bonus; win/loss outcome
- Bankruptcy game over if debt exceeds $30,000 with < $100 cash

### Market
- Buy and sell 6 drugs with quantity input and full validation
- Prices randomize ±45% on every location visit
- Wanted level penalizes prices at heat 3+ (up to 40% worse at level 5)
- Drug stock depletes as you buy; partially restores on revisit
- "OUT" badge and disabled buy button when stock hits zero
- Heat level indicator with color-coded flame icons per location
- Price history arrows (↑/↓/—) comparing current price to last visit
- Buy dialog: free-type quantity input, MAX button (capped by stock/cash/bag space), bag space preview

### Economy
- 5% compound daily interest on debt — applied on every travel
- Take loans (up to $5,000/loan) and pay them back via terminal commands
- Finances modal: cash, debt, daily interest, net worth, projected debt at game end

### Risk & Law
- Buys and sells raise wanted level; natural -1 decay per day traveled
- Police encounters at heat level 3+: pay fine / run (crew-boosted escape %) / dump bag

### Events & World
- 18 KC-flavored events (busts, spikes, DEA sweeps, fire sales) pre-generated each run
- Chyron ticker shows today's event, upcoming events, and heat warnings
- Weather randomizes each travel day

### Crew System
- Hire crew members ($800/member, max 8); each adds +15 bag capacity
- Crew upkeep: $150/member/day deducted on every travel
- Crew perks: 2 crew = 5% buy discount, 4 = 10%, 6 = 15%; escape chance boost

### Bag
- Briefcase-styled inventory showing all held drugs
- Capacity bar (turns red at 80%+ full)
- Per-item P&L: weighted average cost paid vs current sell price, total profit/loss badge per drug
- `use_item` terminal command only appears when store-bought consumables are held (separate from drugs)

### UI & Polish
- Dark neon title card, terminal-green Actions panel, briefcase-styled Bag
- Colored emoji drug badges; retro weather and heat icons in status bar
- Police encounter modal with animated red/blue flash
- Google Maps travel panel with color-coded KC neighborhood markers
- Cash/debt flash animations (green on gain, red on loss)
- Sound effects: buy/sell chimes, police siren on encounter, game over sting, achievement fanfare (Web Audio, no files)
- Price history arrows in market table
- Stat tracking: total profit, biggest single trade, drugs traded, times busted
- Achievement badges: 7 milestones with toast notifications
- Tutorial/first-run overlay for new players
- Responsive mobile layout (stacks vertically on small screens)

---

## Phase 2 — Future Development

### Persistence & Auth
- [ ] **Firebase Auth** — sign in / sign up (infrastructure scaffolded, not wired)
- [ ] **Cloud save** — persist game state to Firebase Realtime Database instead of sessionStorage
- [ ] **Leaderboard** — top 10 final scores per user; visible at game over
- [ ] **Multiple save slots** — 2–3 simultaneous runs per account

### Deeper Gameplay
- [ ] **Bag upgrades** — spend cash to increase bag capacity (crew unlock or Store purchase)
- [ ] **Rival dealers** — NPC competitors in each neighborhood driving prices and heat
- [ ] **Time-limited deals** — flash prices lasting only 1–2 days before expiring
- [ ] **Prestige actions** — earn prestige by pulling off big trades or evading police; prestige unlocks perks
- [ ] **Tip-off mechanic** — snitch on a location to reduce your own heat at a cost
- [ ] **Difficulty levels** — Easy / Medium / Hard with different interest rates and police aggressiveness

### Content
- [ ] **More KC events** — expand pool beyond 18; weight events by location and season
- [ ] **Neighborhood flavor text** — location-specific ticker lines based on current heat / events
- [ ] **Additional drugs** — Hash, Ecstasy, Pharmacols (legal substitute, lower risk/reward)

---

*React 19 + MUI 5 | Kansas City, MO | May 2026*
