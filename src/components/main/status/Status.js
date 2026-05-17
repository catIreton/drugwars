import React from 'react';

import { styled } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import SunnyDay from '../../../images/sunnyday.jpg';
import { useGame } from '../../GameContext';

const StatusContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  alignItems: 'stretch',
  '& h1': {
    fontSize: '0.95rem',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#667eea',
  },
});

const StatusText = styled('div')({
  fontSize: '0.9em',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '& p': {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: '#2d3748',
  },
  '& b': {
    color: '#667eea',
    fontWeight: '600',
  },
});

const StatusImageSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const StatusPhoto = styled('img')({
  height: '100px',
  width: '100px',
  borderRadius: '8px',
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
});

const WantedLevelContainer = styled('div')({
  display: 'flex',
  gap: '3px',
  justifyContent: 'center',
});

const PoliceIcon = styled(LocalPoliceIcon)({
  fontSize: '1rem',
  transition: 'color 0.2s ease',
});

function Status() {
  const { game } = useGame();
  
  const getWantedLevelColor = (level) => {
    if (level === 0) return '#10b981'; // green
    if (level <= 2) return '#f59e0b'; // amber
    if (level <= 4) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <StatusContainer>
      <StatusText>
        <div>
          <h1>Kansas City</h1>
          <p style={{ margin: '2px 0' }}><b>Day:</b> {game.day}/60</p>
          <p style={{ margin: '2px 0' }}><b>Cash:</b> ${game.cash}</p>
          <p style={{ margin: '2px 0' }}><b>Debt:</b> ${game.debt}</p>
          <p style={{ margin: '2px 0' }}><b>Prestige:</b> {game.prestige}/100</p>
          <p style={{ margin: '2px 0' }}><b>Crew:</b> {game.crew}</p>
          <div style={{ margin: '6px 0' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem' }}><b>Heat Level:</b></p>
            <WantedLevelContainer>
              {[...Array(5)].map((_, i) => (
                <PoliceIcon
                  key={i}
                  sx={{
                    color: i < game.wantedLevel ? getWantedLevelColor(game.wantedLevel) : '#e5e7eb',
                    opacity: i < game.wantedLevel ? 1 : 0.3,
                  }}
                />
              ))}
            </WantedLevelContainer>
          </div>
        </div>
      </StatusText>
      <StatusImageSection>
        <StatusPhoto src={SunnyDay} alt="Sunny Day" />
        <p style={{ margin: '0', fontSize: '0.8rem', textAlign: 'center', color: '#667eea', fontWeight: '600' }}>{game.weather}</p>
      </StatusImageSection>
    </StatusContainer>
  );
}

export default Status;
