import React, { useEffect, useRef, useState } from 'react';

import { styled } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import GrainIcon from '@mui/icons-material/Grain';
import AirIcon from '@mui/icons-material/Air';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useGame } from '../../GameContext';

const WEATHER_MAP = {
  sunny:   { Icon: WbSunnyIcon,    color: '#f59e0b' },
  cloudy:  { Icon: WbCloudyIcon,   color: '#94a3b8' },
  rainy:   { Icon: GrainIcon,      color: '#60a5fa' },
  snowy:   { Icon: AcUnitIcon,     color: '#bae6fd' },
  stormy:  { Icon: ThunderstormIcon, color: '#c084fc' },
  windy:   { Icon: AirIcon,        color: '#6ee7b7' },
  night:   { Icon: NightsStayIcon, color: '#818cf8' },
};

function getWeatherEntry(weather) {
  const key = weather?.toLowerCase() ?? '';
  return WEATHER_MAP[key] ?? WEATHER_MAP.sunny;
}

const StatusContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

const HeaderRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '6px',
});

const Title = styled('h1')({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#667eea',
});

const WeatherWidget = styled('div')(({ wxcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: wxcolor,
  background: `${wxcolor}18`,
  border: `1px solid ${wxcolor}55`,
  borderRadius: '4px',
  padding: '2px 7px 2px 5px',
}));

const DayBadge = styled('span')({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#764ba2',
  background: 'rgba(102, 126, 234, 0.1)',
  padding: '2px 8px',
  borderRadius: '12px',
  whiteSpace: 'nowrap',
});

const FinanceRow = styled('div')({
  display: 'flex',
  gap: '8px',
  flex: 1,
  margin: '6px 0',
});

const FinanceStat = styled('div')({
  flex: 1,
  background: 'rgba(102, 126, 234, 0.06)',
  borderRadius: '8px',
  padding: '5px 8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const StatLabel = styled('span')({
  fontSize: '0.7rem',
  color: '#8b95c9',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 600,
});

const StatValue = styled('span')({
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#2d3748',
});

const flashGreen = `
  @keyframes flashGreen {
    0%   { background: rgba(16,185,129,0.35); }
    100% { background: transparent; }
  }
`;
const flashRed = `
  @keyframes flashRed {
    0%   { background: rgba(239,68,68,0.35); }
    100% { background: transparent; }
  }
`;

const IconRow = styled('div')({
  display: 'flex',
  gap: '8px',
  flex: 1,
  margin: '0 0 6px 0',
});

const IconStat = styled('div')({
  flex: 1,
  background: 'rgba(102, 126, 234, 0.06)',
  borderRadius: '8px',
  padding: '5px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  justifyContent: 'center',
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

function useFlash(value, up = true) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (value !== prev.current) {
      const increased = value > prev.current;
      setFlash(increased === up ? 'green' : 'red');
      const t = setTimeout(() => setFlash(null), 700);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value, up]);

  return flash;
}

function Status() {
  const { game } = useGame();
  const cashFlash = useFlash(game.cash, true);
  const debtFlash = useFlash(game.debt, false);

  const getWantedColor = (level) => {
    if (level === 0) return '#10b981';
    if (level <= 2) return '#f59e0b';
    if (level <= 4) return '#f97316';
    return '#ef4444';
  };

  const prestigeStars = Math.round((game.prestige / 100) * 5);
  const crewDisplay = Math.min(game.crew, 6);
  const crewOverflow = game.crew > 6 ? game.crew - 6 : 0;
  const { Icon: WeatherIcon, color: wxColor } = getWeatherEntry(game.weather);

  return (
    <StatusContainer>
      <HeaderRow>
        <WeatherWidget wxcolor={wxColor}>
          <WeatherIcon sx={{ fontSize: '0.95rem' }} />
          {game.weather}
        </WeatherWidget>
        <Title>Kansas City</Title>
        <DayBadge>Day {game.day}/60</DayBadge>
      </HeaderRow>

      <style>{flashGreen}{flashRed}</style>
      <FinanceRow>
        <FinanceStat style={{
          animation: cashFlash ? `flash${cashFlash === 'green' ? 'Green' : 'Red'} 0.7s ease-out` : undefined,
          borderRadius: '8px',
        }}>
          <StatLabel>Cash</StatLabel>
          <StatValue style={{ color: '#059669' }}>${game.cash.toLocaleString()}</StatValue>
        </FinanceStat>
        <FinanceStat style={{
          animation: debtFlash ? `flash${debtFlash === 'green' ? 'Green' : 'Red'} 0.7s ease-out` : undefined,
          borderRadius: '8px',
        }}>
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
    </StatusContainer>
  );
}

export default Status;
