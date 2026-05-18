import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';

import { DRUGS, getMarketPrice, getAvailableQuantity, LOCATION_MARKETS } from '../../../data/drugs';
import { useGame } from '../../GameContext';
import { playBuy, playSell } from '../../../utils/sounds';

const HEAT_MAP = {
  'Very Hot': { color: '#ef4444', level: 4 },
  'Hot':      { color: '#f97316', level: 3 },
  'Moderate': { color: '#f59e0b', level: 2 },
  'Mild':     { color: '#10b981', level: 1 },
};

const MarketHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 8px 0',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '6px',
});

const HeatBadge = styled('div')(({ heatcolor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1px',
  background: `${heatcolor}18`,
  border: `1px solid ${heatcolor}55`,
  borderRadius: '6px',
  padding: '3px 8px 3px 5px',
  color: heatcolor,
  fontFamily: 'Courier New, monospace',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}));

const MarketContainer = styled('div')({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const ActionCell = styled(TableCell)({
  textAlign: 'right',
  padding: '3px 8px',
  display: 'flex',
  gap: '4px',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const ActionIconButton = styled(IconButton)({
  padding: '2px',
  fontSize: '1.1rem',
  '&:hover': {
    transform: 'scale(1.15)',
    transition: 'transform 0.2s ease',
  },
});

const DrugBadge = styled('span')(({ drugcolor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  background: `${drugcolor}22`,
  border: `1px solid ${drugcolor}55`,
  fontSize: '0.9rem',
  marginRight: '8px',
  flexShrink: 0,
}));

const DrugNameCell = styled(TableCell)({
  padding: '3px 8px',
  minWidth: '140px',
});

const dialogPaper = {
  background: 'linear-gradient(160deg, #0d001a 0%, #1a0035 60%, #0d001a 100%)',
  border: '1px solid rgba(180,90,255,0.35)',
  borderRadius: '14px',
  boxShadow: '0 0 40px rgba(120,0,200,0.35), 0 20px 60px rgba(0,0,0,0.8)',
};

const ActionChip = styled('span')(({ isbuy }) => ({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  padding: '2px 10px',
  borderRadius: '4px',
  background: isbuy === 'true' ? 'rgba(102,126,234,0.15)' : 'rgba(16,185,129,0.15)',
  border: `1px solid ${isbuy === 'true' ? 'rgba(102,126,234,0.5)' : 'rgba(16,185,129,0.5)'}`,
  color: isbuy === 'true' ? '#a5b4fc' : '#6ee7b7',
}));

const StatGrid = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: '16px',
});

const StatLine = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(102,126,234,0.06)',
  border: '1px solid rgba(102,126,234,0.12)',
  borderRadius: '6px',
  padding: '6px 12px',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
});

const StatKey = styled('span')({
  color: '#8b95c9',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '0.72rem',
});

const TotalLine = styled(StatLine)({
  background: 'rgba(180,90,255,0.08)',
  border: '1px solid rgba(180,90,255,0.25)',
  fontWeight: 700,
  fontSize: '0.9rem',
});

const darkTextField = {
  width: '140px',
  mx: 'auto',
  mt: '10px',
  display: 'block',
  '& .MuiOutlinedInput-root': {
    color: '#ede0ff',
    fontFamily: 'Courier New, monospace',
    fontSize: '1.1rem',
    '& fieldset': { borderColor: 'rgba(180,90,255,0.35)' },
    '&:hover fieldset': { borderColor: 'rgba(180,90,255,0.65)' },
    '&.Mui-focused fieldset': { borderColor: '#9333ea' },
  },
  '& .MuiInputLabel-root': { color: '#8b95c9', fontFamily: 'Courier New, monospace' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c084fc' },
  '& .MuiInputBase-input': {
    textAlign: 'center',
    // hide native number spinners
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '&[type=number]': { MozAppearance: 'textfield' },
  },
};

const StyledTable = styled(Table)({
  width: '100%',
  fontSize: '0.85rem',
  '& th, & td': {
    padding: '3px 8px',
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
}));

const PriceCell = styled(TableCell)({
  textAlign: 'right',
  minWidth: '100px',
});

function PriceArrow({ drugId, currentPrice, priceHistory, location }) {
  const last = priceHistory?.[location]?.[drugId];
  if (!last || last === currentPrice) return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>—</span>;
  if (currentPrice > last) return <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>↑</span>;
  return <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>↓</span>;
}

function Market() {
  const { game, buyItem, sellItem } = useGame();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'
  const [error, setError] = useState(null);

  if (!game.location) {
    return (
      <MarketContainer>
        <h2>Market</h2>
        <p style={{ color: '#999' }}>Travel to a location to see available drugs</p>
      </MarketContainer>
    );
  }

  const marketLocation = LOCATION_MARKETS[game.location];
  if (!marketLocation) {
    return (
      <MarketContainer>
        <h2>Market</h2>
        <p style={{ color: '#999' }}>No market data for this location</p>
      </MarketContainer>
    );
  }

  const priceOptions = {
    dailyMultipliers: game.priceMultipliers?.[game.location] ?? {},
    eventEffects: game.activeEventEffects ?? {},
    wantedLevel: game.wantedLevel,
    crew: game.crew,
  };

  const handleRowClick = (drug, actionType) => {
    setSelectedDrug(drug);
    setAction(actionType);
    setQuantity(1);
    setError(null);
  };

  const handleClose = () => {
    setSelectedDrug(null);
    setError(null);
  };

  const handleConfirm = () => {
    const numQty = Math.max(1, parseInt(quantity) || 1);
    if (!selectedDrug || numQty < 1) return;

    const price = getMarketPrice(selectedDrug.id, game.location, action === 'sell', priceOptions);
    const availableQty = getAvailableQuantity(selectedDrug.id, game.location, game.stockLevels);

    try {
      if (action === 'buy') {
        buyItem(selectedDrug.id, selectedDrug.name, numQty, price, availableQty);
        playBuy();
      } else {
        sellItem(selectedDrug.id, selectedDrug.name, numQty, price);
        playSell();
      }
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MarketContainer>
      <MarketHeader>
        <h2 style={{ margin: 0, color: '#667eea', fontSize: '1.1rem' }}>Market — {game.location}</h2>
        {(() => {
          const heat = HEAT_MAP[marketLocation.heatLevel] ?? HEAT_MAP['Moderate'];
          return (
            <HeatBadge heatcolor={heat.color}>
              {[...Array(4)].map((_, i) =>
                i < heat.level
                  ? <WhatshotIcon key={i} sx={{ fontSize: '0.95rem' }} />
                  : <WhatshotOutlinedIcon key={i} sx={{ fontSize: '0.95rem', color: '#d1d5db' }} />
              )}
              &nbsp;{marketLocation.heatLevel}
            </HeatBadge>
          );
        })()}
      </MarketHeader>
      <StyledTable size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '180px', padding: '3px 8px' }}>Drug</TableCell>
            <TableCell align="right">Buy Price</TableCell>
            <TableCell align="center" style={{ width: '32px', padding: '3px 4px' }}></TableCell>
            <TableCell align="right">Sell Price</TableCell>
            <TableCell align="right">Available</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DRUGS.map(drug => {
            const buyPrice  = getMarketPrice(drug.id, game.location, false, priceOptions);
            const sellPrice = getMarketPrice(drug.id, game.location, true,  priceOptions);
            const available = getAvailableQuantity(drug.id, game.location, game.stockLevels);
            const outOfStock = available === 0;

            return (
              <StyledTableRow key={drug.id} style={{ opacity: outOfStock ? 0.55 : 1 }}>
                <DrugNameCell>
                  <Tooltip title={drug.description} arrow placement="right">
                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'default' }}>
                      <DrugBadge drugcolor={drug.color}>{drug.emoji}</DrugBadge>
                      <strong style={{ color: drug.color, letterSpacing: '0.02em' }}>{drug.name}</strong>
                    </span>
                  </Tooltip>
                </DrugNameCell>
                <PriceCell>${buyPrice}</PriceCell>
                <TableCell align="center" style={{ padding: '3px 4px' }}>
                  <PriceArrow drugId={drug.id} currentPrice={buyPrice} priceHistory={game.priceHistory} location={game.location} />
                </TableCell>
                <PriceCell>${sellPrice}</PriceCell>
                <TableCell align="right">
                  {outOfStock
                    ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.05em' }}>OUT</span>
                    : available}
                </TableCell>
                <ActionCell>
                  {!outOfStock && (
                    <Tooltip title="Buy" arrow>
                      <ActionIconButton size="small" onClick={() => handleRowClick(drug, 'buy')} sx={{ color: '#667eea' }}>
                        <ShoppingBagIcon fontSize="small" />
                      </ActionIconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Sell" arrow>
                    <ActionIconButton size="small" onClick={() => handleRowClick(drug, 'sell')} sx={{ color: '#10b981' }}>
                      <AttachMoneyIcon fontSize="small" />
                    </ActionIconButton>
                  </Tooltip>
                </ActionCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>

      {/* Buy/Sell Dialog */}
      <Dialog open={!!selectedDrug} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: dialogPaper }}>
        {selectedDrug && (() => {
          const isBuy = action === 'buy';
          const drug = selectedDrug;
          const unitPrice = getMarketPrice(drug.id, game.location, !isBuy, priceOptions);
          const availableQty = getAvailableQuantity(drug.id, game.location, game.stockLevels);
          const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);
          const bagSpace = game.bagCapacity - bagUsed;
          const ownedQty = game.bag.find(i => i.name === drug.name)?.qty ?? 0;

          const maxQty = isBuy
            ? Math.min(availableQty, Math.floor(unitPrice > 0 ? game.cash / unitPrice : 0), bagSpace)
            : ownedQty;

          const numQty = Math.max(1, parseInt(quantity) || 1);
          const total = unitPrice * numQty;
          const cashAfter = isBuy ? game.cash - total : game.cash + total;
          return <>
            <DialogTitle sx={{ pb: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DrugBadge drugcolor={drug.color} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>
                  {drug.emoji}
                </DrugBadge>
                <span style={{ fontFamily: 'Palatino Linotype, serif', fontSize: '1.2rem', color: drug.color, fontWeight: 700, flex: 1 }}>
                  {drug.name}
                </span>
                <ActionChip isbuy={String(isBuy)}>{isBuy ? 'BUY' : 'SELL'}</ActionChip>
              </div>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {error && (
                <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) setQuantity(1); }}
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ ...darkTextField, mt: 0, mx: 0 }}
                />
                {maxQty > 0 && (
                  <button
                    onClick={() => setQuantity(maxQty)}
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: isBuy ? '#a5b4fc' : '#6ee7b7',
                      background: isBuy ? 'rgba(102,126,234,0.12)' : 'rgba(16,185,129,0.12)',
                      border: `1px solid ${isBuy ? 'rgba(102,126,234,0.4)' : 'rgba(16,185,129,0.4)'}`,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    MAX ({maxQty})
                  </button>
                )}
              </div>

              <StatGrid>
                <StatLine>
                  <StatKey>Price / unit</StatKey>
                  <span style={{ color: '#ede0ff' }}>${unitPrice?.toLocaleString()}</span>
                </StatLine>
                <TotalLine>
                  <StatKey style={{ color: '#c084fc' }}>Total</StatKey>
                  <span style={{ color: isBuy ? '#f87171' : '#6ee7b7' }}>
                    {isBuy ? '-' : '+'}${total.toLocaleString()}
                  </span>
                </TotalLine>
                <StatLine>
                  <StatKey>Cash after</StatKey>
                  <span style={{ color: cashAfter >= 0 ? '#a5b4fc' : '#f87171', fontWeight: 600 }}>
                    ${cashAfter.toLocaleString()}
                  </span>
                </StatLine>
                {isBuy && (
                  <StatLine>
                    <StatKey>Bag space after</StatKey>
                    <span style={{ color: bagSpace - numQty >= 0 ? '#8b95c9' : '#f87171' }}>
                      {bagSpace - numQty} / {game.bagCapacity}
                    </span>
                  </StatLine>
                )}
              </StatGrid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button onClick={handleClose} sx={{ color: '#64748b', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em' }}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                sx={{
                  fontFamily: 'Courier New, monospace',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  background: isBuy ? 'linear-gradient(135deg, #4c1d95, #7c3aed)' : 'linear-gradient(135deg, #065f46, #059669)',
                  '&:hover': { filter: 'brightness(1.15)' },
                  boxShadow: isBuy ? '0 0 12px rgba(124,58,237,0.4)' : '0 0 12px rgba(5,150,105,0.4)',
                }}
              >
                Confirm {isBuy ? 'Purchase' : 'Sale'}
              </Button>
            </DialogActions>
          </>;
        })()}
      </Dialog>
    </MarketContainer>
  );
}

export default Market;
