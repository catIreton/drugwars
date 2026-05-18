import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useGame } from './GameContext';

const STEPS = [
  {
    emoji: '🌿',
    title: 'Buy Low, Sell High',
    body: 'Each KC neighborhood has different drug prices. Buy cheap in one spot and sell high in another. Prices shift every time you travel.',
  },
  {
    emoji: '🚔',
    title: 'Watch Your Heat',
    body: 'Every transaction raises your wanted level. At level 3+ the cops might roll up. Pay the fine, run, or dump your bag. Heat drops -1 each day you travel.',
  },
  {
    emoji: '💸',
    title: 'Beat the Clock & the Debt',
    body: 'You have 60 days. Your $5,000 debt compounds at 5%/day — don\'t let it spiral. Take loans carefully, hire crew for perks, and cash out before day 60.',
  },
];

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(5, 0, 15, 0.88)',
  backdropFilter: 'blur(6px)',
});

const Panel = styled('div')({
  width: '440px',
  maxWidth: '95vw',
  background: 'linear-gradient(160deg, #0d001a 0%, #1e0040 60%, #0a0020 100%)',
  border: '1px solid rgba(180, 90, 255, 0.4)',
  borderRadius: '16px',
  boxShadow: '0 0 40px rgba(180, 90, 255, 0.3), 0 0 80px rgba(0,0,0,0.8)',
  padding: '32px 36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
});

const BigEmoji = styled('div')({
  fontSize: '3rem',
  lineHeight: 1,
});

const StepTitle = styled('div')({
  fontFamily: 'Palatino Linotype, serif',
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#ede0ff',
  textAlign: 'center',
  textShadow: '0 0 12px #9333ea',
});

const StepBody = styled('div')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.85rem',
  color: '#a5b4fc',
  lineHeight: 1.6,
  textAlign: 'center',
  maxWidth: '340px',
});

const Dots = styled('div')({
  display: 'flex',
  gap: '6px',
});

const Dot = styled('div')(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: active ? '#9333ea' : 'rgba(180,90,255,0.25)',
  transition: 'background 0.2s',
}));

const NavRow = styled('div')({
  display: 'flex',
  gap: '12px',
  width: '100%',
  justifyContent: 'flex-end',
  marginTop: '4px',
});

const Btn = styled('button')(({ primary }) => ({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '8px 22px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: primary ? 'none' : '1px solid rgba(180,90,255,0.4)',
  background: primary
    ? 'linear-gradient(135deg, #4c1d95, #7c3aed)'
    : 'transparent',
  color: primary ? '#ede0ff' : '#8b95c9',
  transition: 'filter 0.15s',
  '&:hover': { filter: 'brightness(1.2)' },
}));

export default function Tutorial() {
  const { game, markTutorialSeen } = useGame();
  const [step, setStep] = useState(0);

  if (game.tutorialSeen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <Overlay>
      <Panel>
        <BigEmoji>{current.emoji}</BigEmoji>
        <StepTitle>{current.title}</StepTitle>
        <StepBody>{current.body}</StepBody>
        <Dots>
          {STEPS.map((_, i) => <Dot key={i} active={i === step ? 'true' : undefined} />)}
        </Dots>
        <NavRow>
          <Btn onClick={markTutorialSeen}>Skip</Btn>
          {isLast
            ? <Btn primary="true" onClick={markTutorialSeen}>Let's Go</Btn>
            : <Btn primary="true" onClick={() => setStep(s => s + 1)}>Next →</Btn>
          }
        </NavRow>
      </Panel>
    </Overlay>
  );
}
