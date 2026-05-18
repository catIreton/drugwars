import React from 'react';
import { styled } from '@mui/material/styles';

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

const LabelText = styled('span')({});

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
  animation: 'tickerScroll 22s linear infinite',
  '@keyframes tickerScroll': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

function Events() {
  return (
    <ChyronBar>
      <Label><LabelText>Daily Events</LabelText></Label>
      <TickerTrack>
        <TickerInner>
          {['TODAY: Transit delays on I-35', 'EVENT: Downtown street fair 6pm', 'NOTE: New bus routes added', 'ALERT: Heat up in Westport tonight'].join('     ◆     ')}
        </TickerInner>
      </TickerTrack>
    </ChyronBar>
  );
}

export default Events;
