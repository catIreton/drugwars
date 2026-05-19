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
| Map | react-leaflet v5 + OpenStreetMap tiles |
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
      actions/      # Terminal-style action panel (Loan, Crew, Bulk Import, Use Item…)
      bag/          # "The Case" — briefcase inventory with P&L, grade badges, consumables
      events/       # Daily Events chyron ticker
      market/       # Drug market table with buy/sell, grade indicators, Haggle button
      status/       # Status card (cash, debt, prestige, crew, heat, weather)
      travel/       # OpenStreetMap (react-leaflet) travel panel + CurrentLoc image + scanner overlay
    GameContext.js  # Global game state + all game actions
    GameOver.js     # End-game results screen with stat summary + local high scores
    EncounterModal.js # Police encounter dialog (pay/run/dump/bribe)
    AchievementToast.js # Achievement unlock notification
    Tutorial.js     # First-run onboarding overlay
  data/
    drugs.js        # Drug definitions, 12 location markets, price/grade functions
    events.js       # KC event pool (46 events), calendar generator, price multipliers
    achievements.js # Achievement definitions and unlock checks
    items.js        # Consumable item catalog (burner phone, scanner, stash house)
  utils/
    sounds.js       # Web Audio API synthesized sound effects
  gameState.js      # INITIAL_STATE, createInitialState, localStorage load/save + high scores
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
- Buy and sell 9 drugs with quantity input and full validation
- **Hash** — cannabis resin, steady mid-tier option (basePrice $400, risk 1)
- **Ecstasy** — MDMA party drug, best margins in Westport and JOCO (basePrice $600, risk 2)
- **Pharmacols** — legal substitute, lowest risk and price, high availability in suburbs (basePrice $100, risk 0)
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
- 46 KC-flavored events (busts, spikes, DEA sweeps, fire sales, festivals, pharmacy raids, neighborhood-specific) pre-generated each run
- Events tagged by season (spring/summer/fall) — weighted calendar places seasonal events in their appropriate day range
- Chyron ticker shows today's event, upcoming events, heat warnings, and location-specific neighborhood flavor text
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

### Bag Upgrades
- Buy up to 4 bag upgrades at $2,000 each (+25 capacity per upgrade) via the Store terminal command
- Crew hiring already adds +15 capacity per member (max 8 crew)

### Rival Dealers & Gang Turf Wars
- Rival level escalates when you revisit a location (recent revisit = +1), decays when you stay away (-1 per 2 days)
- Level 1–3 raises buy prices and lowers sell prices; **Level 4 = lockdown** (+25% buy, -25% sell)
- Market header shows active rival count/lockdown badge; ticker warns of heavy competition
- Scanner item reveals rival levels at all destinations before you travel

### Flash Deals
- 25% chance per travel of a time-limited deal spawning at destination
- Buy deals (40–70% off) or sell deals (150–200% of normal) lasting 1–2 days
- ⚡ badge on affected buy/sell price columns in the market table
- Ticker announces active flash deals

### Prestige System
- Earn prestige through: big trades ($2,000+ = +2), evading police (+5), day milestones (+5 per 10 days)
- Prestige sell bonus: 3% at 10+, 5% at 25+, 8% at 50+ prestige
- Prestige displayed as 0–5 stars in status card; contributes to final score ($200/point)

### Tip-Off Mechanic
- `tip_off` command ($500) reduces your wanted level by 2 and applies a heat bonus to rivals at current location
- 5-day cooldown between tip-offs; cooldown shown in terminal when unavailable

### Difficulty Levels
- **Easy**: 3% daily interest, $8,000 loan cap, police appear at heat 4+, rivals capped at level 1
- **Normal**: 5% daily interest, $5,000 loan cap, police appear at heat 3+, rivals capped at level 2
- **Hard**: 7% daily interest, $3,000 loan cap, police appear at heat 2+, rivals capped at level 3
- Set via `difficulty` terminal command (day 1 only); badge shown in status card
- Finances panel shows actual interest rate and loan cap for current difficulty

### New Game
- `new_game` terminal command prompts for difficulty and restarts mid-run without reloading the page
- "Play Again" button on the game over screen also restarts cleanly

### Drug Quality Tiers
- Each drug at each location has a **grade** (Low / Standard / High) that changes daily
- Grade is shown in the market table next to the buy price
- Grade affects sell price only: Low = 0.82×, Standard = 1.0×, High = 1.28×
- Supply-rich locations (low buyMultiplier) have better grade odds; scarce locations have worse odds
- Grade is tracked per bag entry — same drug bought in different grades appears as separate slots

### Negotiation (Haggle)
- **Haggle** button in every buy/sell dialog — one attempt per transaction
- Success (55% chance): price improves 8–18% in your favor
- Failure: price worsens by 5%
- Negotiated price is shown in green/amber; applies to the final Confirm action

### Item Consumables
- Buy via the **Store** (`visit_store`): **Burner Phone** ($600, max 3), **Police Scanner** ($1,200, max 2), **Stash House Key** ($2,500, max 1)
- `use_item` terminal command appears when items are in the bag
- **Burner Phone**: -1 heat immediately
- **Police Scanner**: reveals rival levels at all locations on the travel map until your next move
- **Stash House Key**: clears any active police encounter and drops wanted level by 2

### Bulk Import
- `bulk_import` terminal command in the STREET section — pick any drug at current location
- Discounted 30% off the current market buy price; costs +2 wanted level
- 3-day cooldown between bulk imports; cooldown shown in terminal

### Local High Scores
- Top 5 scores (cash − debt + prestige bonus) saved to localStorage per browser
- Hall of Fame table shown on the game over screen, ranked with date and difficulty badge

### Bribe Officer
- Fourth option in police encounter: pay 2× the fine amount to walk completely clean
- Reduces wanted level by 2 (better than just paying the fine)
- Only shown when you can afford the bribe

### More Neighborhoods (12 total)
- **Crossroads** (arts district): LSD and ecstasy specialty, mild heat
- **Midtown** (medical corridor): hash and pharmacols specialty, moderate heat
- **Raytown** (speed corridor): speed and weed specialty, hot — meth lab territory
- **Lenexa** (west suburbs): cocaine and pharmacols specialty, mild heat — wealthy suburban

### UI & Polish
- Dark neon title card, terminal-green Actions panel, briefcase-styled Bag
- Colored emoji drug badges; retro weather and heat icons in status bar
- Police encounter modal with animated red/blue flash
- OpenStreetMap travel panel (react-leaflet) with 12 color-coded KC neighborhood pins; click any pin or sidebar entry to `flyTo` with smooth pan animation; scanner overlay shows rival levels
- Cash/debt flash animations (green on gain, red on loss)
- Sound effects: buy/sell chimes, police siren on encounter, game over sting, achievement fanfare (Web Audio, no files)
- Price history arrows in market table; grade badges in buy price column
- Stat tracking: total profit, biggest single trade, drugs traded, times busted
- Achievement badges: 7 milestones with toast notifications
- Tutorial/first-run overlay for new players
- Responsive mobile layout (stacks vertically on small screens)

---

## Phase 3 — Future Development

- [ ] **Cloud save** — persist game state to a backend (Firebase or similar) for cross-device play
- [ ] **Leaderboard** — top scores stored server-side; visible at game over
- [ ] **Multiple save slots** — 2–3 simultaneous runs

---

*React 19 + MUI 5 | Kansas City, MO | May 2026*
