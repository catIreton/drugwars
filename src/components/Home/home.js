import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Icon } from '@mui/material';
import DrugDealer from '../../images/drug_dealer.svg';

import { styled } from '@mui/material/styles';
import * as ROUTES from '../../constants/routes';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledIcon = styled(Icon)({
  width: '100px',
  height: '100px',
  paddingTop: '30px',
});

const StyledTitle = styled('h1')({
  fontSize: '80px',
  fontFamily: 'Palatino Linotype',
});

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.MAIN);
  }, [navigate]);

  return (
    <StyledContainer>
      <CssBaseline />
      <StyledIcon>
        <img
          src={DrugDealer}
          color="primary"
          alt="Drug Dealer"
          height={100}
          width={100}
        />
      </StyledIcon>
      <StyledTitle>Drug Wars 2026</StyledTitle>
    </StyledContainer>
  );
}

export default HomePage;
