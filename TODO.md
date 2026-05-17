# Drug Wars: KC Edition — Development To-Do List

> A Kansas City-themed remake of the 1984 classic, built with React + Firebase.
> Current status: **UI shell is functional. Game mechanics are ~10% implemented.**

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Critical / Blocking |
| 🟡 | High Priority |
| 🟢 | Nice to Have |
| ✅ | Done |

---

## Phase 1 — Fix the Core Game Loop 🔴

> Nothing is playable until buy/sell works. Start here.

- [x] ✅ **Implement `buyItem(item, qty)`** in `GameContext.js`
  - Validate player has enough cash
  - Validate bag capacity won't be exceeded
  - Deduct cash, add item to `bag[]` in game state
  - Reduce available stock in the current location's market
  - _File: `src/components/GameContext.js`_

- [x] ✅ **Implement `sellItem(item, qty)`** in `GameContext.js`
  - Validate player owns the item and quantity
  - Add cash, remove item from `bag[]`
  - _File: `src/components/GameContext.js`_

- [x] ✅ **Wire up the Buy/Sell buttons** in the Market component
  - The `onClick` handler has a `// TODO` comment and does nothing
  - Connect it to the buy/sell functions above
  - _File: `src/components/main/market/Market.js`_

- [x] ✅ **Implement the Dump action**
  - The "Dump" button in Actions is non-functional
  - Should drop all or selected items from bag (no cash return)
  - _File: `src/components/main/actions/Actions.js`_

- [ ] 🔴 **Add a Game Over / Win screen**
  - The game is 60 days but never ends
  - At day 60, calculate final score: cash − debt + (prestige × multiplier)
  - Show a results screen with stats
  - _File: Create `src/components/GameOver.js`_

---

## Phase 2 — Dynamic Market System 🟡

> The current price list is one hardcoded table. Real Drug Wars has prices that fluctuate wildly.

- [ ] 🟡 **Create a location-based market data file**
  - Extract items and prices out of `Market.js` into `src/data/markets.js`
  - Each of the 8 KC neighborhoods should have different drug availability and base prices
  - Example: Downtown has cocaine; Northside has heroin; Suburbs have weed and pills

- [ ] 🟡 **Add price randomization on location change**
  - On travel, randomize each item's price within a range (±30–50% of base)
  - Simulate supply/demand: if you bought a lot of an item, its price rises next visit

- [ ] 🟡 **Add "price spike" and "fire sale" random events**
  - Occasionally a location should have one item at 3× price or 1/3 price
  - Display this in the events ticker with a special alert style

- [ ] 🟡 **Generate market state per-location-per-day**
  - Some items should be unavailable in certain locations on certain days
  - Add a `qty: 0` state that shows "OUT OF STOCK" in the price list

---

## Phase 3 — Financial Mechanics 🟡

> Debt exists in the game state but is never used for anything.

- [ ] 🟡 **Implement debt accrual / interest**
  - Starting debt is tracked but never grows
  - Add daily interest (e.g., 10% per day compounding) — classic Drug Wars mechanic
  - _File: `src/components/GameContext.js` — hook into the day-advance logic_

- [ ] 🟡 **Implement the Loan action**
  - "Loan" button in Actions does nothing
  - Should let player borrow cash, increasing debt
  - _File: `src/components/main/actions/Actions.js`_

- [ ] 🟡 **Implement the Finances screen**
  - "Finances" button in Actions does nothing
  - Show a breakdown: cash on hand, total debt, interest rate, projected payoff
  - _File: `src/components/main/actions/Actions.js`_

- [ ] 🟡 **Add a bankruptcy / game-over-by-debt condition**
  - If debt exceeds a threshold (e.g., 5× starting debt) with no cash, game over

---

## Phase 4 — Risk & Law Enforcement 🟡

> Wanted level is tracked in state but never changes. There are no consequences.

- [ ] 🟡 **Increment wanted level on risky actions**
  - Large buy/sell transactions, being in certain locations, selling stolen goods
  - Each transaction could have a small random chance of adding to wanted level

- [ ] 🟡 **Add police encounter events**
  - At high wanted level, random chance of a "raid" event on travel
  - Raid outcome: lose random portion of bag, pay fine, or escape (based on crew size)

- [ ] 🟡 **Add wanted level consequences by tier**
  - Level 1–2: No effect
  - Level 3–4: Prices worsen (vendors are nervous), some locations unavailable
  - Level 5: Active pursuit — travel costs a day, random confiscation

- [ ] 🟡 **Decrement wanted level over time**
  - Lying low (staying in one location, not trading) should reduce wanted level

---

## Phase 5 — Crew System 🟢

> Crew count exists in state but does nothing.

- [ ] 🟢 **Add crew recruitment**
  - "Store" button could open a crew management screen
  - Hire crew members for cash; they add capacity, reduce police risk, enable bulk deals

- [ ] 🟢 **Add crew-based perks**
  - More crew = higher bag capacity
  - More crew = better chance of escaping raids
  - More crew = ability to "take over" a location for better prices

- [ ] 🟢 **Add crew upkeep cost**
  - Crew costs cash per day, forcing a tradeoff between size and profitability

---

## Phase 6 — Events & Calendar 🟡

> The ticker shows one hardcoded event from October 4, 2020. The Calendar modal shows a date picker with "Events Listed Here."

- [ ] 🟡 **Create a KC events data file**
  - Define KC street events: police raids, warehouse busts, major dealers moving in/out, supply droughts, festival weekends
  - Include event effects: price spikes on certain drugs, increased police presence, market availability changes
  - _File: Create `src/data/events.js`_

- [ ] 🟡 **Generate a dynamic event calendar at game start**
  - At game start, randomly assign events to days 1–60
  - Pull from the events data file
  - Store the calendar in game state

- [ ] 🟡 **Connect the ticker to live game events**
  - Show today's events and upcoming events in the scrolling ticker
  - Style urgent events (raids, price spikes) differently

- [ ] 🟡 **Connect the Calendar modal to game events**
  - The date picker in the Calendar modal currently does nothing
  - Replace placeholder "Events Listed Here" with the generated event calendar

- [ ] 🟢 **Add weather effects**
  - Weather is tracked but never changes
  - Ice storms reduce travel options; summer heat reduces water supply

---

## Phase 7 — KC Drug Economy 🟡

> Each Kansas City neighborhood has distinct drug availability and pricing based on street economics.

### Drugs & Products

- [ ] 🟡 **Implement core drug types**
  - Weed (low price, high quantity, low risk)
  - Heroin (medium price, medium quantity, high risk)
  - Cocaine (high price, low quantity, high risk, high street value)
  - LSD (medium price, low quantity, medium risk, specialty item)
  - Speed (low price, medium quantity, medium risk)
  - Opium (high price, low quantity, extreme risk, rare)
  - Hash/Ecstasy variants (specialty items)
  - Pharmacols (legal substitute, lower risk but lower demand)

### Kansas City Neighborhoods

- [ ] 🟡 **Give each KC neighborhood a distinct drug economy**

  | Location | Specialty | High Demand | Heat Level | Buy Price | Sell Price |
  |----------|-----------|-------------|------------|-----------|------------|
  | Northtown | Street goods, weed | Weed, speed | Very Hot | Low | Medium |
  | Plaza | High-end market | Cocaine, LSD | Hot | High | Very High |
  | Downtown | Business district | Cocaine, uppers | Hot | High | Very High |
  | Westport | Party scene | Cocaine, ecstasy | Moderate | Medium | High |
  | Brookside | Local market | Weed, hash | Mild | Medium | Medium |
  | Martin City | South KC dope | Heroin, weed | Very Hot | Low | Medium |
  | Independence | Suburban hustle | Weed, pills | Mild | Low | Low |
  | JOCO | Wealthy suburbs | Cocaine, LSD | Moderate | Very High | Very High |

### Visual / Flavor

- [ ] 🟢 **Add KC drug-scene flavor text to random events**
  - "Heavy heat downtown — narcs doing sweeps"
  - "Warehouse bust on Martin City — heroin supply dried up"
  - "Westport weekend party circuit — coke prices spiked 40%"
  - "Main Street police precinct got restructured — heat down"
  - "Boulevard Brewery festival — Westport's packed with buyers"
  - "Chiefs playoff run — cash flowing, prices up across the board"
  - "Street war brewing in Northtown — dealers getting aggressive"

- [ ] 🟢 **Replace/update location background images with KC neighborhoods**
  - Ensure all 8 KC locations have recognizable street-level imagery
  - _Current images are in `public/images/`_

- [ ] 🟢 **Update the app title and branding**
  - Ensure Firebase project and title match the Drug Wars: KC Edition theme
  - Update `public/index.html` title, favicon, and manifest

---

## Phase 8 — Persistence & Authentication 🟢

> Firebase is configured but completely unused. Game state resets on every page refresh.

- [ ] 🟢 **Connect Firebase Auth**
  - Auth methods are defined in `src/firebase/firebase.js` but never called
  - Wire up Sign In / Sign Up / Sign Out components that already exist

- [ ] 🟢 **Save game state to Firebase Realtime Database**
  - On each day advance, persist state to user's Firebase record
  - On app load, rehydrate from Firebase instead of sessionStorage

- [ ] 🟢 **Add a high score leaderboard**
  - Track final score (cash − debt + prestige bonus) per user
  - Display top 10 on a leaderboard screen

- [ ] 🟢 **Add multiple save slots**
  - Allow players to have 2–3 active runs simultaneously

---

## Phase 9 — UI Polish & UX 🟢

- [ ] 🟢 **Add quantity selector to Buy/Sell**
  - Currently there's no way to buy more than 1 at a time
  - Add a number input or slider when clicking Buy/Sell

- [ ] 🟢 **Add item categories to the price list**
  - Group items: Merch, Food & Drink, Tickets, Luxury Goods
  - Allow filtering by category

- [ ] 🟢 **Add transaction confirmation dialogs**
  - Before completing a purchase, show "You're buying 5x Fake Rolex for $250. Confirm?"

- [ ] 🟢 **Animate state changes**
  - Cash going up/down should flash green/red
  - Wanted level rising should pulse red

- [ ] 🟢 **Add a map view for travel**
  - Instead of 8 plain buttons, show a stylized KC map with clickable neighborhoods

- [ ] 🟢 **Mobile responsiveness**
  - The current layout uses fixed pixel widths (200px buttons) that break on mobile
  - Switch to percentage-based or breakpoint-aware sizing

---

## Tech Debt & Refactoring 🟡

- [ ] 🟡 **Extract all hardcoded data from components**
  - Items, prices, locations, events are scattered across component files
  - Move to `src/data/` directory: `items.js`, `locations.js`, `events.js`, `markets.js`

- [ ] 🟡 **Create a game engine utility layer**
  - Move all game logic out of `GameContext.js` into `src/engine/`
  - Functions: `buyItem()`, `sellItem()`, `advanceDay()`, `triggerEvent()`, `calculateScore()`

- [ ] 🟡 **Separate game state from UI state**
  - `GameContext` currently mixes game logic with React state concerns
  - Consider splitting into `GameStateContext` (pure state) + `GameActionsContext` (functions)

- [ ] 🟢 **Write unit tests for game engine functions**
  - Test: buy with insufficient funds, sell items not in bag, price calculation, day 60 end condition

- [ ] 🟢 **Update outdated event date**
  - The ticker still shows "Chiefs game on October 4, 2020"
  - _File: `src/components/main/events/Events.js`_

---

## Quick Wins (Do These First) ⚡

These are small changes with big visible impact:

1. ✅ **Fix the hardcoded 2020 date** in `Events.js` — 5 minutes
2. ✅ **Wire up Dump button** to clear the bag — 15 minutes
3. ✅ **Add a basic `buyItem` function** with cash validation — 1 hour
4. ✅ **Add a basic `sellItem` function** — 30 minutes
5. ✅ **Create `src/data/drugs.js`** and pull hardcoded items out of `Market.js` — 45 minutes
6. 🟢 **Add "OUT OF STOCK" display** when drug qty is 0 — 20 minutes
7. 🟢 **Update app title to Drug Wars: KC Edition** — 10 minutes

## Recent Changes (May 17, 2026)

- ✅ **Fixed layout issues**: Reorganized main page with better flex proportions and spacing
- ✅ **Modernized UI**: Added gradient background, glassmorphism cards, and improved typography
- ✅ **Heat Level visual**: Replaced wanted level number with 5 police badge icons that fill with color
- ✅ **Location-specific colors**: Each KC neighborhood has a unique color in the current location display
- ✅ **Improved status panel**: Reorganized with weather image to the right and stats on the left
- ✅ **Fixed ESLint warnings**: Removed unused imports and variables
- ✅ **Buy/Sell functionality**: Both functions fully working with quantity selection dialog

---

*Last updated: May 2026 | Codebase: React 19 + Firebase 9 + MUI 5 | Theme: Drug Wars: KC Edition*
