import React from 'react';

import Status from './status/Status';
import { Travel, CurrentLoc } from './travel/Travel';
import Events from './events/Events';
import Knockoffs from './knockoffs/Knockoffs';
import Actions from './actions/Actions';
import Bag from './bag/Bag';
import { styled } from '@mui/material/styles';
import { GameProvider } from '../GameContext';

const MainDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
});

const Section = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto',
  overflow: 'auto',
  gap: '12px',
  padding: '12px',
  boxSizing: 'border-box',
});

const CardWrapper = styled('div')({
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
});

function MainContent() {
  return (
    <MainDiv>
      <Section>
        <CardWrapper style={{ flex: '0 0 200px' }}>
          <Status />
        </CardWrapper>
        <CardWrapper style={{ flex: '1', minWidth: '250px' }}>
          <CurrentLoc />
        </CardWrapper>
        <CardWrapper style={{ flex: '1.2', minWidth: '300px' }}>
          <Travel />
        </CardWrapper>
      </Section>
      <Section style={{ flex: '0 0 auto' }}>
        <CardWrapper style={{ width: '100%' }}>
          <Events />
        </CardWrapper>
      </Section>
      <Section style={{ flex: 1 }}>
        <CardWrapper style={{ flex: '1.2', minWidth: '300px', overflow: 'auto' }}>
          <Knockoffs />
        </CardWrapper>
        <CardWrapper style={{ flex: '0.5', minWidth: '140px', overflow: 'auto' }}>
          <Actions />
        </CardWrapper>
        <CardWrapper style={{ flex: '1', minWidth: '250px', overflow: 'auto' }}>
          <Bag />
        </CardWrapper>
      </Section>
    </MainDiv>
  );
}

function Main() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}

export default Main;
