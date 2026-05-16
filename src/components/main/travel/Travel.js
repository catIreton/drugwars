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
  flex: '1',
  textAlign: 'center',
});

const TravelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

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

  return (
    <CurrentLocContainer>
      <h1>Kansas City, MO</h1>
      <h2>{game.location}</h2>
      <img
        style={game.locationSrc ? { height: '200px', width: '200px' } : { display: 'none' }}
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

  const left = LOCATIONS.slice(0, 4);
  const right = LOCATIONS.slice(4);

  return (
    <div style={{ flex: '1' }}>
      <h2>Travel To</h2>
      <TravelContainer>
        <div style={{ flex: '1', paddingTop: '15px' }}>
          {left.map(({ name, src, ButtonComponent }) =>
            ButtonComponent === 'primary' ? (
              <PrimaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)}>
                <TaxiIcon />{name}
              </PrimaryButton>
            ) : (
              <SecondaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)}>
                <TaxiIcon />{name}
              </SecondaryButton>
            )
          )}
        </div>
        <div style={{ flex: '1', paddingTop: '15px' }}>
          {right.map(({ name, src, ButtonComponent }) =>
            ButtonComponent === 'primary' ? (
              <PrimaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)}>
                <TaxiIcon />{name}
              </PrimaryButton>
            ) : (
              <SecondaryButton key={name} variant="contained" onClick={() => handleTravel(name, src)}>
                <TaxiIcon />{name}
              </SecondaryButton>
            )
          )}
        </div>
      </TravelContainer>
    </div>
  );
}

export { Travel, CurrentLoc };
