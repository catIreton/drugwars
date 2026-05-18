import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useGame } from '../../GameContext';

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
  background: color === 'red'
    ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
    : color === 'green'
    ? 'linear-gradient(135deg, #065f46, #059669)'
    : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  '&:hover': { filter: 'brightness(1.15)' },
  boxShadow: color === 'red'
    ? '0 0 12px rgba(220,38,38,0.4)'
    : color === 'green'
    ? '0 0 12px rgba(5,150,105,0.4)'
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

// ── Stat rows (finances + dump list) ─────────────────────────────────────────

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
});

const Prompt = styled('span')({ color: '#00aa28', userSelect: 'none' });

// ── Component ─────────────────────────────────────────────────────────────────

function Actions() {
  const { game, dumpBag, takeLoan, payLoan, hireCrew, fireCrew } = useGame();
  const [showDump, setShowDump] = useState(false);
  const [showFinances, setShowFinances] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [storeError, setStoreError] = useState(null);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [loanError, setLoanError] = useState(null);
  const [loanMode, setLoanMode] = useState('take');

  const dailyInterest = Math.round(game.debt * 0.05);
  const netWorth = game.cash - game.debt;
  const daysLeft = 60 - game.day;

  const openLoan = (mode) => { setLoanMode(mode); setLoanAmount(1000); setLoanError(null); setShowLoan(true); };

  const confirmLoan = () => {
    try {
      if (loanMode === 'take') takeLoan(loanAmount);
      else payLoan(loanAmount);
      setShowLoan(false);
    } catch (e) {
      setLoanError(e.message);
    }
  };

  return (
    <Terminal>
      <TermHeader>C:\DRUGWARS\KC&gt; _</TermHeader>
      <TermTitle>&gt; ACTIONS</TermTitle>
      <CmdButton onClick={() => game.bag.length > 0 && setShowDump(true)}><Prompt>$</Prompt> dump_bag</CmdButton>
      <CmdButton onClick={() => setShowFinances(true)}><Prompt>$</Prompt> finances</CmdButton>
      <CmdButton onClick={() => openLoan('take')}><Prompt>$</Prompt> take_loan</CmdButton>
      <CmdButton onClick={() => openLoan('pay')}><Prompt>$</Prompt> pay_loan</CmdButton>
      <CmdButton onClick={() => { setStoreError(null); setShowStore(true); }}><Prompt>$</Prompt> visit_store</CmdButton>
      {(game.items?.length ?? 0) > 0 && <CmdButton><Prompt>$</Prompt> use_item</CmdButton>}

      {/* ── Store / Crew ── */}
      <Dialog open={showStore} onClose={() => setShowStore(false)} maxWidth="xs" fullWidth PaperProps={{ sx: darkPaper }}>
        <DialogTitle sx={titleSx}>👥 Crew Management</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {storeError && (
            <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
              ⚠ {storeError}
            </div>
          )}

          {/* Current stats */}
          <StatLine>
            <StatKey>Crew</StatKey>
            <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{game.crew} / 8</span>
          </StatLine>
          <StatLine>
            <StatKey>Bag Capacity</StatKey>
            <span style={{ color: '#a5b4fc' }}>{game.bagCapacity} units</span>
          </StatLine>
          <StatLine>
            <StatKey>Daily Upkeep</StatKey>
            <span style={{ color: game.crew > 0 ? '#fb923c' : '#64748b' }}>
              {game.crew > 0 ? `-$${(game.crew * 150).toLocaleString()}/day` : 'None'}
            </span>
          </StatLine>
          <StatLine style={{ border: '1px solid rgba(180,90,255,0.25)', background: 'rgba(180,90,255,0.07)', marginBottom: 16 }}>
            <StatKey style={{ color: '#c084fc' }}>Buy Discount</StatKey>
            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>
              {game.crew >= 6 ? '15%' : game.crew >= 4 ? '10%' : game.crew >= 2 ? '5%' : 'None (need 2+)'}
            </span>
          </StatLine>

          {/* Perk ladder */}
          {[
            { threshold: 2, label: '5% buy discount' },
            { threshold: 4, label: '10% buy discount' },
            { threshold: 6, label: '15% buy discount' },
          ].map(p => (
            <div key={p.threshold} style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5,
              fontFamily: 'Courier New, monospace', fontSize: '0.75rem',
              color: game.crew >= p.threshold ? '#6ee7b7' : '#475569',
            }}>
              <span>{game.crew >= p.threshold ? '✓' : '○'}</span>
              <span>{p.threshold} crew — {p.label}</span>
            </div>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowStore(false)} sx={cancelSx}>Close</Button>
          <Button
            disabled={game.crew <= 0}
            onClick={() => { try { fireCrew(1); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
            variant="outlined"
            sx={{ fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', color: '#f87171', borderColor: 'rgba(248,113,113,0.4)', '&:hover': { borderColor: '#f87171', background: 'rgba(248,113,113,0.08)' } }}
          >
            Release (−1)
          </Button>
          <Button
            disabled={game.crew >= 8}
            onClick={() => { try { hireCrew(1); setStoreError(null); } catch (e) { setStoreError(e.message); } }}
            variant="contained"
            sx={confirmSx('purple')}
          >
            Hire $800
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dump Bag Confirmation ── */}
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
            <StatKey>Daily Interest (5%)</StatKey>
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
            <span style={{ color: '#f87171' }}>${Math.round(game.debt * Math.pow(1.05, daysLeft)).toLocaleString()}</span>
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
          {loanError && (
            <div style={{ padding: '10px 12px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#fca5a5', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
              ⚠ {loanError}
            </div>
          )}
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
            inputProps={{ min: 1, max: loanMode === 'take' ? 5000 : game.cash, step: 100 }}
            sx={{ ...darkTextField, mt: '16px' }}
          />
          <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: '#64748b' }}>
            {loanMode === 'take' ? 'Max $5,000 per loan' : `Max $${Math.min(game.cash, game.debt).toLocaleString()}`}
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowLoan(false)} sx={cancelSx}>Cancel</Button>
          <Button onClick={confirmLoan} variant="contained" sx={confirmSx(loanMode === 'take' ? 'purple' : 'green')}>
            {loanMode === 'take' ? 'Borrow' : 'Pay Back'}
          </Button>
        </DialogActions>
      </Dialog>
    </Terminal>
  );
}

export default Actions;
