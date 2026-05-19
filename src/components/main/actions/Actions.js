import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useGame, DIFF_CONFIG, TAKEDOWN_COSTS } from '../../GameContext';
import { ITEM_CATALOG } from '../../../data/items';
import { DRUGS, getMarketPrice } from '../../../data/drugs';

// ── Shared dialog chrome ─────────────────────────────────────────────────────

const darkPaper = {
  background: 'linear-gradient(160deg, #0d001a 0%, #1a0035 60%, #0d001a 100%)',
  border: '1px solid rgba(180,90,255,0.35)',
  borderRadius: '14px',
  boxShadow: '0 0 40px rgba(120,0,200,0.35), 0 20px 60px rgba(0,0,0,0.8)',
};

const titleSx = {
  fontFamily: 'Palatino Linotype, serif',
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#ede0ff',
  letterSpacing: '0.04em',
  pb: 0.5,
};

const cancelSx = {
  color: '#64748b',
  fontFamily: 'Courier New, monospace',
  letterSpacing: '0.08em',
};

const confirmSx = (color = 'purple') => ({
  fontFamily: 'Courier New, monospace',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#ffffff',
  background: color === 'red'
    ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
    : color === 'green'
    ? 'linear-gradient(135deg, #065f46, #059669)'
    : color === 'orange'
    ? 'linear-gradient(135deg, #7c2d12, #ea580c)'
    : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  '&:hover': { filter: 'brightness(1.15)', color: '#ffffff' },
  '&.Mui-disabled': { color: 'rgba(255,255,255,0.45)' },
  boxShadow: color === 'red'    ? '0 0 12px rgba(220,38,38,0.4)'
    : color === 'green'  ? '0 0 12px rgba(5,150,105,0.4)'
    : color === 'orange' ? '0 0 12px rgba(234,88,12,0.4)'
    : '0 0 12px rgba(124,58,237,0.4)',
});

const darkTextField = {
  mt: '10px',
  width: '160px',
  mx: 'auto',
  display: 'block',
  '& .MuiOutlinedInput-root': {
    color: '#ede0ff',
    fontFamily: 'Courier New, monospace',
    fontSize: '1.05rem',
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

// ── Shared stat rows ──────────────────────────────────────────────────────────

const StatLine = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(102,126,234,0.06)',
  border: '1px solid rgba(102,126,234,0.12)',
  borderRadius: '6px',
  padding: '6px 12px',
  marginBottom: '6px',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
});

const StatKey = styled('span')({
  color: '#8b95c9',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '0.72rem',
});

const Subtext = styled('div')({
  fontFamily: 'Courier New, monospace',
  fontSize: '0.8rem',
  color: '#8b95c9',
  marginBottom: '14px',
  lineHeight: 1.5,
});

const ErrorBox = ({ msg }) => msg ? (
  <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
    ⚠ {msg}
  </div>
) : null;

// ── Terminal chrome ───────────────────────────────────────────────────────────

const Terminal = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  fontFamily: 'Courier New, monospace',
  color: '#00ff41',
});

const TermHeader = styled('div')({
  fontSize: '0.7rem',
  color: '#00aa28',
  marginBottom: '8px',
  paddingBottom: '6px',
  borderBottom: '1px solid rgba(0,255,65,0.2)',
  letterSpacing: '0.05em',
});

const TermTitle = styled('div')({
  fontSize: '0.88rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  letterSpacing: '0.12em',
  color: '#39ff14',
  textShadow: '0 0 6px rgba(57,255,20,0.6)',
});

const CmdButton = styled('button')({
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(0,255,65,0.1)',
  color: '#00ff41',
  fontFamily: 'Courier New, monospace',
  fontSize: '0.82rem',
  textAlign: 'left',
  padding: '6px 0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  width: '100%',
  transition: 'all 0.12s ease',
  '&:hover': {
    color: '#7fff00',
    paddingLeft: '6px',
    borderBottom: '1px solid rgba(0,255,65,0.5)',
    textShadow: '0 0 6px rgba(127,255,0,0.5)',
  },
  '&:active': { opacity: 0.5 },
  '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
});

const Prompt = styled('span')({ color: '#00aa28', userSelect: 'none' });

const SectionLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.63rem',
  color: '#00aa28',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  margin: '10px 0 2px',
  opacity: 0.6,
  userSelect: 'none',
  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    background: 'rgba(0,255,65,0.18)',
  },
});

const DiffButton = styled('button')(({ active }) => ({
  flex: 1,
  fontFamily: 'Courier New, monospace',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: active ? '#0d001a' : '#8b95c9',
  background: active ? '#a78bfa' : 'rgba(102,126,234,0.06)',
  border: `1px solid ${active ? '#a78bfa' : 'rgba(102,126,234,0.2)'}`,
  borderRadius: '6px',
  padding: '7px 4px',
  cursor: 'pointer',
  transition: 'all 0.12s ease',
  '&:hover': { filter: 'brightness(1.15)' },
}));

// ── Component ─────────────────────────────────────────────────────────────────

function Actions() {
  const {
    game, dumpBag, takeLoan, payLoan,
    hireCrew, fireCrew, upgradeBag,
    tipOff, setDifficulty, resetGame,
    buyConsumable, useItem: activateItem, bulkImport,
    layLow, rivalTakedown,
  } = useGame();

  const [showDump,       setShowDump]       = useState(false);
  const [showFinances,   setShowFinances]   = useState(false);
  const [showLoan,       setShowLoan]       = useState(false);
  const [showStore,      setShowStore]      = useState(false);
  const [showTipOff,     setShowTipOff]     = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showNewGame,    setShowNewGame]    = useState(false);
  const [showUseItem,    setShowUseItem]    = useState(false);
  const [showBulkImport,    setShowBulkImport]    = useState(false);
  const [showLayLow,        setShowLayLow]        = useState(false);
  const [showRivalTakedown, setShowRivalTakedown] = useState(false);
  const [takedownLocation,  setTakedownLocation]  = useState(null);
  const [takedownError,     setTakedownError]     = useState(null);
  const [layLowError,       setLayLowError]       = useState(null);
  const [storeError,        setStoreError]        = useState(null);
  const [loanAmount,     setLoanAmount]     = useState(1000);
  const [loanError,      setLoanError]      = useState(null);
  const [loanMode,       setLoanMode]       = useState('take');
  const [tipError,       setTipError]       = useState(null);
  const [diffError,      setDiffError]      = useState(null);
  const [newGameDiff,    setNewGameDiff]    = useState(game.difficulty ?? 'normal');
  const [useItemError,   setUseItemError]   = useState(null);
  const [bulkError,      setBulkError]      = useState(null);
  const [bulkDrug,       setBulkDrug]       = useState(null);
  const [bulkQty,        setBulkQty]        = useState(10);

  const diff         = DIFF_CONFIG[game.difficulty ?? 'normal'];
  const interestRate = Math.round(diff.rate * 100);
  const dailyInterest = Math.round(game.debt * diff.rate);
  const netWorth     = game.cash - game.debt;
  const daysLeft     = 60 - game.day;
  const bagUpgradesUsed = game.bagUpgradesUsed ?? 0;

  const openLoan = (mode) => { setLoanMode(mode); setLoanAmount(1000); setLoanError(null); setShowLoan(true); };

  const confirmLoan = () => {
    try {
      if (loanMode === 'take') takeLoan(loanAmount);
      else payLoan(loanAmount);
      setShowLoan(false);
    } catch (e) { setLoanError(e.message); }
  };

  const confirmTipOff = () => {
    try {
      tipOff();
      setShowTipOff(false);
    } catch (e) { setTipError(e.message); }
  };

  const confirmDifficulty = (level) => {
    try {
      setDifficulty(level);
      setShowDifficulty(false);
    } catch (e) { setDiffError(e.message); }
  };

  return (
    <Terminal>
      <TermHeader>C:\DRUGWARS\KC&gt; _</TermHeader>
      <TermTitle>&gt; ACTIONS</TermTitle>

      <SectionLabel>money</SectionLabel>
      <CmdButton onClick={() => setShowFinances(true)}><Prompt>$</Prompt> finances</CmdButton>
      <CmdButton onClick={() => openLoan('take')}><Prompt>$</Prompt> take_loan</CmdButton>
      <CmdButton onClick={() => openLoan('pay')}><Prompt>$</Prompt> pay_loan</CmdButton>

      <SectionLabel>street</SectionLabel>
      <CmdButton onClick={() => game.bag.length > 0 && setShowDump(true)}><Prompt>$</Prompt> dump_bag</CmdButton>
      <CmdButton onClick={() => { setStoreError(null); setShowStore(true); }}><Prompt>$</Prompt> visit_store</CmdButton>
      <CmdButton
        onClick={() => { setTipError(null); setShowTipOff(true); }}
        disabled={(game.tipOffCooldown ?? 0) > 0}
        title={(game.tipOffCooldown ?? 0) > 0 ? `Cooldown: ${game.tipOffCooldown} days` : undefined}
      >
        <Prompt>$</Prompt> tip_off{(game.tipOffCooldown ?? 0) > 0 ? ` [${game.tipOffCooldown}d]` : ''}
      </CmdButton>
      <CmdButton
        onClick={() => { setBulkError(null); setBulkDrug(null); setBulkQty(10); setShowBulkImport(true); }}
        disabled={(game.bulkImportCooldown ?? 0) > 0}
        title={(game.bulkImportCooldown ?? 0) > 0 ? `Cooldown: ${game.bulkImportCooldown} days` : undefined}
      >
        <Prompt>$</Prompt> bulk_import{(game.bulkImportCooldown ?? 0) > 0 ? ` [${game.bulkImportCooldown}d]` : ''}
      </CmdButton>
      {(game.items?.length ?? 0) > 0 && (
        <CmdButton onClick={() => { setUseItemError(null); setShowUseItem(true); }}>
          <Prompt>$</Prompt> use_item
        </CmdButton>
      )}
      <CmdButton
        onClick={() => { setLayLowError(null); setShowLayLow(true); }}
        disabled={(game.layLowCooldown ?? 0) > 0 || game.day + 2 > 60}
        title={(game.layLowCooldown ?? 0) > 0 ? `Cooldown: ${game.layLowCooldown} days` : undefined}
      >
        <Prompt>$</Prompt> lay_low{(game.layLowCooldown ?? 0) > 0 ? ` [${game.layLowCooldown}d]` : ''}
      </CmdButton>
      {Object.values(game.rivals ?? {}).some(r => r.level >= 1) && (
        <CmdButton onClick={() => { setTakedownError(null); setTakedownLocation(null); setShowRivalTakedown(true); }}>
          <Prompt>$</Prompt> rival_takedown
        </CmdButton>
      )}

      <SectionLabel>game</SectionLabel>
      <CmdButton
        onClick={() => { setDiffError(null); setShowDifficulty(true); }}
        disabled={game.day > 1}
        title={game.day > 1 ? 'Difficulty locked after day 1' : undefined}
      >
        <Prompt>$</Prompt> difficulty{game.day > 1 ? ' [locked]' : ''}
      </CmdButton>
      <CmdButton onClick={() => { setNewGameDiff(game.difficulty ?? 'normal'); setShowNewGame(true); }}><Prompt>$</Prompt> new_game</CmdButton>

      {/* ── Store / Crew + Bag Upgrades ── */}
      <Dialog open={showStore} onClose={() => setShowStore(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🏪 Store</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <ErrorBox msg={storeError} />

          {/* Crew section */}
          <div style={{ marginBottom: 12, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Crew —</div>
          <StatLine>
            <StatKey>Crew</StatKey>
            <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{game.crew} / 8</span>
          </StatLine>
          <StatLine>
            <StatKey>Daily Upkeep</StatKey>
            <span style={{ color: game.crew > 0 ? '#fb923c' : '#64748b' }}>
              {game.crew > 0 ? `-$${(game.crew * 150).toLocaleString()}/day` : 'None'}
            </span>
          </StatLine>
          <StatLine style={{ border: '1px solid rgba(180,90,255,0.25)', background: 'rgba(180,90,255,0.07)', marginBottom: 12 }}>
            <StatKey style={{ color: '#c084fc' }}>Buy Discount</StatKey>
            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>
              {game.crew >= 6 ? '15%' : game.crew >= 4 ? '10%' : game.crew >= 2 ? '5%' : 'None (need 2+)'}
            </span>
          </StatLine>

          {/* Bag Upgrades section */}
          <div style={{ marginBottom: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Bag Upgrades —</div>
          <StatLine>
            <StatKey>Capacity</StatKey>
            <span style={{ color: '#a5b4fc' }}>{game.bagCapacity} units</span>
          </StatLine>
          <StatLine style={{ marginBottom: 12 }}>
            <StatKey>Upgrades Used</StatKey>
            <span style={{ color: bagUpgradesUsed >= 4 ? '#f87171' : '#6ee7b7' }}>{bagUpgradesUsed} / 4</span>
          </StatLine>

          {/* Consumables section */}
          <div style={{ marginBottom: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Consumables —</div>
          {ITEM_CATALOG.map(item => {
            const owned  = game.items?.find(i => i.id === item.id)?.qty ?? 0;
            const maxed  = owned >= item.maxStack;
            return (
              <StatLine key={item.id} style={{ marginBottom: 6 }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <StatKey>{item.emoji} {item.name} <span style={{ color: '#64748b' }}>({owned}/{item.maxStack})</span></StatKey>
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.68rem', color: '#64748b', fontWeight: 400 }}>{item.description}</span>
                </span>
                <Button
                  disabled={maxed || game.cash < item.price}
                  onClick={() => { try { buyConsumable(item.id); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
                  variant="outlined"
                  size="small"
                  sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.68rem', letterSpacing: '0.06em', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', whiteSpace: 'nowrap', ml: 1, '&:hover': { borderColor: '#a78bfa', background: 'rgba(167,139,250,0.08)' }, '&:disabled': { opacity: 0.4 } }}
                >
                  ${item.price.toLocaleString()}
                </Button>
              </StatLine>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={() => setShowStore(false)} sx={cancelSx}>Close</Button>
          <Button
            disabled={game.crew <= 0}
            onClick={() => { try { fireCrew(1); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
            variant="outlined"
            sx={{ fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', color: '#f87171', borderColor: 'rgba(248,113,113,0.4)', '&:hover': { borderColor: '#f87171', background: 'rgba(248,113,113,0.08)' } }}
          >
            Release Crew (−1)
          </Button>
          <Button
            disabled={game.crew >= 8}
            onClick={() => { try { hireCrew(1); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
            variant="contained"
            sx={confirmSx('purple')}
          >
            Hire $800
          </Button>
          <Button
            disabled={bagUpgradesUsed >= 4 || game.cash < 2000}
            onClick={() => { try { upgradeBag(); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
            variant="contained"
            sx={{ ...confirmSx('green'), mt: 0.5 }}
          >
            Bag +25 slots ($2,000)
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Use Item ── */}
      <Dialog open={showUseItem} onClose={() => setShowUseItem(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🎒 Use Item</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {useItemError && <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>⚠ {useItemError}</div>}
          {game.items?.map(item => (
            <StatLine key={item.id} style={{ marginBottom: 6 }}>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StatKey>{item.emoji ?? ''} {item.name}</StatKey>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.68rem', color: '#64748b', fontWeight: 400 }}>
                  {ITEM_CATALOG.find(c => c.id === item.id)?.description}
                </span>
              </span>
              <Button
                onClick={() => {
                  try { activateItem(item.id); setUseItemError(null); setShowUseItem(false); }
                  catch (e) { setUseItemError(e.message); }
                }}
                variant="contained"
                size="small"
                sx={{ ...confirmSx('purple'), ml: 1, whiteSpace: 'nowrap' }}
              >
                Use ×{item.qty}
              </Button>
            </StatLine>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowUseItem(false)} sx={cancelSx}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Bulk Import ── */}
      <Dialog open={showBulkImport} onClose={() => setShowBulkImport(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>📦 Bulk Import</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {bulkError && <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>⚠ {bulkError}</div>}
          <Subtext>Move product at 30% off street price. Costs +2 heat and locks bulk deals for 3 days.</Subtext>
          <div style={{ marginBottom: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.08em' }}>Select drug:</div>
          {DRUGS.map(drug => {
            const available = game.stockLevels?.[game.location]?.[drug.id] ?? 0;
            if (available === 0) return null;
            const basePrice = getMarketPrice(drug.id, game.location, false, {
              dailyMultipliers: game.priceMultipliers?.[game.location] ?? {},
              eventEffects: game.activeEventEffects ?? {},
            });
            const discounted = Math.round(basePrice * 0.70);
            return (
              <div
                key={drug.id}
                onClick={() => setBulkDrug(drug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', marginBottom: '4px',
                  borderRadius: '6px', cursor: 'pointer',
                  background: bulkDrug?.id === drug.id ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.05)',
                  border: `1px solid ${bulkDrug?.id === drug.id ? 'rgba(167,139,250,0.5)' : 'rgba(102,126,234,0.12)'}`,
                }}
              >
                <span style={{ fontSize: '1rem' }}>{drug.emoji}</span>
                <span style={{ flex: 1, fontFamily: 'Courier New, monospace', fontSize: '0.82rem', color: drug.color, fontWeight: 600 }}>{drug.name}</span>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#6ee7b7' }}>${discounted}</span>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.68rem', color: '#64748b' }}>({available} avail)</span>
              </div>
            );
          })}
          {bulkDrug && (
            <TextField
              type="number"
              label="Quantity"
              value={bulkQty}
              onChange={e => setBulkQty(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, step: 5 }}
              sx={{ ...darkTextField, mt: '12px' }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowBulkImport(false)} sx={cancelSx}>Cancel</Button>
          <Button
            disabled={!bulkDrug}
            onClick={() => {
              if (!bulkDrug) return;
              const available = game.stockLevels?.[game.location]?.[bulkDrug.id] ?? 0;
              const basePrice = getMarketPrice(bulkDrug.id, game.location, false, {
                dailyMultipliers: game.priceMultipliers?.[game.location] ?? {},
                eventEffects: game.activeEventEffects ?? {},
              });
              try {
                bulkImport(bulkDrug.id, bulkDrug.name, bulkQty, basePrice, available);
                setBulkError(null);
                setShowBulkImport(false);
              } catch (e) { setBulkError(e.message); }
            }}
            variant="contained"
            sx={confirmSx('orange')}
          >
            Import {bulkQty} units
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dump Bag ── */}
      <Dialog open={showDump} onClose={() => setShowDump(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>⚠ Dump the Bag?</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Subtext>Drop everything on the street. No cash back.</Subtext>
          {game.bag.map(item => (
            <StatLine key={item.name}>
              <StatKey>{item.name}</StatKey>
              <span style={{ color: '#f87171', fontWeight: 700 }}>×{item.qty}</span>
            </StatLine>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowDump(false)} sx={cancelSx}>Cancel</Button>
          <Button onClick={() => { dumpBag(); setShowDump(false); }} variant="contained" sx={confirmSx('red')}>
            Dump It
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Finances ── */}
      <Dialog open={showFinances} onClose={() => setShowFinances(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>💼 Finances</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <StatLine>
            <StatKey>Cash on Hand</StatKey>
            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>${game.cash.toLocaleString()}</span>
          </StatLine>
          <StatLine>
            <StatKey>Current Debt</StatKey>
            <span style={{ color: '#f87171', fontWeight: 600 }}>${game.debt.toLocaleString()}</span>
          </StatLine>
          <StatLine>
            <StatKey>Daily Interest ({interestRate}%)</StatKey>
            <span style={{ color: '#fb923c' }}>+${dailyInterest.toLocaleString()}/day</span>
          </StatLine>
          <StatLine style={{ border: '1px solid rgba(180,90,255,0.25)', background: 'rgba(180,90,255,0.07)' }}>
            <StatKey style={{ color: '#c084fc' }}>Net Worth</StatKey>
            <span style={{ color: netWorth >= 0 ? '#6ee7b7' : '#f87171', fontWeight: 700 }}>
              {netWorth >= 0 ? '' : '-'}${Math.abs(netWorth).toLocaleString()}
            </span>
          </StatLine>
          <StatLine>
            <StatKey>Days Remaining</StatKey>
            <span style={{ color: '#a5b4fc' }}>{daysLeft}</span>
          </StatLine>
          <StatLine>
            <StatKey>Projected Debt (day 60)</StatKey>
            <span style={{ color: '#f87171' }}>
              ${Math.round(game.debt * Math.pow(1 + diff.rate, daysLeft)).toLocaleString()}
            </span>
          </StatLine>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowFinances(false)} sx={cancelSx}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Loan Shark ── */}
      <Dialog open={showLoan} onClose={() => setShowLoan(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>{loanMode === 'take' ? '🦈 Take a Loan' : '💸 Pay Back Loan'}</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <ErrorBox msg={loanError} />
          <StatLine>
            <StatKey>{loanMode === 'take' ? 'Current Debt' : 'Cash Available'}</StatKey>
            <span style={{ color: '#f87171' }}>
              ${(loanMode === 'take' ? game.debt : game.cash).toLocaleString()}
            </span>
          </StatLine>
          <TextField
            type="number"
            label="Amount"
            value={loanAmount}
            onChange={e => setLoanAmount(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: loanMode === 'take' ? diff.loanCap : game.cash, step: 100 }}
            sx={{ ...darkTextField, mt: '16px' }}
          />
          <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#64748b' }}>
            {loanMode === 'take' ? `Max $${diff.loanCap.toLocaleString()} per loan` : `Max $${Math.min(game.cash, game.debt).toLocaleString()}`}
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowLoan(false)} sx={cancelSx}>Cancel</Button>
          <Button onClick={confirmLoan} variant="contained" sx={confirmSx(loanMode === 'take' ? 'purple' : 'green')}>
            {loanMode === 'take' ? 'Borrow' : 'Pay Back'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Tip-Off ── */}
      <Dialog open={showTipOff} onClose={() => setShowTipOff(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🐀 Tip Off the Cops</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <ErrorBox msg={tipError} />
          <Subtext>
            Rat out the local rivals at <strong style={{ color: '#ede0ff' }}>{game.location}</strong>.
            Costs ${TIP_OFF_COST.toLocaleString()} and makes this block hot for 3 days — but drops your heat by 2.
          </Subtext>
          <StatLine>
            <StatKey>Cost</StatKey>
            <span style={{ color: '#f87171' }}>$500</span>
          </StatLine>
          <StatLine>
            <StatKey>Heat Reduction</StatKey>
            <span style={{ color: '#6ee7b7' }}>−2 levels</span>
          </StatLine>
          <StatLine>
            <StatKey>Location Heat Bonus</StatKey>
            <span style={{ color: '#fb923c' }}>+2 for 3 days at {game.location}</span>
          </StatLine>
          <StatLine>
            <StatKey>Cooldown After</StatKey>
            <span style={{ color: '#8b95c9' }}>5 days</span>
          </StatLine>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowTipOff(false)} sx={cancelSx}>Cancel</Button>
          <Button onClick={confirmTipOff} variant="contained" sx={confirmSx('orange')}>
            Tip Them Off
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Difficulty (day 1 only) ── */}
      <Dialog open={showDifficulty} onClose={() => setShowDifficulty(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>⚙ Difficulty</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <ErrorBox msg={diffError} />
          <Subtext>Choose your run. This can only be changed before your first move.</Subtext>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {['easy', 'normal', 'hard'].map(level => (
              <DiffButton
                key={level}
                active={game.difficulty === level ? 'true' : undefined}
                onClick={() => confirmDifficulty(level)}
              >
                {level.toUpperCase()}
              </DiffButton>
            ))}
          </div>
          {[
            { label: 'Interest / day', easy: '3%', normal: '5%', hard: '7%' },
            { label: 'Loan cap',       easy: '$8,000', normal: '$5,000', hard: '$3,000' },
            { label: 'Police heat',    easy: '4+',  normal: '3+',  hard: '2+' },
            { label: 'Rival pressure', easy: 'Low', normal: 'Med', hard: 'High' },
          ].map(row => (
            <StatLine key={row.label}>
              <StatKey>{row.label}</StatKey>
              <span style={{ color: '#ede0ff', fontFamily: 'Courier New, monospace', fontSize: '0.78rem' }}>
                <span style={{ color: '#6ee7b7' }}>{row.easy}</span>
                {' · '}
                <span style={{ color: '#a5b4fc' }}>{row.normal}</span>
                {' · '}
                <span style={{ color: '#f87171' }}>{row.hard}</span>
              </span>
            </StatLine>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowDifficulty(false)} sx={cancelSx}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Lay Low ── */}
      <Dialog open={showLayLow} onClose={() => setShowLayLow(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🏠 Lay Low</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {layLowError && <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>⚠ {layLowError}</div>}
          <Subtext>
            Hole up for 2 days. No market access — just waiting out the heat.<br />
            Costs 2× daily crew upkeep. Surveillance at <strong style={{ color: '#ede0ff' }}>{game.location}</strong> resets.
          </Subtext>
          <StatLine><StatKey>Duration</StatKey><span style={{ color: '#a5b4fc' }}>2 days (day {game.day} → {game.day + 2})</span></StatLine>
          <StatLine><StatKey>Heat Reduction</StatKey><span style={{ color: '#6ee7b7' }}>−3 levels</span></StatLine>
          <StatLine><StatKey>Crew Upkeep</StatKey><span style={{ color: '#fb923c' }}>−${(game.crew * 150 * 2).toLocaleString()}</span></StatLine>
          <StatLine><StatKey>Surveillance Reset</StatKey><span style={{ color: '#6ee7b7' }}>{game.location}</span></StatLine>
          <StatLine><StatKey>Cooldown After</StatKey><span style={{ color: '#8b95c9' }}>5 days</span></StatLine>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowLayLow(false)} sx={cancelSx}>Cancel</Button>
          <Button
            onClick={() => {
              try { layLow(); setShowLayLow(false); }
              catch (e) { setLayLowError(e.message); }
            }}
            variant="contained"
            sx={confirmSx('purple')}
          >
            Lay Low
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Rival Takedown ── */}
      <Dialog open={showRivalTakedown} onClose={() => setShowRivalTakedown(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🎯 Rival Takedown</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {takedownError && <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>⚠ {takedownError}</div>}
          <Subtext>Pay a bounty to knock a rival down 2 levels. Earns +10 prestige and a ticker headline.</Subtext>
          <div style={{ marginBottom: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.08em' }}>Select target:</div>
          {Object.entries(game.rivals ?? {})
            .filter(([, r]) => r.level >= 1)
            .sort(([, a], [, b]) => b.level - a.level)
            .map(([loc, rival]) => {
              const cost = TAKEDOWN_COSTS[rival.level] ?? 2000;
              const isAllied = !!(game.rivalAlliances ?? {})[loc];
              return (
                <div
                  key={loc}
                  onClick={() => setTakedownLocation(loc)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', marginBottom: '4px',
                    borderRadius: '6px', cursor: 'pointer',
                    background: takedownLocation === loc ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.05)',
                    border: `1px solid ${takedownLocation === loc ? 'rgba(167,139,250,0.5)' : 'rgba(102,126,234,0.12)'}`,
                  }}
                >
                  <span style={{ flex: 1, fontFamily: 'Courier New, monospace', fontSize: '0.82rem', color: rival.level >= 3 ? '#f87171' : '#fb923c', fontWeight: 600 }}>
                    {loc}{isAllied ? ' 🤝' : ''}
                  </span>
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#64748b' }}>
                    Level {rival.level}
                  </span>
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: game.cash >= cost ? '#6ee7b7' : '#f87171', fontWeight: 600 }}>
                    ${cost.toLocaleString()}
                  </span>
                </div>
              );
            })}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowRivalTakedown(false)} sx={cancelSx}>Cancel</Button>
          <Button
            disabled={!takedownLocation || game.cash < (TAKEDOWN_COSTS[(game.rivals ?? {})[takedownLocation]?.level] ?? 99999)}
            onClick={() => {
              if (!takedownLocation) return;
              try {
                rivalTakedown(takedownLocation);
                setTakedownError(null);
                setShowRivalTakedown(false);
              } catch (e) { setTakedownError(e.message); }
            }}
            variant="contained"
            sx={confirmSx('red')}
          >
            Execute Takedown
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── New Game ── */}
      <Dialog open={showNewGame} onClose={() => setShowNewGame(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>🔄 New Game</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Subtext>Start fresh from Day 1. All progress will be lost.</Subtext>
          <div style={{ marginBottom: 10, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#c084fc', letterSpacing: '0.1em' }}>SELECT DIFFICULTY</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {['easy', 'normal', 'hard'].map(level => (
              <DiffButton
                key={level}
                active={newGameDiff === level ? 'true' : undefined}
                onClick={() => setNewGameDiff(level)}
              >
                {level.toUpperCase()}
              </DiffButton>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowNewGame(false)} sx={cancelSx}>Cancel</Button>
          <Button
            onClick={() => { resetGame(newGameDiff); setShowNewGame(false); }}
            variant="contained"
            sx={confirmSx('red')}
          >
            Start Over
          </Button>
        </DialogActions>
      </Dialog>
    </Terminal>
  );
}

// expose for Actions.js
const TIP_OFF_COST = 500;

export default Actions;
