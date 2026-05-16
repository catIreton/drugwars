import React from 'react';

import { styled } from '@mui/material/styles';
import SunnyDay from '../../../images/sunnyday.jpg';
import { useGame } from '../../GameContext';

const StatusContainer = styled('div')({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

const StatusPhoto = styled('img')({
  height: '200px',
  width: '200px',
  marginTop: '20px',
});

function Status() {
  const { game } = useGame();

  return (
    <StatusContainer>
      <div style={{ flex: '1' }}>
        <p><b>Day:</b> {game.day}/60</p>
        <p><b>Cash:</b> ${game.cash}</p>
        <p><b>Debt:</b> ${game.debt}</p>
        <p><b>Prestige:</b> {game.prestige}/100</p>
        <p><b>Crew:</b> {game.crew}</p>
        <p><b>Wanted Level:</b> {game.wantedLevel}</p>
        <p><b>Weather:</b> {game.weather}</p>
      </div>
      <div style={{ flex: '1' }}>
        <StatusPhoto src={SunnyDay} alt="Sunny Day" />
      </div>
    </StatusContainer>
  );
}

export default Status;
