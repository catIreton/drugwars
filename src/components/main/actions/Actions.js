import React from 'react';
import CalendarModal from '../Calendar/calendar';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ActionsRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

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

function Actions() {
  return (
    <div style={{ flex: '1' }}>
      <h2>Actions</h2>
      <ActionsRow>
        <div style={{ flex: '1', paddingTop: '15px' }}>
          <PrimaryButton variant="contained">Dump</PrimaryButton>
          <SecondaryButton variant="contained">Buy</SecondaryButton>
          <PrimaryButton variant="contained">Sell</PrimaryButton>
          <CalendarModal />
        </div>
        <div style={{ flex: '1', paddingTop: '15px' }}>
          <SecondaryButton variant="contained">Finances</SecondaryButton>
          <PrimaryButton variant="contained">Store</PrimaryButton>
          <SecondaryButton variant="contained">Loan</SecondaryButton>
          <PrimaryButton variant="contained">Use Item</PrimaryButton>
        </div>
      </ActionsRow>
    </div>
  );
}

export default Actions;
