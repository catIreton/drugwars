import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useGame } from '../../GameContext';
import { DRUGS, getMarketPrice } from '../../../data/drugs';
import { ITEM_CATALOG } from '../../../data/items';
import { playSell } from '../../../utils/sounds';

const BriefcaseContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const CaseHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
  paddingBottom: '8px',
  borderBottom: '2px solid rgba(212,175,55,0.35)',
});

const CaseTitle = styled('h2')({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#a78bfa',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: 'Georgia, serif',
  textShadow: '0 0 10px rgba(212,175,55,0.4)',
});

const CapacityRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '10px',
});

const CapacityBar = styled('div')({
  flex: 1,
  height: '6px',
  background: 'rgba(212,175,55,0.12)',
  borderRadius: '3px',
  border: '1px solid rgba(212,175,55,0.25)',
  overflow: 'hidden',
});

const CapacityFill = styled('div')({
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.3s ease',
});

const CapacityLabel = styled('span')({
  fontSize: '0.72rem',
  fontFamily: 'Courier New, monospace',
  color: '#6d28d9',
  flexShrink: 0,
});

const Compartment = styled('div')({
  padding: '6px 10px',
  marginBottom: '5px',
  background: 'rgba(212,175,55,0.06)',
  border: '1px solid rgba(212,175,55,0.18)',
  borderLeft: '3px solid rgba(212,175,55,0.5)',
  borderRadius: '4px',
});

const ItemRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ItemName = styled('span')({
  color: '#ddd6fe',
  fontFamily: 'Georgia, serif',
  fontSize: '0.88rem',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
});

const ItemQty = styled('span')({
  color: '#a78bfa',
  fontWeight: 700,
  fontFamily: 'Courier New, monospace',
  fontSize: '0.8rem',
  background: 'rgba(212,175,55,0.1)',
  padding: '1px 6px',
  borderRadius: '3px',
  border: '1px solid rgba(212,175,55,0.2)',
});

const PnlRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '3px',
});

const PriceDetail = styled('span')({
  fontSize: '0.7rem',
  fontFamily: 'Courier New, monospace',
  color: '#6b7280',
});

const PnlBadge = styled('span')(({ positive }) => ({
  fontSize: '0.7rem',
  fontFamily: 'Courier New, monospace',
  fontWeight: 700,
  color: positive ? '#10b981' : '#ef4444',
  background: positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
  border: `1px solid ${positive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
  borderRadius: '4px',
  padding: '1px 6px',
}));

const GradeBadge = styled('span')(({ grade }) => {
  const colors = {
    high: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)' },
    low:  { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  };
  const c = colors[grade] ?? { color: '#6b7280', bg: 'transparent', border: 'transparent' };
  return {
    fontSize: '0.62rem',
    fontFamily: 'Courier New, monospace',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: c.color,
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: '3px',
    padding: '0px 4px',
    marginLeft: '4px',
    textTransform: 'uppercase',
  };
});

const SellButton = styled('button')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#6ee7b7',
  background: 'rgba(16,185,129,0.1)',
  border: '1px solid rgba(16,185,129,0.35)',
  borderRadius: '4px',
  padding: '2px 8px',
  cursor: 'pointer',
  marginLeft: '6px',
  '&:hover': {
    background: 'rgba(16,185,129,0.2)',
  },
});

const ItemSection = styled('div')({
  marginTop: '10px',
  paddingTop: '8px',
  borderTop: '1px solid rgba(212,175,55,0.18)',
});

const ItemSectionLabel = styled('div')({
  fontSize: '0.68rem',
  fontFamily: 'Courier New, monospace',
  color: '#6d28d9',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  marginBottom: '6px',
  opacity: 0.7,
});

const ConsumableRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '5px 10px',
  marginBottom: '4px',
  background: 'rgba(109,40,217,0.08)',
  border: '1px solid rgba(109,40,217,0.2)',
  borderLeft: '3px solid rgba(109,40,217,0.5)',
  borderRadius: '4px',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
  color: '#ddd6fe',
});

const EmptyCase = styled('div')({
  color: 'rgba(212,175,55,0.35)',
  fontSize: '0.82rem',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '16px',
  fontFamily: 'Georgia, serif',
  letterSpacing: '0.05em',
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

const GRADE_COLORS = { high: '#fbbf24', standard: '#6b7280', low: '#f87171' };

function fmt(n) {
  const abs = Math.abs(n).toLocaleString();
  return n >= 0 ? `+$${abs}` : `-$${abs}`;
}

function Bag() {
  const { game, sellItem, negotiate } = useGame();
  const [sellTarget,       setSellTarget]       = useState(null); // bag item entry
  const [sellQty,          setSellQty]          = useState(1);
  const [sellError,        setSellError]        = useState(null);
  const [negotiatedPrice,  setNegotiatedPrice]  = useState(null);
  const [haggledThisDialog,setHaggledThisDialog]= useState(false);
  const [haggleResult,     setHaggleResult]     = useState(null);

  const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);
  const pct = Math.round((bagUsed / game.bagCapacity) * 100);
  const fillColor = pct > 80
    ? 'linear-gradient(90deg, #a78bfa, #ef4444)'
    : 'linear-gradient(90deg, #4c1d95, #a78bfa)';

  const priceOptions = {
    dailyMultipliers: game.priceMultipliers?.[game.location] ?? {},
    eventEffects: game.activeEventEffects ?? {},
    wantedLevel: game.wantedLevel,
    crew: game.crew,
    prestige: game.prestige ?? 0,
    rivalLevel: game.rivals?.[game.location]?.level ?? 0,
    flashDeals: game.flashDeals?.[game.location] ?? {},
  };

  const openSell = (item) => {
    setSellTarget(item);
    setSellQty(1);
    setSellError(null);
    setNegotiatedPrice(null);
    setHaggledThisDialog(false);
    setHaggleResult(null);
  };

  const closeSell = () => {
    setSellTarget(null);
    setSellError(null);
    setNegotiatedPrice(null);
    setHaggledThisDialog(false);
    setHaggleResult(null);
  };

  const handleHaggle = (basePrice) => {
    if (haggledThisDialog) return;
    const result = negotiate(basePrice, false);
    setNegotiatedPrice(result.newPrice);
    setHaggledThisDialog(true);
    setHaggleResult({ success: result.success, pct: result.pct });
  };

  const handleConfirmSell = () => {
    const numQty = Math.max(1, parseInt(sellQty) || 1);
    if (!sellTarget || numQty < 1) return;

    const grade      = sellTarget.grade ?? 'standard';
    const baseOpts   = { ...priceOptions, grade };
    const basePrice  = getMarketPrice(sellTarget.id, game.location, true, baseOpts);
    const price      = negotiatedPrice ?? basePrice;

    try {
      sellItem(sellTarget.id, sellTarget.name, numQty, price, grade);
      playSell();
      closeSell();
    } catch (err) {
      setSellError(err.message);
    }
  };

  // Build sell dialog data when open
  const sellDialogData = (() => {
    if (!sellTarget) return null;
    const drug      = DRUGS.find(d => d.id === sellTarget.id || d.name === sellTarget.name);
    const grade     = sellTarget.grade ?? 'standard';
    const basePrice = game.location ? getMarketPrice(sellTarget.id, game.location, true, { ...priceOptions, grade }) : null;
    const unitPrice = negotiatedPrice ?? basePrice;
    const numQty    = Math.max(1, parseInt(sellQty) || 1);
    const total     = unitPrice != null ? unitPrice * numQty : 0;
    const cashAfter = game.cash + total;
    return { drug, grade, basePrice, unitPrice, numQty, total, cashAfter };
  })();

  return (
    <BriefcaseContainer>
      <CaseHeader>
        <BusinessCenterIcon sx={{ color: '#a78bfa', fontSize: '1.3rem', filter: 'drop-shadow(0 0 5px rgba(212,175,55,0.6))' }} />
        <CaseTitle>The Case</CaseTitle>
      </CaseHeader>

      <CapacityRow>
        <CapacityBar>
          <CapacityFill style={{ width: `${pct}%`, background: fillColor }} />
        </CapacityBar>
        <CapacityLabel>{bagUsed}/{game.bagCapacity}</CapacityLabel>
      </CapacityRow>

      {game.bag.length === 0
        ? <EmptyCase>— case is empty —</EmptyCase>
        : game.bag.map(item => {
            const drug = DRUGS.find(d => d.id === item.id || d.name === item.name);
            const avgCost = item.avgCost ?? null;
            const grade   = item.grade ?? 'standard';
            const sellPrice = drug && game.location
              ? getMarketPrice(drug.id, game.location, true, { ...priceOptions, grade })
              : null;
            const pnlPerUnit = avgCost != null && sellPrice != null ? sellPrice - avgCost : null;
            const totalPnl = pnlPerUnit != null ? pnlPerUnit * item.qty : null;

            return (
              <Compartment key={item.bagKey ?? item.name}>
                <ItemRow>
                  <ItemName>
                    {drug && <span style={{ fontSize: '1rem' }}>{drug.emoji}</span>}
                    {item.name}
                    {grade !== 'standard' && <GradeBadge grade={grade}>{grade === 'high' ? 'HI' : 'LO'}</GradeBadge>}
                  </ItemName>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ItemQty>× {item.qty}</ItemQty>
                    {game.location && (
                      <SellButton onClick={() => openSell(item)}>Sell</SellButton>
                    )}
                  </div>
                </ItemRow>
                {(avgCost != null || sellPrice != null) && (
                  <PnlRow>
                    <PriceDetail>
                      {avgCost != null && `paid $${avgCost.toLocaleString()}`}
                      {avgCost != null && sellPrice != null && ' · '}
                      {sellPrice != null && `sell $${sellPrice.toLocaleString()}`}
                    </PriceDetail>
                    {totalPnl != null && (
                      <PnlBadge positive={totalPnl >= 0 ? 'true' : undefined}>
                        {fmt(totalPnl)}
                      </PnlBadge>
                    )}
                  </PnlRow>
                )}
              </Compartment>
            );
          })
      }

      {(game.items?.length ?? 0) > 0 && (
        <ItemSection>
          <ItemSectionLabel>— consumables —</ItemSectionLabel>
          {game.items.map(item => {
            const catalog = ITEM_CATALOG.find(c => c.id === item.id);
            return (
              <ConsumableRow key={item.id}>
                <span style={{ fontSize: '1rem' }}>{item.emoji ?? catalog?.emoji}</span>
                <span style={{ flex: 1 }}>{item.name}</span>
                <ItemQty>× {item.qty}</ItemQty>
              </ConsumableRow>
            );
          })}
        </ItemSection>
      )}

      {/* Sell Dialog */}
      <Dialog open={!!sellTarget} onClose={closeSell} maxWidth="xs" fullWidth PaperProps={{ sx: dialogPaper }}>
        {sellTarget && sellDialogData && (() => {
          const { drug, grade, basePrice, unitPrice, total, cashAfter } = sellDialogData;
          const flashDeal = game.flashDeals?.[game.location]?.[sellTarget.id];
          const isLockdown = (game.rivals?.[game.location]?.level ?? 0) >= 4;

          return <>
            <DialogTitle sx={{ pb: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {drug && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '6px', background: `${drug.color}22`, border: `1px solid ${drug.color}55`, fontSize: '1.1rem' }}>
                    {drug.emoji}
                  </span>
                )}
                <span style={{ fontFamily: 'Palatino Linotype, serif', fontSize: '1.2rem', color: drug?.color ?? '#ddd6fe', fontWeight: 700, flex: 1 }}>
                  {sellTarget.name}
                  {grade !== 'standard' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: GRADE_COLORS[grade], marginLeft: '8px', letterSpacing: '0.08em' }}>
                      {grade === 'high' ? '✦ HIGH' : '▼ LOW'}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.5)', color: '#6ee7b7' }}>SELL</span>
              </div>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {sellError && (
                <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
                  ⚠ {sellError}
                </div>
              )}
              {isLockdown && (
                <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                  🔒 Rival lockdown — prices hostile
                </div>
              )}
              {flashDeal?.type === 'sell' && (
                <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '6px', color: '#fbbf24', fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                  ⚡ Flash deal — sell price boosted!
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
                  value={sellQty}
                  onChange={e => setSellQty(e.target.value)}
                  onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) setSellQty(1); }}
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ ...darkTextField, mt: 0, mx: 0 }}
                />
                {sellTarget.qty > 0 && (
                  <button
                    onClick={() => setSellQty(sellTarget.qty)}
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#6ee7b7',
                      background: 'rgba(16,185,129,0.12)',
                      border: '1px solid rgba(16,185,129,0.4)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ALL ({sellTarget.qty})
                  </button>
                )}
              </div>

              <StatGrid>
                <StatLine>
                  <StatKey>Price / unit</StatKey>
                  <span style={{ color: negotiatedPrice ? '#fbbf24' : '#ede0ff' }}>
                    ${unitPrice?.toLocaleString()}
                  </span>
                </StatLine>
                <StatLine>
                  <StatKey>In bag</StatKey>
                  <span style={{ color: '#8b95c9' }}>× {sellTarget.qty}</span>
                </StatLine>
                <TotalLine>
                  <StatKey style={{ color: '#c084fc' }}>Total</StatKey>
                  <span style={{ color: '#6ee7b7' }}>+${total.toLocaleString()}</span>
                </TotalLine>
                <StatLine>
                  <StatKey>Cash after</StatKey>
                  <span style={{ color: '#a5b4fc', fontWeight: 600 }}>${cashAfter.toLocaleString()}</span>
                </StatLine>
              </StatGrid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexWrap: 'wrap' }}>
              <Button onClick={closeSell} sx={{ color: '#64748b', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em' }}>
                Cancel
              </Button>
              {!haggledThisDialog && (
                <Button
                  onClick={() => handleHaggle(basePrice)}
                  variant="outlined"
                  sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.4)', '&:hover': { borderColor: '#fbbf24', background: 'rgba(251,191,36,0.08)' } }}
                >
                  Haggle
                </Button>
              )}
              <Button
                onClick={handleConfirmSell}
                variant="contained"
                sx={{
                  fontFamily: 'Courier New, monospace',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  background: 'linear-gradient(135deg, #065f46, #059669)',
                  '&:hover': { filter: 'brightness(1.15)' },
                  boxShadow: '0 0 12px rgba(5,150,105,0.4)',
                }}
              >
                Confirm Sale
              </Button>
            </DialogActions>
          </>;
        })()}
      </Dialog>
    </BriefcaseContainer>
  );
}

export default Bag;
