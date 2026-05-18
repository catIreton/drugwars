import React from 'react';
import { styled } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useGame } from '../../GameContext';

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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 10px',
  marginBottom: '5px',
  background: 'rgba(212,175,55,0.06)',
  border: '1px solid rgba(212,175,55,0.18)',
  borderLeft: '3px solid rgba(212,175,55,0.5)',
  borderRadius: '4px',
});

const ItemName = styled('span')({
  color: '#ddd6fe',
  fontFamily: 'Georgia, serif',
  fontSize: '0.88rem',
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

const EmptyCase = styled('div')({
  color: 'rgba(212,175,55,0.35)',
  fontSize: '0.82rem',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '16px',
  fontFamily: 'Georgia, serif',
  letterSpacing: '0.05em',
});

function Bag() {
  const { game } = useGame();
  const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);
  const pct = Math.round((bagUsed / game.bagCapacity) * 100);
  const fillColor = pct > 80
    ? 'linear-gradient(90deg, #a78bfa, #ef4444)'
    : 'linear-gradient(90deg, #4c1d95, #a78bfa)';

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
        : game.bag.map(item => (
          <Compartment key={item.name}>
            <ItemName>{item.name}</ItemName>
            <ItemQty>× {item.qty}</ItemQty>
          </Compartment>
        ))
      }
    </BriefcaseContainer>
  );
}

export default Bag;
