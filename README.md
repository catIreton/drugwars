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

## Phase 2 — Future Development

### Persistence & Infrastructure
- [ ] **Cloud save** — persist game state to a backend (Firebase or similar) for cross-device play
- [ ] **Leaderboard** — top scores stored server-side; visible at game over
- [ ] **Multiple save slots** — 2–3 simultaneous runs
- [ ] **PWA / offline support** — service worker + manifest so the game installs on mobile and works without a signal
- [ ] **CI pipeline** — GitHub Actions running `npm test` + build check on every push

### Character Screen
- [ ] **Dealer profile** — named character with a backstory, portrait/avatar, and origin neighborhood
- [ ] **Equipment slots** — visual loadout showing active items (burner phone, scanner, stash house key) and bag tier
- [ ] **Rep & history** — lifetime stats panel: total runs, best score, biggest single trade, times busted, rival takedowns
- [ ] **Unlockable titles** — earn street titles based on playstyle (e.g. *The Pharmacist*, *Westport Ghost*, *JOCO Kingpin*)
- [ ] **Crew roster** — named crew members with individual traits (lookout bonus, negotiate bonus, escape bonus)

### Heat & Rival Escalation
- [ ] **Surveillance buildup** — visiting the same location repeatedly raises a hidden "surveillance score"; once it peaks, an undercover sting event fires instead of a normal encounter
- [ ] **Undercover cop events** — plain-clothes officer poses as a buyer; accepting the deal triggers an instant bust with no run/dump option
- [ ] **Wanted poster tier** — at heat 5 you're recognized on arrival; prices tank, crew morale drops, and NPCs refuse to deal until you cool off for 3+ days
- [ ] **Snitch in the crew** — rare event where a crew member flips; costs heat +2 and leaks your next location to police, telegraphed only by subtle ticker hints beforehand
- [ ] **DEA task force** — separate federal heat bar that builds slowly from large transactions; at max, a raid event fires regardless of local heat level
- [ ] **Safe house lay-low** — spend 2 days holed up (no market access) to shed 3 heat and reset surveillance score; costs daily upkeep but no travel day deducted
- [ ] **Rival retaliation** — bulk-importing on a rival's turf triggers a retaliatory event next travel: stash robbed, crew member injured, or forced price dump
- [ ] **Rival alliance** — two high-level rivals merge turf at day 30+; combined lockdown covers both neighborhoods until one is unseated
- [ ] **Gang war chaos** — when two rivals clash (both level 3+ in adjacent neighborhoods), a 2-day "turf war" event creates high-risk / high-reward market conditions: prices spike but police swarm
- [ ] **Rival takedown** — pay a bounty ($3,000–$8,000 scaling with level) to permanently reduce a rival by 2 levels; adds a prestige bonus and ticker headline

### Loan Shark & Debt Consequences
- [ ] **Tiered lenders** — three borrow sources with escalating risk: *Bank* (3% interest, $2k cap, no consequences), *Street Lender* (8% interest, $5k cap, repo risk), *Loan Shark* (15% daily interest, $10k cap, violent enforcement)
- [ ] **Repayment countdown** — loan shark loans show a day counter; missing the deadline triggers an escalating consequence chain:
  - Days 1–3 overdue: threatening ticker messages, crew morale penalty
  - Days 4–7: a crew member goes missing (−1 crew, no refund)
  - Days 8–10: stash confiscated — random bag items removed equal to 50% of loan value
  - Day 11+: loan shark enforcer encounter — pay in full, lose the run, or fight (crew-dependent escape roll)
- [ ] **Loan stacking penalty** — each additional active loan raises the interest rate on all loans by 2%; borrowing from 3+ sources flags you as high-risk and locks the bank option
- [ ] **Debt consolidation** — one-time terminal command to merge all active loans at a blended rate + 5% fee; resets the repayment countdown
- [ ] **Collateral loans** — offer a bag upgrade or crew slot as collateral for a lower rate; defaulting permanently removes the collateral item
- [ ] **Loan forgiveness event** — rare random event (day 20–50) offers to clear one loan at 60 cents on the dollar if you can pay within 2 days; rewards players who stay liquid

### Drug Demand & Market Depth
- [ ] **Supply/demand tracking** — buying a drug depletes local supply and nudges the price up; selling floods the market and nudges it down; resets gradually over days
- [ ] **Money laundering front** — buy into a legit business (food truck, laundromat, pawn shop) that generates slow passive income and converts dirty cash to clean; narrows the debt gap in late runs
- [ ] **Dark web market** — alternate sell channel via burner phone; 20–40% above street price but 2-day payout delay and a small seizure risk at high heat
- [ ] **Counterfeit goods** — rare chance a buy is fake product; sells at 30% of expected value and sours that location's relationship
- [ ] **Drug drought** — supply event pulls one drug off the city-wide market for 3–5 days, spiking black-market prices at locations that still have stock
- [ ] **Price memory fix** — sell price at a given location is always capped below buy price there; profit only comes from cross-location arbitrage *(partially implemented: local sell cap in `getMarketPrice`; full supply/demand economy is a deeper rewrite)*

### Meta-Progression & Replayability
- [ ] **Roguelite unlocks** — finishing a run with certain achievements permanently unlocks starting perks for future runs (e.g., *Cleared Debt* → start with lower interest rate)
- [ ] **Multiple endings** — outcome flavor varies based on how you played: retired clean, went federal, built an empire, or died in a turf war; each ending has a unique score multiplier
- [ ] **New Game+** — higher base heat, faster rival escalation, loan shark active from day 1

### World & Environment
- [ ] **Neighborhood gentrification** — a low-heat neighborhood slowly transforms over 20 days: prices shift, clientele changes, heat increases; irreversible once it tips
- [ ] **Police crackdown** — random event locks a neighborhood for 2–4 days entirely; forces rerouting and can strand players already there
- [ ] **Named rival personalities** — each rival is a character (*The Accountant*, *La Plaza Queen*, etc.) with predictable behavior patterns, a short bio, and a negotiable truce option

### Items & Transport
- [ ] **Vehicle upgrades** — beater car (default), motorcycle (+1 free travel per day), cargo van (+40 bag space, higher travel heat)
- [ ] **Disguise kit** — single-use consumable; bypasses the wanted-poster recognition penalty at heat 5
- [ ] **Encrypted phone** — passive item that blocks the snitch event and slows DEA heat accumulation on large transactions

### Side Activities (KC flavor)
- [ ] **Numbers running** — daily side bet on a neighborhood's price movement; low stakes but ties players emotionally to market prediction
- [ ] **Underground fight nights** — Raytown / Martin City; bet crew members for cash, risk injury
- [ ] **Memorabilia fence** — during Chiefs or World Cup event days, offload stolen merch for quick flat-rate cash with no drug heat

### Social
- [ ] **Async rivals** — other players' completed run stats populate as named rival dealers in your game; their turf patterns reflect how they actually played
- [ ] **Run replay** — after game over, watch a condensed timeline of your 60 days on the travel map

### KC 2026 Calendar & Real Events
- [ ] **Game-day planner** — 60-day grid tab showing color-coded event icons so players can route strategically
- [ ] **World Cup 2026** — KC host-city match days baked into the calendar; Downtown and Midtown see 2–3× demand and maximum heat during match days; "stadium scalping" side hustle unlocks
- [ ] **Chiefs / Royals game days** — weekly spikes in Westport and Power & Light; championship run event chain fires if a streak milestone hits
- [ ] **First Fridays** (Crossroads, monthly) — LSD and ecstasy demand spike, relaxed heat
- [ ] **American Royal BBQ** (fall) — Brookside and Martin City activity boost
- [ ] **Plaza Art Fair** (fall) — Plaza heat drops, buyers flush with cash
- [ ] **18th & Vine Jazz Fest** (summer) — Crossroads and Midtown flavor events and sell bonuses
- [ ] **Boulevard Brewing anniversary** — ecstasy demand jump, neighborhood flavor text

### Modernization
- [ ] **Migrate CRA → Vite** — CRA is deprecated; Vite gives sub-second HMR, faster builds, and active maintenance
- [ ] **TypeScript** — add `tsconfig.json` and migrate files incrementally; catches type errors in game state and drug data at compile time
- [ ] **Dependabot** — automated PRs for dependency security patches
- [ ] **Husky + lint-staged** — run ESLint and tests on staged files before every commit
- [ ] **Bundle analysis** — `vite-bundle-visualizer` to audit what's eating bundle size after the CRA migration

### Monitoring & Observability
- [ ] **Sentry** — capture runtime errors and unhandled rejections from real players without needing repro steps
- [ ] **Web Vitals** — report LCP, CLS, FID; flag regressions before deploy
- [ ] **Privacy-friendly analytics** — Plausible or Fathom to track active sessions and game-over funnels without GDPR baggage

### Polish & Quality
- [ ] **Error boundaries** — catch render crashes gracefully instead of white-screening
- [ ] **Code splitting** — lazy-load the game view to shrink the initial bundle
- [ ] **E2E tests** — Playwright smoke test covering the core buy → travel → sell loop
- [ ] **Accessibility** — keyboard navigation and ARIA labels on the market table and dialogs
- [ ] **Mobile gestures** — swipe between tabs on small screens; haptic feedback on buy/sell confirmation

---

*React 19 + MUI 5 | Kansas City, MO | May 2026*
