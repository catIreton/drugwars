import React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useGame } from '../../GameContext';

const BagContainer = styled('div')({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const StyledTable = styled(Table)({
  width: '100%',
  fontSize: '0.85rem',
  '& th, & td': {
    padding: '2px 8px',
  },
});

function Bag() {
  const { game } = useGame();
  const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);

  return (
    <BagContainer>
      <h2 style={{ margin: '0 0 8px 0', color: '#667eea', fontSize: '1.1rem' }}>Bag Space: {bagUsed}/{game.bagCapacity}</h2>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Item</TableCell>
            <TableCell>Qty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {game.bag.map((item) => (
            <TableRow key={item.name}>
              <TableCell />
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </BagContainer>
  );
}

export default Bag;
