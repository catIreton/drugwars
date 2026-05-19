import React from 'react';
import { styled } from '@mui/material/styles';
import { useGame } from '../../GameContext';
import { DRUGS } from '../../../data/drugs';

const ChyronBar = styled('div')({
  display: 'flex',
  alignItems: 'stretch',
  height: '44px',
  width: '100%',
  fontFamily: 'Courier New, Courier, monospace',
  overflow: 'hidden',
});

const Label = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 16px',
  background: '#D4AF37',
  color: '#1a2535',
  fontWeight: 700,
  fontSize: '0.78rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  borderRadius: 0,
  margin: 0,
});

const TickerTrack = styled('div')({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  background: '#2C3E50',
  borderLeft: 'none',
});

const TickerInner = styled('div')({
  display: 'inline-block',
  whiteSpace: 'nowrap',
  paddingLeft: '100%',
  color: '#D4AF37',
  fontSize: '0.9rem',
  letterSpacing: '0.04em',
  animation: 'tickerScroll 28s linear infinite',
  '@keyframes tickerScroll': {
    '0%':   { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

const SEP = '     ◆     ';

const LOCATION_FLAVOR = {
  'Northtown':    ['North Side crews running the blocks today', 'Northtown connect reliable — but always hot', 'North KC tension running high — move quick'],
  'Plaza':        ['Country Club crowd flush with cash tonight', 'Plaza buyers want premium product — charge accordingly', 'High rollers moving through the Plaza'],
  'Downtown':     ['Suits doing side deals after hours downtown', 'City Hall types looking the other way tonight', 'Downtown buzz is real — law is distracted elsewhere'],
  'Westport':     ['Westport bars packed — buyers in every booth', 'Club scene popping on 39th tonight', 'Westport weekend in full swing — move your product'],
  'Brookside':    ['Brookside running quiet — no heat, no drama', 'Locals keeping it chill in Brookside today', 'Steady demand in Brookside — low-key and reliable'],
  'Martin City':  ['Martin City connect is live — go fast', 'South KC wild tonight — in and out quick', 'South Side never sleeps — stay sharp'],
  'Independence': ['Independence suburbs moving slow but steady', 'Easy money in the Indy suburbs today', 'Quiet streets in Independence — patient hustle'],
  'JOCO':         ['JOCO money is real — wealthy buyers want quality', 'Johnson County flush with cash', 'Suburban premium market in JOCO running steady'],
};

const LOCATION_HEAT_FLAVOR = {
  'Northtown':    'Northtown on lockdown — narcs posted up heavy',
  'Plaza':        'Plaza under surveillance — undercovers in designer clothes',
  'Downtown':     'Downtown narcs out in force — eyes everywhere',
  'Westport':     'Westport heat is up — plainclothes working the bars',
  'Brookside':    'Even Brookside is hot right now — stay cautious',
  'Martin City':  'Martin City locked down tight — serious heat',
  'Independence': 'Independence going hot — suburban narcs on patrol',
  'JOCO':         'JOCO task force active — badge money chasing dealers',
};

function buildTickerItems(game) {
  const items = [];

  // Today's event (if any) — flagged prominently
  if (game.todayEvent) {
    items.push(`🔴 TODAY: ${game.todayEvent.text}`);
  }

  // Upcoming events (next 3 days)
  for (let d = game.day + 1; d <= Math.min(game.day + 3, 60); d++) {
    const ev = game.eventCalendar?.[d];
    if (ev) items.push(`📅 DAY ${d}: ${ev.text}`);
  }

  // Wanted level status
  if (game.wantedLevel >= 4) {
    items.push('🚨 ALERT: You are HOT — narcs on your trail');
  } else if (game.wantedLevel >= 2) {
    items.push('⚠️ NOTICE: Heat level elevated — watch your back');
  }

  // Flash deals at current location
  const locationFlash = game.flashDeals?.[game.location];
  if (locationFlash) {
    for (const [drugId, deal] of Object.entries(locationFlash)) {
      if ((deal.expiresDay ?? 0) >= game.day) {
        const drug = DRUGS.find(d => d.id === drugId);
        if (drug) {
          if (deal.type === 'buy') {
            const pct = Math.round((1 - deal.mult) * 100);
            items.push(`⚡ FLASH DEAL: ${drug.name} buy price ${pct}% off at ${game.location}`);
          } else {
            const pct = Math.round((deal.mult - 1) * 100);
            items.push(`⚡ FLASH DEAL: ${drug.name} sell price +${pct}% at ${game.location}`);
          }
        }
      }
    }
  }

  // Rival activity at current location
  const rivalLevel = game.rivals?.[game.location]?.level ?? 0;
  if (rivalLevel >= 2) {
    items.push(`👊 RIVALS: Heavy competition at ${game.location} — buy prices elevated, sell cut`);
  } else if (rivalLevel === 1) {
    items.push(`👊 RIVALS: Competitor spotted at ${game.location}`);
  }

  // Location-specific flavor — deterministic per location+day so it doesn't flicker on re-render
  const locFlavors = LOCATION_FLAVOR[game.location];
  if (locFlavors) {
    if (game.wantedLevel >= 3 && LOCATION_HEAT_FLAVOR[game.location]) {
      items.push(`🔥 ${LOCATION_HEAT_FLAVOR[game.location]}`);
    } else {
      const idx = ((game.day ?? 0) * 7 + (game.location?.charCodeAt(0) ?? 0)) % locFlavors.length;
      items.push(locFlavors[idx]);
    }
  }

  // Fallback flavor if nothing else
  if (items.length === 0) {
    items.push(
      'All quiet on the KC streets today',
      'Watch your back out there',
      'Keep an eye on the market — prices shift daily',
    );
  }

  return items.join(SEP);
}

function Events() {
  const { game } = useGame();
  const tickerText = buildTickerItems(game);

  return (
    <ChyronBar>
      <Label>Daily Events</Label>
      <TickerTrack>
        <TickerInner key={game.day}>{tickerText}</TickerInner>
      </TickerTrack>
    </ChyronBar>
  );
}

export default Events;
