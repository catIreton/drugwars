import { DRUGS } from './drugs';

export const WEATHER_OPTIONS = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Stormy', 'Windy', 'Night'];

// KC-flavored event pool
// season: 'spring' (days 1–20) | 'summer' (days 21–40) | 'fall' (days 41–60) | null = any
// location: KC neighborhood tag used for ticker flavor (does not constrain calendar placement)
const EVENT_POOL = [
  // ── Original 18 ─────────────────────────────────────────────────────────────
  { id: 'chiefs_run',       season: 'fall',   location: 'Downtown',    text: 'Chiefs playoff run — cash flowing, prices up across the board',                      effects: { globalPrice: 1.25 } },
  { id: 'heroin_bust',      season: null,     location: 'Martin City', text: 'Warehouse bust on Martin City — heroin supply dried up',                             effects: { drugPrice: { heroin: 2.2 }, stockMult: { heroin: 0.2 } } },
  { id: 'coke_spike',       season: 'summer', location: 'Westport',    text: 'Westport weekend party circuit — coke prices spiked 40%',                            effects: { drugPrice: { cocaine: 1.4 } } },
  { id: 'downtown_heat',    season: null,     location: 'Downtown',    text: 'Heavy heat downtown — narcs doing sweeps',                                            effects: { heat: 2 } },
  { id: 'northtown_war',    season: null,     location: 'Northtown',   text: 'Street war brewing in Northtown — dealers getting aggressive',                        effects: { heat: 1 } },
  { id: 'precinct_shake',   season: null,     location: null,          text: 'Main Street precinct restructured — heat cooling down citywide',                      effects: { heat: -2 } },
  { id: 'brewery_fest',     season: 'summer', location: 'Westport',    text: 'Boulevard Brewery festival — Westport packed with buyers',                           effects: { drugPrice: { weed: 0.6 } } },
  { id: 'opium_drought',    season: null,     location: null,          text: 'Supply drought from the south — opium nearly impossible to find',                     effects: { drugPrice: { opium: 3.0 }, stockMult: { opium: 0.15 } } },
  { id: 'lsd_joco',         season: 'spring', location: 'JOCO',        text: 'JOCO housewives on a shopping spree — LSD flying off the shelves',                   effects: { drugPrice: { lsd: 1.7 } } },
  { id: 'speed_bust',       season: null,     location: 'Independence', text: 'Speed lab bust in Independence — street price up 60%',                              effects: { drugPrice: { speed: 1.6 }, stockMult: { speed: 0.35 } } },
  { id: 'fire_sale',        season: null,     location: 'Northtown',   text: 'Fire sale on the North Side — someone needs cash fast',                              effects: { drugPrice: { weed: 0.4 } } },
  { id: 'dea_taskforce',    season: null,     location: null,          text: 'DEA task force spotted on I-70 — heat level rising citywide',                        effects: { heat: 3 } },
  { id: 'rival_swept',      season: null,     location: 'Westport',    text: 'Rival crew swept out of Westport — prices stabilizing',                              effects: { globalPrice: 0.8 } },
  { id: 'college_weekend',  season: 'fall',   location: 'JOCO',        text: 'Rock Chalk weekend — college kids flooding KC from Lawrence',                        effects: { drugPrice: { lsd: 1.9 } } },
  { id: 'royals_opener',    season: 'spring', location: 'Downtown',    text: 'Royals opening day — Downtown packed, heat distracted',                              effects: { heat: -1 } },
  { id: 'cocaine_seizure',  season: null,     location: 'Plaza',       text: 'Major cocaine seizure on KCI shipment — Plaza prices through the roof',              effects: { drugPrice: { cocaine: 2.5 }, stockMult: { cocaine: 0.3 } } },
  { id: 'weed_legalize',    season: 'spring', location: null,          text: "State decrim vote next week — weed moving fast before it's legal",                   effects: { drugPrice: { weed: 1.5 } } },
  { id: 'cold_snap',        season: 'fall',   location: null,          text: 'Record cold snap hits KC — foot traffic down, dealers desperate to sell',            effects: { globalPrice: 0.7 } },

  // ── 12 New events ────────────────────────────────────────────────────────────
  { id: 'jazz_weekend',         season: 'summer', location: 'Downtown',     text: 'Jazz Fest at 18th & Vine — smooth crowd, hash and pharmacols moving well',        effects: { drugPrice: { hash: 0.75 }, stockMult: { hash: 1.5 } } },
  { id: 'ecstasy_pipeline',     season: null,     location: 'Westport',     text: 'Chicago connection flooding KC — fresh ecstasy hitting Westport hard',            effects: { drugPrice: { ecstasy: 0.55 }, stockMult: { ecstasy: 2.0 } } },
  { id: 'pharma_shortage',      season: null,     location: null,           text: 'CVS and Walgreens running dry — street Pharmacols in sudden demand',              effects: { drugPrice: { pharmacols: 2.0 }, stockMult: { pharmacols: 0.4 } } },
  { id: 'ecstasy_bust',         season: null,     location: 'Martin City',  text: 'Argentine lab busted — ecstasy supply evaporating, prices spiking',               effects: { drugPrice: { ecstasy: 1.9 }, stockMult: { ecstasy: 0.3 } } },
  { id: 'hash_drought',         season: 'fall',   location: null,           text: 'Hash drought across the Midwest — KC supply almost gone',                         effects: { drugPrice: { hash: 2.2 }, stockMult: { hash: 0.2 } } },
  { id: 'crossroads_festival',  season: 'fall',   location: 'Westport',     text: 'Crossroads Arts District weekend — young crowd spending on lsd and ecstasy',      effects: { drugPrice: { lsd: 1.4, ecstasy: 1.35 } } },
  { id: 'city_election_calm',   season: 'spring', location: null,           text: 'City council vote tomorrow — KCPD focused on optics, heat cooling citywide',       effects: { heat: -2 } },
  { id: 'power_light_heat',     season: null,     location: 'Downtown',     text: 'Power & Light District security crackdown — Downtown under watch',                 effects: { heat: 2 } },
  { id: 'royals_playoff_push',  season: 'fall',   location: 'Downtown',     text: 'Royals in playoff hunt — Kauffman packed, KC buzzing with buyers',                effects: { globalPrice: 1.15 } },
  { id: 'joco_pharma_bust',     season: null,     location: 'JOCO',         text: 'JOCO pharmacy network bust — suburban Pharmacol supply cut off',                   effects: { drugPrice: { pharmacols: 1.8 }, stockMult: { pharmacols: 0.45 } } },
  { id: 'hash_fresh_batch',     season: 'spring', location: 'Northtown',    text: 'Fresh hash batch hits Northtown from the north side connect',                     effects: { drugPrice: { hash: 0.6 }, stockMult: { hash: 1.8 } } },
  { id: 'polar_vortex',         season: 'fall',   location: null,           text: 'Polar vortex rolls through — dealers cutting prices to move product',             effects: { globalPrice: 0.75, heat: -1 } },

  // ── 4 Neighborhood events ─────────────────────────────────────────────────────
  { id: 'crossroads_gallery',   season: 'fall',   location: 'Crossroads',   text: 'Crossroads gallery walk tonight — arts crowd out heavy, LSD and ecstasy flying',  effects: { drugPrice: { lsd: 1.5, ecstasy: 1.3 } } },
  { id: 'midtown_clinic_bust',  season: null,     location: 'Midtown',      text: 'Midtown walk-in clinic raided — pharmacols flooding the street market cheap',      effects: { drugPrice: { pharmacols: 0.65 }, stockMult: { pharmacols: 2.5 } } },
  { id: 'raytown_lab_fire',     season: null,     location: 'Raytown',      text: 'Raytown speed lab explosion — supply gone, street price through the roof',         effects: { drugPrice: { speed: 2.0 }, stockMult: { speed: 0.25 } } },
  { id: 'lenexa_sweep',         season: null,     location: 'Lenexa',       text: 'Lenexa PD doing corporate-suburb sweeps — heat climbing fast',                     effects: { heat: 2 } },
];

// days 1–20 = spring, 21–40 = summer, 41–60 = fall
function dayToSeason(day) {
  if (day <= 20) return 'spring';
  if (day <= 40) return 'summer';
  return 'fall';
}

function weightedPick(pool, day) {
  const season = dayToSeason(day);
  const weights = pool.map(ev => {
    if (!ev.season) return 1;
    if (ev.season === season) return 3;
    return 0.5;
  });
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

export function generateEventCalendar(totalDays = 60) {
  const pool = [...EVENT_POOL];
  const count = Math.min(pool.length, Math.floor(Math.random() * 7) + 18); // 18–24 events

  // Pick unique days first
  const days = new Set();
  let tries = 0;
  while (days.size < count && tries < 500) {
    days.add(Math.floor(Math.random() * (totalDays - 8)) + 5);
    tries++;
  }

  // Assign season-weighted events to each day
  const calendar = {};
  for (const day of [...days].sort((a, b) => a - b)) {
    if (pool.length === 0) break;
    const idx = weightedPick(pool, day);
    calendar[day] = pool.splice(idx, 1)[0];
  }
  return calendar;
}

export function generatePriceMultipliers() {
  return DRUGS.reduce((acc, d) => {
    acc[d.id] = 0.55 + Math.random() * 0.9; // 0.55–1.45
    return acc;
  }, {});
}
