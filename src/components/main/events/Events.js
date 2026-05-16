import React from 'react';

import { styled } from '@mui/material/styles';

const EventsContainer = styled('div')({
  flex: 1,
});

const Ticker = styled('div')({
  width: '100%',
  overflow: 'hidden',
  animation: 'scroll 10s linear infinite',
  '@keyframes scroll': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

function Events() {
  return (
    <EventsContainer>
      <h2>Daily Events</h2>
      <Ticker>
        <p>
          Sunday, October 4, 2020: Chiefs game today! There will
          be more cops on the streets and tickets will sell for
          more.
        </p>
      </Ticker>
    </EventsContainer>
  );
}

export default Events;
