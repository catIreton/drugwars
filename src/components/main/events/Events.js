import React from 'react';

import { styled } from '@mui/material/styles';

const EventsContainer = styled('div')({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const Ticker = styled('div')({
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  animation: 'scroll 10s linear infinite',
  '@keyframes scroll': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

function Events() {
  return (
    <EventsContainer>
      <h2 style={{ margin: '0 0 8px 0', color: '#667eea', fontSize: '1.1rem' }}>Daily Events</h2>
      <Ticker>
        <p>
          Saturday, May 17, 2026: Game on! Make your moves carefully.
          Cash is king, and the cops are always watching.
        </p>
      </Ticker>
    </EventsContainer>
  );
}

export default Events;
