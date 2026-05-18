import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useGame } from './GameContext';
import { playAchievement } from '../utils/sounds';

const Toast = styled('div')({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9998,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'linear-gradient(135deg, #0d001a 0%, #1e0040 100%)',
  border: '1px solid rgba(212,175,55,0.6)',
  borderRadius: '12px',
  padding: '12px 18px',
  boxShadow: '0 0 24px rgba(212,175,55,0.35), 0 8px 32px rgba(0,0,0,0.7)',
  animation: 'slideUp 0.4s ease-out',
  '@keyframes slideUp': {
    from: { transform: 'translateY(80px)', opacity: 0 },
    to:   { transform: 'translateY(0)',    opacity: 1 },
  },
  cursor: 'pointer',
  maxWidth: '320px',
});

const Emoji = styled('span')({
  fontSize: '1.8rem',
  lineHeight: 1,
});

const TextBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const Label = styled('span')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#D4AF37',
});

const Title = styled('span')({
  fontFamily: 'Palatino Linotype, serif',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#ede0ff',
});

const Desc = styled('span')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.72rem',
  color: '#8b95c9',
});

export default function AchievementToast() {
  const { game, dismissAchievement } = useGame();
  const ach = game.pendingAchievement;

  useEffect(() => {
    if (!ach) return;
    playAchievement();
    const t = setTimeout(dismissAchievement, 4000);
    return () => clearTimeout(t);
  }, [ach, dismissAchievement]);

  if (!ach) return null;

  return (
    <Toast onClick={dismissAchievement}>
      <Emoji>{ach.emoji}</Emoji>
      <TextBlock>
        <Label>Achievement Unlocked</Label>
        <Title>{ach.label}</Title>
        <Desc>{ach.description}</Desc>
      </TextBlock>
    </Toast>
  );
}
