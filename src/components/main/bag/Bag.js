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
});

const StyledTable = styled(Table)({
  marginLeft: 'auto',
  marginRight: 'auto',
});

function Bag() {
  const { game } = useGame();
  const bagUsed = game.bag.reduce((sum, item) => sum + item.qty, 0);

  return (
    <BagContainer>
      <h2>Bag Space: {bagUsed}/{game.bagCapacity}</h2>
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
