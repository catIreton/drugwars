import React from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { useGame } from '../../GameContext';

import Northtown from '../../../images/northtown.jpg';
import Plaza from '../../../images/plaza.jpg';
import Downtown from '../../../images/downtown.jpg';
import Westport from '../../../images/westport.jfif';
import Brookside from '../../../images/brookside.jpg';
import MartinCity from '../../../images/martincity.jpg';
import Independence from '../../../images/independence.jpg';
import JOCO from '../../../images/joco.jpg';

const PrimaryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: '12px',
  marginRight: '12px',
  background: theme.palette.accent2.main,
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  marginBottom: '12px',
  marginRight: '12px',
  background: theme.palette.accent.main,
}));

const TaxiIcon = styled(LocalTaxiIcon)({
  marginRight: '5px',
});

const CurrentLocContainer = styled('div')({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const TravelContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '4px',
  flexGrow: 1,
});

const LOCATION_COLORS = {
  'Northtown': '#8B4513',    // Brown - street/urban
  'Plaza': '#D4AF37',         // Gold - high-end market
  'Downtown': '#2C3E50',      // Dark blue - business district
  'Westport': '#E74C3C',      // Red - party scene
  'Brookside': '#27AE60',     // Green - local/nature
  'Martin City': '#7D3C0C',   // Dark brown - street life
  'Independence': '#9B59B6',  // Purple - suburban
  'JOCO': '#3498DB',          // Light blue - wealthy suburbs
};

const LOCATIONS = [
  { name: 'Northtown', src: Northtown, ButtonComponent: 'primary' },
  { name: 'Plaza', src: Plaza, ButtonComponent: 'secondary' },
  { name: 'Downtown', src: Downtown, ButtonComponent: 'primary' },
  { name: 'Westport', src: Westport, ButtonComponent: 'secondary' },
  { name: 'Brookside', src: Brookside, ButtonComponent: 'secondary' },
  { name: 'Martin City', src: MartinCity, ButtonComponent: 'primary' },
  { name: 'Independence', src: Independence, ButtonComponent: 'secondary' },
  { name: 'JOCO', src: JOCO, ButtonComponent: 'primary' },
];

function CurrentLoc() {
  const { game } = useGame();
  const locationColor = LOCATION_COLORS[game.location] || '#000000';

  return (
    <CurrentLocContainer>
      <h1 style={{ margin: '0 0 2px 0', fontSize: '1.1rem' }}>Kansas City, MO</h1>
      <h2 style={{ margin: '0 0 10px 0', color: locationColor, fontSize: '1.3rem' }}>{game.location}</h2>
      <img
        style={game.locationSrc ? { height: '150px', width: '150px', borderRadius: '8px' } : { display: 'none' }}
        src={game.locationSrc}
        alt={game.location}
      />
    </CurrentLocContainer>
  );
}

function Travel() {
  const { game, updateGame } = useGame();

  function handleTravel(name, src) {
    updateGame({ location: name, locationSrc: src, day: game.day + 1 });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Travel To</h2>
      <TravelContainer>
        {LOCATIONS.map(({ name, src, ButtonComponent }) =>
          ButtonComponent === 'primary' ? (
            <PrimaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)} fullWidth size="small" sx={{ fontSize: '0.75rem' }}>
              <TaxiIcon sx={{ fontSize: '1rem' }} />{name}
            </PrimaryButton>
          ) : (
            <SecondaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)} fullWidth size="small" sx={{ fontSize: '0.75rem' }}>
              <TaxiIcon sx={{ fontSize: '1rem' }} />{name}
            </SecondaryButton>
          )
        )}
      </TravelContainer>
    </div>
  );
}

export { Travel, CurrentLoc };
