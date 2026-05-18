import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useGame } from '../../GameContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const PrimaryButton = styled(Button)({
  background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '0.85rem',
  padding: '8px 12px',
  borderRadius: '8px',
  textTransform: 'none',
  letterSpacing: '0.2px',
  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.15)',
  transition: 'all 0.18s ease',
  border: '1px solid rgba(0,0,0,0.06)',
  '&:hover': {
    filter: 'brightness(1.03)',
    transform: 'translateY(-2px)',
  },
});

const SecondaryButton = styled(Button)({
  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '0.85rem',
  padding: '8px 12px',
  borderRadius: '8px',
  textTransform: 'none',
  letterSpacing: '0.2px',
  boxShadow: '0 6px 18px rgba(4, 120, 87, 0.12)',
  transition: 'all 0.18s ease',
  border: '1px solid rgba(0,0,0,0.06)',
  '&:hover': {
    filter: 'brightness(1.04)',
    transform: 'translateY(-2px)',
  },
});

function Actions() {
  const { dumpBag } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#667eea' }}>Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.85rem', width: '100%' }}>
        <PrimaryButton variant="contained" onClick={dumpBag} size="small" fullWidth startIcon={<DeleteIcon />}>Dump</PrimaryButton>
        <SecondaryButton variant="contained" size="small" fullWidth startIcon={<ShoppingCartIcon />}>Buy</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth startIcon={<SellIcon />}>Sell</PrimaryButton>
        <SecondaryButton variant="contained" size="small" fullWidth startIcon={<AccountBalanceWalletIcon />}>Finances</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth startIcon={<StorefrontIcon />}>Store</PrimaryButton>
        <SecondaryButton variant="contained" size="small" fullWidth startIcon={<AccountBalanceIcon />}>Loan</SecondaryButton>
        <PrimaryButton variant="contained" size="small" fullWidth startIcon={<Inventory2Icon />}>Use Item</PrimaryButton>
      </div>
    </div>
  );
}

export default Actions;
