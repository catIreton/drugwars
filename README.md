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
npm test         # 22 unit tests
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
      actions/    # Terminal-style action panel (Dump, Loan, Store, Finances)
      bag/        # "The Case" — briefcase-themed inventory panel
      events/     # Daily Events chyron ticker
      knockoffs/  # Drug market table with buy/sell dialog
      status/     # Status card (cash, debt, prestige, crew, heat, weather)
      travel/     # Google Maps travel panel + CurrentLoc image
    GameContext.js  # Global game state, buyItem/sellItem/dumpBag
  data/
    drugs.js        # Drug definitions, location market data, price functions
  gameState.js      # INITIAL_STATE, sessionStorage load/save
public/
  images/           # KC neighborhood photos
  favicon.svg       # Split pill icon (purple/gold)
```

---

## What's Working

- **Market** — buy and sell all 6 drugs with quantity input and validation; colored emoji badges per drug; heat level indicator with flame icons
- **Bag** — "The Case" shows current inventory, capacity bar, dump action
- **Status card** — cash, debt, prestige stars, crew icons, 5-tier heat badges, retro weather icon
- **Travel** — Google Maps with color-coded neighborhood markers; clicking a pin updates the location image
- **Events ticker** — chyron-style scrolling news strip
- **Actions panel** — terminal-style green-text command interface; Dump is wired up
- **Persistence** — game state survives page refresh via sessionStorage
- **Unit tests** — 22 tests covering gameState I/O and all GameContext actions

---

## Roadmap

### Phase 1 — Core Game Loop
- [ ] **Game over / win screen** — at day 60, score = cash − debt + prestige bonus; show results
- [ ] **Day advance** — travel should consume a day and trigger market refresh

### Phase 2 — Dynamic Market
- [ ] **Price randomization on travel** — ±30–50% of base price per location visit
- [ ] **Price spike / fire sale events** — occasional 3× or 1/3 price event, shown in ticker
- [ ] **Out-of-stock display** — show "OUT OF STOCK" when qty reaches 0

### Phase 3 — Financial Mechanics
- [ ] **Debt interest** — compound daily (10%/day); currently tracked but never grows
- [ ] **Loan action** — borrow cash, increase debt
- [ ] **Finances screen** — breakdown of cash, debt, interest rate, projected payoff
- [ ] **Bankruptcy condition** — game over if debt exceeds threshold with no cash

### Phase 4 — Risk & Law Enforcement
- [ ] **Wanted level changes** — risky transactions raise heat; lying low reduces it
- [ ] **Police encounter events** — raids at high wanted level; outcome depends on crew size
- [ ] **Wanted level consequences** — price penalties at level 3–4; travel costs at level 5

### Phase 5 — Crew System
- [ ] **Crew recruitment** — hire via Store button; crew adds bag capacity and raid protection
- [ ] **Crew upkeep** — daily cash cost per crew member

### Phase 6 — Events & Calendar
- [ ] **Dynamic event calendar** — randomly assign events to days 1–60 at game start
- [ ] **Live ticker** — connect chyron to today's actual game events
- [ ] **Weather effects** — weather changes daily and affects travel / prices

### Phase 7 — Persistence & Auth
- [ ] **Firebase Auth** — sign in / sign up (infrastructure exists, not wired)
- [ ] **Cloud save** — persist game state to Firebase instead of sessionStorage
- [ ] **Leaderboard** — top 10 final scores

### Phase 8 — Polish
- [ ] **Cash / debt animations** — flash green/red on change
- [ ] **Mobile layout** — current layout is desktop-only
- [ ] **KC flavor text** — neighborhood-specific event messages in the ticker

---

*React 19 + MUI 5 | Kansas City, MO | May 2026*
