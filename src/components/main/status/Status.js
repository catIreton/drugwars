import React from 'react';

import { styled } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import SunnyDay from '../../../images/sunnyday.jpg';
import { useGame } from '../../GameContext';

const StatusContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  height: '100%',
});

const StatsPanel = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: 0,
});

const HeaderRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '6px',
  marginBottom: '2px',
});

const Title = styled('h1')({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#667eea',
});

const DayBadge = styled('span')({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#764ba2',
  background: 'rgba(102, 126, 234, 0.1)',
  padding: '2px 8px',
  borderRadius: '12px',
});

const FinanceRow = styled('div')({
  display: 'flex',
  gap: '8px',
});

const FinanceStat = styled('div')({
  flex: 1,
  background: 'rgba(102, 126, 234, 0.06)',
  borderRadius: '8px',
  padding: '5px 8px',
  display: 'flex',
  flexDirection: 'column',
});

const StatLabel = styled('span')({
  fontSize: '0.7rem',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const StatValue = styled('span')({
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#2d3748',
});

const IconRow = styled('div')({
  display: 'flex',
  gap: '8px',
});

const IconStat = styled('div')({
  flex: 1,
  background: 'rgba(102, 126, 234, 0.06)',
  borderRadius: '8px',
  padding: '5px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
});

const IconGroup = styled('div')({
  display: 'flex',
  gap: '1px',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const HeatRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(102, 126, 234, 0.06)',
  borderRadius: '8px',
  padding: '5px 8px',
});

const WeatherPanel = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
});

const StatusPhoto = styled('img')({
  height: '90px',
  width: '90px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
  objectFit: 'cover',
});

function Status() {
  const { game } = useGame();

  const getWantedColor = (level) => {
    if (level === 0) return '#10b981';
    if (level <= 2) return '#f59e0b';
    if (level <= 4) return '#f97316';
    return '#ef4444';
  };

  const prestigeStars = Math.round((game.prestige / 100) * 5);
  const crewDisplay = Math.min(game.crew, 6);
  const crewOverflow = game.crew > 6 ? game.crew - 6 : 0;

  return (
    <StatusContainer>
      <StatsPanel>
        <HeaderRow>
          <Title>Kansas City</Title>
          <DayBadge>Day {game.day}/60</DayBadge>
        </HeaderRow>

        <FinanceRow>
          <FinanceStat>
            <StatLabel>Cash</StatLabel>
            <StatValue style={{ color: '#059669' }}>${game.cash.toLocaleString()}</StatValue>
          </FinanceStat>
          <FinanceStat>
            <StatLabel>Debt</StatLabel>
            <StatValue style={{ color: '#ef4444' }}>${game.debt.toLocaleString()}</StatValue>
          </FinanceStat>
        </FinanceRow>

        <IconRow>
          <IconStat>
            <StatLabel>Prestige</StatLabel>
            <IconGroup>
              {[...Array(5)].map((_, i) =>
                i < prestigeStars
                  ? <StarIcon key={i} sx={{ fontSize: '1rem', color: '#D4AF37' }} />
                  : <StarBorderIcon key={i} sx={{ fontSize: '1rem', color: '#d1d5db' }} />
              )}
            </IconGroup>
          </IconStat>
          <IconStat>
            <StatLabel>Crew</StatLabel>
            <IconGroup>
              {game.crew === 0
                ? <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>None</span>
                : <>
                    {[...Array(crewDisplay)].map((_, i) => (
                      <PersonIcon key={i} sx={{ fontSize: '1rem', color: '#667eea' }} />
                    ))}
                    {crewOverflow > 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#667eea', fontWeight: 600 }}>+{crewOverflow}</span>
                    )}
                  </>
              }
            </IconGroup>
          </IconStat>
        </IconRow>

        <HeatRow>
          <StatLabel style={{ marginRight: '4px' }}>Heat</StatLabel>
          {[...Array(5)].map((_, i) =>
            i < game.wantedLevel
              ? <LocalPoliceIcon key={i} sx={{ fontSize: '1rem', color: getWantedColor(game.wantedLevel) }} />
              : <LocalPoliceOutlinedIcon key={i} sx={{ fontSize: '1rem', color: '#d1d5db' }} />
          )}
        </HeatRow>
      </StatsPanel>

      <WeatherPanel>
        <StatusPhoto src={SunnyDay} alt="Weather" />
        <span style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: 600 }}>{game.weather}</span>
      </WeatherPanel>
    </StatusContainer>
  );
}

export default Status;
