import React from 'react';

import Status from './status/Status';
import { Travel, CurrentLoc } from './travel/Travel';
import Events from './events/Events';
import Knockoffs from './knockoffs/Knockoffs';
import Actions from './actions/Actions';
import Bag from './bag/Bag';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import { GameProvider } from '../GameContext';

const MainDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

const Section = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

function MainContent() {
  const theme = useTheme();

  return (
    <MainDiv>
      <Container
        component="main"
        maxWidth={false}
        style={{
          background: theme.palette.primary.main,
          height: '100vh',
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        <Section>
          <Status />
          <CurrentLoc />
          <Travel />
        </Section>
        <Section>
          <Events />
        </Section>
        <Section>
          <Knockoffs />
          <Actions />
          <Bag />
        </Section>
      </Container>
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
