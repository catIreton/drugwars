import React from 'react';
import { styled } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useGame } from '../../GameContext';
import { DRUGS, getMarketPrice } from '../../../data/drugs';

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

const EmptyCase = styled('div')({
  color: 'rgba(212,175,55,0.35)',
  fontSize: '0.82rem',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '16px',
  fontFamily: 'Georgia, serif',
  letterSpacing: '0.05em',
});

function fmt(n) {
  const abs = Math.abs(n).toLocaleString();
  return n >= 0 ? `+$${abs}` : `-$${abs}`;
}

function Bag() {
  const { game } = useGame();
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
  };

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
            const sellPrice = drug && game.location
              ? getMarketPrice(drug.id, game.location, true, priceOptions)
              : null;
            const pnlPerUnit = avgCost != null && sellPrice != null ? sellPrice - avgCost : null;
            const totalPnl = pnlPerUnit != null ? pnlPerUnit * item.qty : null;

            return (
              <Compartment key={item.name}>
                <ItemRow>
                  <ItemName>
                    {drug && <span style={{ fontSize: '1rem' }}>{drug.emoji}</span>}
                    {item.name}
                  </ItemName>
                  <ItemQty>× {item.qty}</ItemQty>
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
    </BriefcaseContainer>
  );
}

export default Bag;
