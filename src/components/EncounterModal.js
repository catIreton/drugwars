import React, { useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { useGame } from './GameContext';
import { playEncounter } from '../utils/sounds';

const flash = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.5); }
  50%       { box-shadow: 0 0 30px rgba(59,130,246,0.5), inset 0 0 20px rgba(59,130,246,0.04); border-color: rgba(59,130,246,0.5); }
`;

const deaFlash = keyframes`
  0%, 100% { box-shadow: 0 0 40px rgba(234,179,8,0.6), inset 0 0 20px rgba(234,179,8,0.06); border-color: rgba(234,179,8,0.6); }
  50%       { box-shadow: 0 0 40px rgba(239,68,68,0.6), inset 0 0 20px rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.6); }
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
    pay:         { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)',  border: 'rgba(212,175,55,0.4)' },
    run:         { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.4)' },
    dump:        { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)' },
    bribe:       { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.4)' },
    decline:     { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.4)' },
    accept_deal: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)' },
    dea_pay:     { color: '#eab308', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.4)' },
    dea_dump:    { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)' },
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
  const type = enc.type ?? 'normal';

  if (type === 'sting') {
    return (
      <Overlay>
        <Panel style={{ borderColor: 'rgba(250,204,21,0.5)', animation: `${deaFlash} 1.4s ease-in-out infinite` }}>
          <Headline style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.6)' }}>
            <LocalPoliceIcon sx={{ fontSize: '1.3rem' }} />
            Undercover Officer
          </Headline>
          <Body>
            A plainclothes officer approaches you looking to buy.<br />
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>This is a setup.</span> Accepting the deal is an instant bust with no way out.<br />
            Heat: <Stat>{game.wantedLevel}/5</Stat>
          </Body>
          <Divider />
          <ChoiceButton variant="decline" onClick={() => resolveEncounter('decline')}>
            🚶 Decline the Deal — Walk Away
            <Sub>You're suspicious. Heat +1, no arrest.</Sub>
          </ChoiceButton>
          <ChoiceButton variant="accept_deal" onClick={() => resolveEncounter('accept_deal')}>
            💀 Accept the Deal — INSTANT BUST
            <Sub>No run option. Lose 25% bag, heat +2, busted on record.</Sub>
          </ChoiceButton>
        </Panel>
      </Overlay>
    );
  }

  if (type === 'dea') {
    return (
      <Overlay>
        <Panel style={{ borderColor: 'rgba(234,179,8,0.6)', animation: `${deaFlash} 0.9s ease-in-out infinite` }}>
          <Headline style={{ color: '#eab308', textShadow: '0 0 10px rgba(234,179,8,0.6)' }}>
            <LocalPoliceIcon sx={{ fontSize: '1.3rem' }} />
            DEA Task Force Raid
          </Headline>
          <Body>
            Federal agents have been building a case on your large transactions.<br />
            Fine: <Stat>${enc.fine.toLocaleString()}</Stat> &nbsp;|&nbsp;
            Heat: <Stat>{game.wantedLevel}/5</Stat>
          </Body>
          <Divider />
          <ChoiceButton variant="dea_pay" onClick={() => resolveEncounter('dea_pay')}>
            💰 Pay the Federal Fine — ${enc.fine.toLocaleString()}
            <Sub>DEA heat clears. Heat -1.</Sub>
          </ChoiceButton>
          <ChoiceButton variant="dea_dump" onClick={() => resolveEncounter('dea_dump')}>
            📦 Cooperate — Dump Everything
            <Sub>Lose all drugs. DEA heat clears. Heat -2.</Sub>
          </ChoiceButton>
        </Panel>
      </Overlay>
    );
  }

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
