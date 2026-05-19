import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import StarIcon from '@mui/icons-material/Star';
import { useGame } from './GameContext';
import { playGameOver } from '../utils/sounds';
import { saveHighScore, loadHighScores } from '../gameState';

const PRESTIGE_MULTIPLIER = 200;

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

const DIFF_RANK = { easy: 'E', normal: 'N', hard: 'H' };

export default function GameOver() {
  const { game, resetGame } = useGame();
  const { netWorth, prestigeBonus, total } = calcScore(game);
  const won = total > 0 && !game.bankrupted;
  const bankrupt = game.bankrupted;

  useEffect(() => {
    playGameOver();
    saveHighScore({
      score: total,
      date: new Date().toLocaleDateString(),
      difficulty: game.difficulty ?? 'normal',
      day: game.day,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const highScores = loadHighScores();

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
          <StatRow>
            <StatLabel>Difficulty</StatLabel>
            <span style={{
              color: game.difficulty === 'hard' ? '#ef4444' : game.difficulty === 'easy' ? '#10b981' : '#8b95c9',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.82rem',
            }}>
              {game.difficulty ?? 'normal'}
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

        {highScores.length > 0 && (
          <div style={{ width: '100%' }}>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8 }}>
              — Hall of Fame —
            </div>
            {highScores.map((entry, i) => (
              <StatRow key={i} style={{ opacity: entry.score === total && entry.date === new Date().toLocaleDateString() ? 1 : 0.7 }}>
                <StatLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: i === 0 ? '#D4AF37' : '#64748b', fontWeight: i === 0 ? 700 : 400 }}>#{i + 1}</span>
                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>{entry.date}</span>
                  <span style={{ fontSize: '0.65rem', color: entry.difficulty === 'hard' ? '#ef4444' : entry.difficulty === 'easy' ? '#10b981' : '#8b95c9', border: '1px solid currentColor', borderRadius: '3px', padding: '0 3px' }}>{DIFF_RANK[entry.difficulty] ?? 'N'}</span>
                </StatLabel>
                <span style={{ color: entry.score >= 0 ? '#D4AF37' : '#ef4444', fontWeight: 600 }}>
                  {entry.score >= 0 ? '$' : '-$'}{Math.abs(entry.score).toLocaleString()}
                </span>
              </StatRow>
            ))}
          </div>
        )}

        <PlayAgainButton onClick={resetGame}>
          ▶ Play Again
        </PlayAgainButton>
      </Panel>
    </Overlay>
  );
}
