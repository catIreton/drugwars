import React from 'react';

import Status from './status/Status';
import { Travel, CurrentLoc } from './travel/Travel';
import Events from './events/Events';
import Market from './market/Market';
import Actions from './actions/Actions';
import Bag from './bag/Bag';
import GameOver from '../GameOver';
import EncounterModal from '../EncounterModal';
import AchievementToast from '../AchievementToast';
import Tutorial from '../Tutorial';
import { styled } from '@mui/material/styles';
import { GameProvider, useGame } from '../GameContext';
import WhathotIcon from '@mui/icons-material/Whatshot';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const MainDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '@media (max-width: 768px)': {
    height: 'auto',
    minHeight: '100vh',
    overflow: 'visible',
  },
});

const Section = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto',
  overflow: 'auto',
  gap: '12px',
  padding: '12px',
  boxSizing: 'border-box',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    overflow: 'visible',
  },
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

const TitleCard = styled('div')({
  flex: 1,
  height: '60px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '14px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #0d001a 0%, #1e0040 40%, #0a0020 100%)',
  boxShadow: '0 0 24px rgba(180, 90, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(180, 90, 255, 0.2)',
  border: '1px solid rgba(180, 90, 255, 0.35)',
  padding: '0 20px',
});

const TitleMain = styled('span')({
  fontFamily: 'Palatino Linotype, Palatino, serif',
  fontSize: '1.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#ede0ff',
  textShadow: '0 0 8px #c084fc, 0 0 20px #9333ea, 0 0 40px #7e22ce',
});

const TitleSub = styled('span')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.85rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  color: '#D4AF37',
  textShadow: '0 0 8px #D4AF37, 0 0 18px #a07820',
  textTransform: 'uppercase',
});

function MainContent() {
  const { game } = useGame();
  return (
    <MainDiv>
      {(game.day >= 60 || game.bankrupted) && <GameOver />}
      {game.pendingEncounter && !game.bankrupted && game.day < 60 && <EncounterModal />}
      {!game.tutorialSeen && !game.bankrupted && game.day < 60 && <Tutorial />}
      <AchievementToast />
      <TitleSection>
        <TitleCard>
          <WhathotIcon sx={{ fontSize: '1.6rem', color: '#ff6b35', filter: 'drop-shadow(0 0 6px #ff6b35)' }} />
          <TitleMain>Drug Wars 2026</TitleMain>
          <TitleSub>KC Edition</TitleSub>
          <MonetizationOnIcon sx={{ fontSize: '1.6rem', color: '#D4AF37', filter: 'drop-shadow(0 0 6px #D4AF37)' }} />
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
        <CardWrapper style={{ width: '100%', padding: 0, background: '#1a2535', border: '1px solid rgba(212,175,55,0.25)', overflow: 'hidden' }}>
          <Events />
        </CardWrapper>
      </Section>
      <Section style={{ flex: 1 }}>
        <CardWrapper style={{ flex: '5 1 0', minWidth: 0, overflow: 'auto' }}>
          <Market />
        </CardWrapper>
        <CardWrapper style={{ flex: '2 1 0', minWidth: 0, overflow: 'auto', background: '#060d06', border: '1px solid rgba(0,255,65,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,255,65,0.03)' }}>
          <Actions />
        </CardWrapper>
        <CardWrapper style={{ flex: '5 1 0', minWidth: 0, overflow: 'auto', background: 'linear-gradient(160deg, #0a0515 0%, #130820 60%, #0a0515 100%)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 40px rgba(139,92,246,0.04)' }}>
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
