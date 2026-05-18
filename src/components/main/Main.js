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

const TitleSection = styled(Section)({
  flex: '0 0 auto',
});

const TitleCard = styled(CardWrapper)({
  flex: 1,
  height: '60px',
  padding: '0 12px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const TitleText = styled('h1')({
  margin: '0',
  fontSize: '1.8rem',
  fontFamily: 'Palatino Linotype',
  color: '#667eea',
});

function MainContent() {
  return (
    <MainDiv>
      <TitleSection>
        <TitleCard>
          <TitleText>Drug Wars 2026</TitleText>
        </TitleCard>
      </TitleSection>
      <Section style={{ flex: '0 0 auto', maxHeight: '300px' }}>
        <CardWrapper style={{ flex: '5 1 0', minWidth: 0 }}>
          <Status />
        </CardWrapper>
        <CardWrapper style={{ flex: '2 1 0', minWidth: 0 }}>
          <CurrentLoc />
        </CardWrapper>
        <CardWrapper style={{ flex: '5 1 0', minWidth: 0, overflow: 'hidden' }}>
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
        <CardWrapper style={{ flex: '0.3', minWidth: '225px', overflow: 'auto' }}>
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
