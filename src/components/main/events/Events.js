import React from 'react';

import { styled } from '@mui/material/styles';

const EventsContainer = styled('div')({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const TickerOuter = styled('div')({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#2C3E50',
  color: '#D4AF37',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: '1rem',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  borderRadius: '8px',
  flex: 1,
});

const TickerInner = styled('div')({
  display: 'inline-block',
  paddingLeft: '100%',
  animation: 'scrollText 18s linear infinite',
  '@keyframes scrollText': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

function Events() {
  return (
    <EventsContainer>
      <h2 style={{ margin: '0', color: '#667eea', fontSize: '1.1rem' }}>Daily Events</h2>
      <TickerOuter>
        <TickerInner>
          {['TODAY: Transit delays on I-35', 'EVENT: Downtown street fair 6pm', 'NOTE: New bus routes added'].join('   •   ')}
        </TickerInner>
      </TickerOuter>
    </EventsContainer>
  );
}

export default Events;
