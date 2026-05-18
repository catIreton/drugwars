import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import StarIcon from '@mui/icons-material/Star';
import { useGame } from './GameContext';
import { playGameOver } from '../utils/sounds';

const PRESTIGE_MULTIPLIER = 500;

function calcScore(game) {
  const netWorth = game.cash - game.debt;
  const prestigeBonus = Math.round(game.prestige * PRESTIGE_MULTIPLIER);
  return { netWorth, prestigeBonus, total: netWorth + prestigeBonus };
}

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(5, 0, 15, 0.92)',
  backdropFilter: 'blur(6px)',
});

const Panel = styled('div')({
  width: '480px',
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

const Headline = styled('div')({
  fontFamily: 'Palatino Linotype, Palatino, serif',
  fontSize: '2rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textAlign: 'center',
});

const Subline = styled('div')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.8rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#8b95c9',
});

const Divider = styled('div')({
  width: '100%',
  height: '1px',
  background: 'rgba(180, 90, 255, 0.25)',
});

const StatGrid = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const StatRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.9rem',
});

const StatLabel = styled('span')({
  color: '#8b95c9',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontSize: '0.78rem',
});

const ScoreRow = styled(StatRow)({
  marginTop: '4px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(212,175,55,0.4)',
  fontSize: '1.1rem',
  fontWeight: 700,
});

const PlayAgainButton = styled('button')({
  marginTop: '4px',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.9rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#D4AF37',
  background: 'rgba(212,175,55,0.1)',
  border: '1px solid rgba(212,175,55,0.5)',
  borderRadius: '8px',
  padding: '10px 32px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: 'rgba(212,175,55,0.2)',
    boxShadow: '0 0 12px rgba(212,175,55,0.3)',
  },
});

function fmt(n) {
  const abs = Math.abs(n).toLocaleString();
  return n < 0 ? `-$${abs}` : `$${abs}`;
}

export default function GameOver() {
  const { game, resetGame } = useGame();
  const { netWorth, prestigeBonus, total } = calcScore(game);
  const won = total > 0 && !game.bankrupted;
  const bankrupt = game.bankrupted;

  useEffect(() => { playGameOver(); }, []);

  const prestigeStars = Math.min(5, Math.round((game.prestige / 100) * 5));

  return (
    <Overlay>
      <Panel>
        {won
          ? <EmojiEventsIcon sx={{ fontSize: '3rem', color: '#D4AF37', filter: 'drop-shadow(0 0 10px #D4AF37)' }} />
          : <SentimentVeryDissatisfiedIcon sx={{ fontSize: '3rem', color: '#ef4444', filter: 'drop-shadow(0 0 10px #ef4444)' }} />
        }

        <div style={{ textAlign: 'center' }}>
          <Headline style={{ color: won ? '#ede0ff' : '#ef4444', textShadow: won ? '0 0 16px #9333ea' : '0 0 16px #ef4444' }}>
            {bankrupt ? 'The Loan Shark Found You.' : won ? 'You Made It.' : 'Busted.'}
          </Headline>
          <Subline style={{ marginTop: '6px' }}>
            {bankrupt ? 'Debt collector collected — permanently' : won ? '60 days on the KC streets' : 'The streets won this time'}
          </Subline>
        </div>

        <Divider />

        <StatGrid>
          <StatRow>
            <StatLabel>Cash</StatLabel>
            <span style={{ color: '#10b981' }}>{fmt(game.cash)}</span>
          </StatRow>
          <StatRow>
            <StatLabel>Debt</StatLabel>
            <span style={{ color: '#ef4444' }}>{fmt(-game.debt)}</span>
          </StatRow>
          <StatRow>
            <StatLabel>Net Worth</StatLabel>
            <span style={{ color: netWorth >= 0 ? '#10b981' : '#ef4444' }}>{fmt(netWorth)}</span>
          </StatRow>
          <StatRow>
            <StatLabel>
              Prestige Bonus&nbsp;
              {[...Array(prestigeStars)].map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: '0.8rem', color: '#D4AF37', verticalAlign: 'middle' }} />
              ))}
            </StatLabel>
            <span style={{ color: '#D4AF37' }}>+{fmt(prestigeBonus)}</span>
          </StatRow>
          <StatRow>
            <StatLabel style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LocalPoliceIcon sx={{ fontSize: '0.9rem' }} /> Heat at end
            </StatLabel>
            <span style={{ color: game.wantedLevel >= 4 ? '#ef4444' : '#8b95c9' }}>
              Level {game.wantedLevel}
            </span>
          </StatRow>

          {game.stats && (
            <>
              <StatRow><StatLabel>Total Profit</StatLabel><span style={{ color: '#6ee7b7' }}>${(game.stats.totalProfit ?? 0).toLocaleString()}</span></StatRow>
              <StatRow><StatLabel>Biggest Trade</StatLabel><span style={{ color: '#a5b4fc' }}>${(game.stats.biggestTrade ?? 0).toLocaleString()}</span></StatRow>
              <StatRow><StatLabel>Drugs Traded</StatLabel><span style={{ color: '#a5b4fc' }}>{(game.stats.drugsTraded ?? 0).toLocaleString()} units</span></StatRow>
              <StatRow><StatLabel>Times Busted</StatLabel><span style={{ color: game.stats.timesBusted > 0 ? '#f87171' : '#6ee7b7' }}>{game.stats.timesBusted ?? 0}</span></StatRow>
            </>
          )}

          <ScoreRow>
            <StatLabel style={{ color: '#D4AF37', fontSize: '0.85rem' }}>Final Score</StatLabel>
            <span style={{ color: total >= 0 ? '#D4AF37' : '#ef4444', textShadow: total >= 0 ? '0 0 8px #D4AF37' : 'none' }}>
              {fmt(total)}
            </span>
          </ScoreRow>
        </StatGrid>

        <PlayAgainButton onClick={resetGame}>
          ▶ Play Again
        </PlayAgainButton>
      </Panel>
    </Overlay>
  );
}
