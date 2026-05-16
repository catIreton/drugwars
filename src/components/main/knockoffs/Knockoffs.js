import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import { DRUGS, getMarketPrice, getAvailableQuantity, LOCATION_MARKETS } from '../../../data/drugs';
import { useGame } from '../../GameContext';

const KnockoffsContainer = styled('div')({
  flex: 1,
});

const StyledTable = styled(Table)({
  marginLeft: 'auto',
  marginRight: 'auto',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
}));

const PriceCell = styled(TableCell)({
  textAlign: 'right',
  minWidth: '100px',
});

function Knockoffs() {
  const { game, buyItem, sellItem } = useGame();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'
  const [error, setError] = useState(null);

  if (!game.location) {
    return (
      <KnockoffsContainer>
        <h2>Market</h2>
        <p style={{ color: '#999' }}>Travel to a location to see available drugs</p>
      </KnockoffsContainer>
    );
  }

  const marketLocation = LOCATION_MARKETS[game.location];
  if (!marketLocation) {
    return (
      <KnockoffsContainer>
        <h2>Market</h2>
        <p style={{ color: '#999' }}>No market data for this location</p>
      </KnockoffsContainer>
    );
  }

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
    if (!selectedDrug || quantity < 1) return;

    const price = getMarketPrice(selectedDrug.id, game.location, action === 'sell');
    const availableQty = getAvailableQuantity(selectedDrug.id, game.location);

    try {
      if (action === 'buy') {
        buyItem(selectedDrug.id, selectedDrug.name, quantity, price, availableQty);
      } else {
        sellItem(selectedDrug.id, selectedDrug.name, quantity, price);
      }
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KnockoffsContainer>
      <h2>Market - {game.location}</h2>
      <p style={{ fontSize: '0.9em', color: '#999' }}>Heat: {marketLocation.heatLevel}</p>
      <StyledTable size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '180px' }}>Drug</TableCell>
            <TableCell align="right">Buy Price</TableCell>
            <TableCell align="right">Sell Price</TableCell>
            <TableCell align="right">Available</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DRUGS.map(drug => {
            const buyPrice = getMarketPrice(drug.id, game.location, false);
            const sellPrice = getMarketPrice(drug.id, game.location, true);
            const available = getAvailableQuantity(drug.id, game.location);

            return (
              <StyledTableRow key={drug.id}>
                <TableCell>
                  <strong>{drug.name}</strong>
                  <div style={{ fontSize: '0.8em', color: '#999' }}>{drug.description}</div>
                </TableCell>
                <PriceCell>${buyPrice}</PriceCell>
                <PriceCell>${sellPrice}</PriceCell>
                <TableCell align="right">{available}</TableCell>
                <TableCell align="right">
                  {available > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleRowClick(drug, 'buy')}
                      style={{ marginRight: '5px' }}
                    >
                      Buy
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRowClick(drug, 'sell')}
                  >
                    Sell
                  </Button>
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>

      {/* Buy/Sell Dialog */}
      <Dialog open={!!selectedDrug} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'buy' ? 'Buy' : 'Sell'} {selectedDrug?.name}
        </DialogTitle>
        <DialogContent>
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#ffebee',
              border: '1px solid #ff5252',
              borderRadius: '4px',
              color: '#c62828',
              fontSize: '0.9em'
            }}>
              {error}
            </div>
          )}
          <div style={{ paddingTop: error ? '10px' : '20px' }}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />
            {selectedDrug && (
              <div style={{ marginTop: '20px', fontSize: '0.9em' }}>
                <p>
                  <strong>Price per unit:</strong> ${getMarketPrice(selectedDrug.id, game.location, action === 'sell')}
                </p>
                <p>
                  <strong>Total:</strong> ${getMarketPrice(selectedDrug.id, game.location, action === 'sell') * quantity}
                </p>
                {action === 'buy' && (
                  <p>
                    <strong>Cash after:</strong> ${game.cash - (getMarketPrice(selectedDrug.id, game.location, false) * quantity)}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm {action === 'buy' ? 'Purchase' : 'Sale'}
          </Button>
        </DialogActions>
      </Dialog>
    </KnockoffsContainer>
  );
}

export default Knockoffs;
