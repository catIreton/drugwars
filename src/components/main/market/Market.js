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
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';

import { DRUGS, getMarketPrice, getAvailableQuantity, LOCATION_MARKETS, getLocationGrade } from '../../../data/drugs';
import { useGame } from '../../GameContext';
import { playBuy } from '../../../utils/sounds';

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

const RivalBadge = styled('div')(({ rivalcolor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  background: `${rivalcolor}18`,
  border: `1px solid ${rivalcolor}55`,
  borderRadius: '6px',
  padding: '3px 8px',
  color: rivalcolor,
  fontFamily: 'Courier New, monospace',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
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

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
});

const PriceCell = styled(TableCell)({
  textAlign: 'right',
  minWidth: '100px',
});

const GRADE_COLORS = { high: '#fbbf24', standard: '#6b7280', low: '#f87171' };
const GRADE_LABELS = { high: 'HI', standard: '—', low: 'LO' };

function PriceArrow({ drugId, currentPrice, priceHistory, location }) {
  const last = priceHistory?.[location]?.[drugId];
  if (!last || last === currentPrice) {
    return (
      <Tooltip title="No previous price for this location" arrow placement="top">
        <span style={{ color: '#6b7280', fontSize: '0.75rem', cursor: 'default' }}>—</span>
      </Tooltip>
    );
  }
  const delta = currentPrice - last;
  const up    = delta > 0;
  return (
    <Tooltip title={`Was $${last.toLocaleString()} last visit (${up ? '+' : ''}$${delta.toLocaleString()})`} arrow placement="top">
      <span style={{ color: up ? '#f97316' : '#10b981', fontSize: '0.75rem', fontWeight: 700, cursor: 'default', whiteSpace: 'nowrap' }}>
        {up ? '▲' : '▼'} {up ? '+' : ''}${Math.abs(delta).toLocaleString()}
      </span>
    </Tooltip>
  );
}

function Market() {
  const { game, buyItem, negotiate } = useGame();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [negotiatedPrice,   setNegotiatedPrice]   = useState(null);
  const [haggledThisDialog, setHaggledThisDialog] = useState(false);
  const [haggleResult,      setHaggleResult]      = useState(null);

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

  const locationFlashDeals = game.flashDeals?.[game.location] ?? {};
  const rivalLevel = game.rivals?.[game.location]?.level ?? 0;
  const priceOptions = {
    dailyMultipliers: game.priceMultipliers?.[game.location] ?? {},
    eventEffects: game.activeEventEffects ?? {},
    wantedLevel: game.wantedLevel,
    crew: game.crew,
    prestige: game.prestige ?? 0,
    rivalLevel,
    flashDeals: locationFlashDeals,
    gangWar: !!((game.gangWars ?? {})[game.location]),
    wantedPosterActive: game.wantedPosterActive ?? false,
  };

  const handleRowClick = (drug) => {
    setSelectedDrug(drug);
    setQuantity(1);
    setError(null);
    setNegotiatedPrice(null);
    setHaggledThisDialog(false);
    setHaggleResult(null);
  };

  const handleClose = () => {
    setSelectedDrug(null);
    setError(null);
    setNegotiatedPrice(null);
    setHaggledThisDialog(false);
    setHaggleResult(null);
  };

  const handleHaggle = (basePrice) => {
    if (haggledThisDialog) return;
    const result = negotiate(basePrice, true);
    setNegotiatedPrice(result.newPrice);
    setHaggledThisDialog(true);
    setHaggleResult({ success: result.success, pct: result.pct });
  };

  const handleConfirm = () => {
    const numQty = Math.max(1, parseInt(quantity) || 1);
    if (!selectedDrug || numQty < 1) return;

    const grade        = getLocationGrade(selectedDrug.id, game.location, game.day);
    const baseOptions  = { ...priceOptions, grade };
    const basePrice    = getMarketPrice(selectedDrug.id, game.location, false, baseOptions);
    const price        = negotiatedPrice ?? basePrice;
    const availableQty = getAvailableQuantity(selectedDrug.id, game.location, game.stockLevels);

    try {
      buyItem(selectedDrug.id, selectedDrug.name, numQty, price, availableQty, grade);
      playBuy();
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MarketContainer>
      <MarketHeader>
        <h2 style={{ margin: 0, color: '#667eea', fontSize: '1.1rem' }}>Market — {game.location}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {rivalLevel > 0 && (
            <RivalBadge rivalcolor={rivalLevel >= 2 ? '#ef4444' : '#f97316'}>
              👊 {rivalLevel === 1 ? 'Rival' : `${rivalLevel} Rivals`}
            </RivalBadge>
          )}
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
        </div>
      </MarketHeader>

      <StyledTable size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '180px', padding: '3px 8px' }}>Drug</TableCell>
            <TableCell align="right">Buy Price</TableCell>
            <TableCell align="center" style={{ padding: '3px 4px' }}>
              <Tooltip title="Change vs. last visit to this location" arrow placement="top">
                <span style={{ fontSize: '0.68rem', color: '#6b7280', cursor: 'default' }}>Δ</span>
              </Tooltip>
            </TableCell>
            <TableCell align="right">Available</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DRUGS.map(drug => {
            const grade     = getLocationGrade(drug.id, game.location, game.day);
            const buyPrice  = getMarketPrice(drug.id, game.location, false, priceOptions);
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
                <PriceCell>
                  {locationFlashDeals[drug.id]?.type === 'buy' && <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>⚡</span>}
                  ${buyPrice}
                  {' '}
                  <Tooltip
                    title={grade === 'high' ? 'High quality — sell price +28%' : grade === 'low' ? 'Low quality — sell price −18%' : 'Standard quality'}
                    arrow
                    placement="top"
                  >
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: GRADE_COLORS[grade], opacity: 0.85, cursor: 'default' }}>
                      {GRADE_LABELS[grade]}
                    </span>
                  </Tooltip>
                </PriceCell>
                <TableCell align="center" style={{ padding: '3px 4px' }}>
                  <PriceArrow drugId={drug.id} currentPrice={buyPrice} priceHistory={game.priceHistory} location={game.location} />
                </TableCell>
                <TableCell align="right">
                  {outOfStock
                    ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.05em' }}>OUT</span>
                    : available}
                </TableCell>
                <ActionCell>
                  {!outOfStock && (
                    <Tooltip title="Buy" arrow>
                      <ActionIconButton size="small" onClick={() => handleRowClick(drug)} sx={{ color: '#667eea' }}>
                        <ShoppingBagIcon fontSize="small" />
                      </ActionIconButton>
                    </Tooltip>
                  )}
                </ActionCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>

      {/* Buy Dialog */}
      <Dialog open={!!selectedDrug} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: dialogPaper }}>
        {selectedDrug && (() => {
          const drug          = selectedDrug;
          const grade         = getLocationGrade(drug.id, game.location, game.day);
          const dialogOptions = { ...priceOptions, grade };
          const baseUnitPrice = getMarketPrice(drug.id, game.location, false, dialogOptions);
          const unitPrice     = negotiatedPrice ?? baseUnitPrice;
          const availableQty  = getAvailableQuantity(drug.id, game.location, game.stockLevels);
          const bagUsed       = game.bag.reduce((sum, item) => sum + item.qty, 0);
          const bagSpace      = game.bagCapacity - bagUsed;
          const maxQty        = Math.min(availableQty, Math.floor(unitPrice > 0 ? game.cash / unitPrice : 0), bagSpace);
          const numQty        = Math.max(1, parseInt(quantity) || 1);
          const total         = unitPrice * numQty;
          const cashAfter     = game.cash - total;
          const isLockdown    = rivalLevel >= 4;

          return <>
            <DialogTitle sx={{ pb: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DrugBadge drugcolor={drug.color} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>
                  {drug.emoji}
                </DrugBadge>
                <span style={{ fontFamily: 'Palatino Linotype, serif', fontSize: '1.2rem', color: drug.color, fontWeight: 700, flex: 1 }}>
                  {drug.name}
                  {grade !== 'standard' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: GRADE_COLORS[grade], marginLeft: '8px', letterSpacing: '0.08em' }}>
                      {grade === 'high' ? '✦ HIGH' : '▼ LOW'}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: '4px', background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.5)', color: '#a5b4fc' }}>BUY</span>
              </div>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {error && (
                <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
                  ⚠ {error}
                </div>
              )}
              {isLockdown && (
                <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                  🔒 Rival lockdown — prices hostile
                </div>
              )}
              {haggleResult && (
                <div style={{ padding: '8px 12px', marginBottom: '10px', background: haggleResult.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${haggleResult.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '6px', color: haggleResult.success ? '#6ee7b7' : '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                  {haggleResult.success ? `✓ Haggled ${haggleResult.pct}% better — $${unitPrice?.toLocaleString()}/unit` : `✗ They didn't budge — price worsened to $${unitPrice?.toLocaleString()}/unit`}
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
                      color: '#a5b4fc',
                      background: 'rgba(102,126,234,0.12)',
                      border: '1px solid rgba(102,126,234,0.4)',
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
                  <span style={{ color: negotiatedPrice ? '#6ee7b7' : '#ede0ff' }}>
                    ${unitPrice?.toLocaleString()}
                  </span>
                </StatLine>
                <TotalLine>
                  <StatKey style={{ color: '#c084fc' }}>Total</StatKey>
                  <span style={{ color: '#f87171' }}>-${total.toLocaleString()}</span>
                </TotalLine>
                <StatLine>
                  <StatKey>Cash after</StatKey>
                  <span style={{ color: cashAfter >= 0 ? '#a5b4fc' : '#f87171', fontWeight: 600 }}>
                    ${cashAfter.toLocaleString()}
                  </span>
                </StatLine>
                <StatLine>
                  <StatKey>Bag space after</StatKey>
                  <span style={{ color: bagSpace - numQty >= 0 ? '#8b95c9' : '#f87171' }}>
                    {bagSpace - numQty} / {game.bagCapacity}
                  </span>
                </StatLine>
              </StatGrid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexWrap: 'wrap' }}>
              <Button onClick={handleClose} sx={{ color: '#64748b', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em' }}>
                Cancel
              </Button>
              {!haggledThisDialog && (
                <Button
                  onClick={() => handleHaggle(baseUnitPrice)}
                  variant="outlined"
                  sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.4)', '&:hover': { borderColor: '#fbbf24', background: 'rgba(251,191,36,0.08)' } }}
                >
                  Haggle
                </Button>
              )}
              <Button
                onClick={handleConfirm}
                variant="contained"
                sx={{
                  fontFamily: 'Courier New, monospace',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  '&:hover': { filter: 'brightness(1.15)' },
                  boxShadow: '0 0 12px rgba(124,58,237,0.4)',
                }}
              >
                Confirm Purchase
              </Button>
            </DialogActions>
          </>;
        })()}
      </Dialog>
    </MarketContainer>
  );
}

export default Market;
