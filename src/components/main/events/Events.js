import React from 'react';
import { styled } from '@mui/material/styles';
import { useGame } from '../../GameContext';

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
