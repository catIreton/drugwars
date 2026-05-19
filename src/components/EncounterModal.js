import React, { useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { useGame } from './GameContext';
import { playEncounter } from '../utils/sounds';

const flash = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.5); }
  50%       { box-shadow: 0 0 30px rgba(59,130,246,0.5), inset 0 0 20px rgba(59,130,246,0.04); border-color: rgba(59,130,246,0.5); }
`;

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 15, 0.88)',
  backdropFilter: 'blur(5px)',
});

const Panel = styled('div')({
  width: '400px',
  maxWidth: '95vw',
  background: 'linear-gradient(160deg, #0a0010 0%, #130008 100%)',
  border: '1px solid rgba(239,68,68,0.5)',
  borderRadius: '12px',
  padding: '28px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  animation: `${flash} 1.1s ease-in-out infinite`,
});

const Headline = styled('div')({
  fontFamily: 'Courier New, monospace',
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#ef4444',
  textShadow: '0 0 10px rgba(239,68,68,0.6)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const Body = styled('div')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
  color: '#cbd5e1',
  lineHeight: 1.6,
});

const Stat = styled('span')({
  color: '#f87171',
  fontWeight: 700,
});

const Divider = styled('div')({
  height: '1px',
  background: 'rgba(239,68,68,0.2)',
});

const ChoiceButton = styled('button')(({ variant }) => {
  const colors = {
    pay:   { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)',  border: 'rgba(212,175,55,0.4)' },
    run:   { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.4)' },
    dump:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)' },
    bribe: { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.4)' },
  };
  const c = colors[variant] || colors.pay;
  return {
    width: '100%',
    fontFamily: 'Courier New, monospace',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: c.color,
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: '6px',
    padding: '9px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    '&:hover': { filter: 'brightness(1.25)' },
  };
});

const Sub = styled('div')({
  fontSize: '0.7rem',
  color: '#64748b',
  marginTop: '2px',
  fontWeight: 400,
  letterSpacing: '0.04em',
});

export default function EncounterModal() {
  const { game, resolveEncounter } = useGame();
  const enc = game.pendingEncounter;

  useEffect(() => {
    if (enc) playEncounter();
  }, [enc]);

  if (!enc) return null;

  const escapeChance = Math.round((0.4 + game.crew * 0.1) * 100);

  return (
    <Overlay>
      <Panel>
        <Headline>
          <LocalPoliceIcon sx={{ fontSize: '1.3rem' }} />
          Police Encounter
        </Headline>

        <Body>
          You've been spotted. Officers are approaching.<br />
          Fine: <Stat>${enc.fine.toLocaleString()}</Stat> &nbsp;|&nbsp;
          Crew: <Stat>{game.crew}</Stat> &nbsp;|&nbsp;
          Heat: <Stat>{game.wantedLevel}/5</Stat>
        </Body>

        <Divider />

        <ChoiceButton variant="pay" onClick={() => resolveEncounter('pay')}>
          💰 Pay the Fine — ${enc.fine.toLocaleString()}
          <Sub>Lose cash, heat -1</Sub>
        </ChoiceButton>

        <ChoiceButton variant="run" onClick={() => resolveEncounter('run')}>
          🏃 Run for It — {escapeChance}% escape chance
          <Sub>Success: walk free. Fail: lose 25% bag, heat +1</Sub>
        </ChoiceButton>

        <ChoiceButton variant="dump" onClick={() => resolveEncounter('dump')}>
          📦 Dump the Bag
          <Sub>Drop everything, heat -2</Sub>
        </ChoiceButton>

        {game.cash >= enc.fine * 2 && (
          <ChoiceButton variant="bribe" onClick={() => resolveEncounter('bribe')}>
            💜 Bribe the Officer — ${(enc.fine * 2).toLocaleString()}
            <Sub>Pay 2× fine, walk clean — heat -2</Sub>
          </ChoiceButton>
        )}
      </Panel>
    </Overlay>
  );
}
