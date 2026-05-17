import React from 'react';
import CalendarModal from '../Calendar/calendar';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useGame } from '../../GameContext';

const PrimaryButton = styled(Button)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  fontWeight: '600',
  fontSize: '0.8rem',
  padding: '6px 12px',
  borderRadius: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
});

const SecondaryButton = styled(Button)({
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: '#ffffff',
  fontWeight: '600',
  fontSize: '0.8rem',
  padding: '6px 12px',
  borderRadius: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
    transform: 'translateY(-2px)',
  },
});

function Actions() {
  const { dumpBag } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#667eea' }}>Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '0.8rem', width: '100%' }}>
        <PrimaryButton variant="contained" onClick={dumpBag} size="small" fullWidth>Dump</PrimaryButton>
        <SecondaryButton variant="contained" size="small" fullWidth>Buy</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth>Sell</PrimaryButton>
        <CalendarModal />
        <SecondaryButton variant="contained" size="small" fullWidth>Finances</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth>Store</PrimaryButton>
        <SecondaryButton variant="contained" size="small" fullWidth>Loan</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth>Use Item</PrimaryButton>
      </div>
    </div>
  );
}

export default Actions;
