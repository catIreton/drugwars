export const WEATHER_OPTIONS = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Stormy', 'Windy', 'Night'];

// KC-flavored event pool — effects applied on the day the event triggers
const EVENT_POOL = [
  { id: 'chiefs_run',      text: 'Chiefs playoff run — cash flowing, prices up across the board',            effects: { globalPrice: 1.25 } },
  { id: 'heroin_bust',     text: 'Warehouse bust on Martin City — heroin supply dried up',                  effects: { drugPrice: { heroin: 2.2 }, stockMult: { heroin: 0.2 } } },
  { id: 'coke_spike',      text: 'Westport weekend party circuit — coke prices spiked 40%',                 effects: { drugPrice: { cocaine: 1.4 } } },
  { id: 'downtown_heat',   text: 'Heavy heat downtown — narcs doing sweeps',                                effects: { heat: 2 } },
  { id: 'northtown_war',   text: 'Street war brewing in Northtown — dealers getting aggressive',            effects: { heat: 1 } },
  { id: 'precinct_shake',  text: 'Main Street precinct restructured — heat cooling down citywide',          effects: { heat: -2 } },
  { id: 'brewery_fest',    text: 'Boulevard Brewery festival — Westport packed with buyers',               effects: { drugPrice: { weed: 0.6 } } },
  { id: 'opium_drought',   text: 'Supply drought from the south — opium nearly impossible to find',        effects: { drugPrice: { opium: 3.0 }, stockMult: { opium: 0.15 } } },
  { id: 'lsd_joco',        text: 'JOCO housewives on a shopping spree — LSD flying off the shelves',       effects: { drugPrice: { lsd: 1.7 } } },
  { id: 'speed_bust',      text: 'Speed lab bust in Independence — street price up 60%',                   effects: { drugPrice: { speed: 1.6 }, stockMult: { speed: 0.35 } } },
  { id: 'fire_sale',       text: 'Fire sale on the North Side — someone needs cash fast',                  effects: { drugPrice: { weed: 0.4 } } },
  { id: 'dea_taskforce',   text: 'DEA task force spotted on I-70 — heat level rising citywide',            effects: { heat: 3 } },
  { id: 'rival_swept',     text: 'Rival crew swept out of Westport — prices stabilizing',                  effects: { globalPrice: 0.8 } },
  { id: 'college_weekend', text: 'Rock Chalk weekend — college kids flooding KC from Lawrence',             effects: { drugPrice: { lsd: 1.9 } } },
  { id: 'royals_opener',   text: 'Royals opening day — Downtown packed, heat distracted',                  effects: { heat: -1 } },
  { id: 'cocaine_seizure', text: 'Major cocaine seizure on KCI shipment — Plaza prices through the roof',  effects: { drugPrice: { cocaine: 2.5 }, stockMult: { cocaine: 0.3 } } },
  { id: 'weed_legalize',   text: 'State decrim vote next week — weed moving fast before it\'s legal',      effects: { drugPrice: { weed: 1.5 } } },
  { id: 'cold_snap',       text: 'Record cold snap hits KC — foot traffic down, dealers desperate to sell', effects: { globalPrice: 0.7 } },
];

export function generateEventCalendar(totalDays = 60) {
  const pool = [...EVENT_POOL];
  const calendar = {};
  const used = new Set();
  const count = Math.min(pool.length, Math.floor(Math.random() * 5) + 14);

  for (let i = 0; i < count && pool.length > 0; i++) {
    let day;
    let tries = 0;
    do { day = Math.floor(Math.random() * (totalDays - 8)) + 5; tries++; }
    while (used.has(day) && tries < 200);
    if (used.has(day)) continue;
    used.add(day);
    calendar[day] = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  }
  return calendar;
}

export function generatePriceMultipliers() {
  return ['weed', 'speed', 'heroin', 'cocaine', 'lsd', 'opium'].reduce((acc, id) => {
    acc[id] = 0.55 + Math.random() * 0.9; // 0.55 – 1.45
    return acc;
  }, {});
}
