import React from 'react';
import { styled } from '@mui/material/styles';
import { useGame } from '../../GameContext';

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
  '&:active': {
    opacity: 0.5,
  },
});

const Prompt = styled('span')({
  color: '#00aa28',
  userSelect: 'none',
});

function Actions() {
  const { dumpBag } = useGame();

  return (
    <Terminal>
      <TermHeader>C:\DRUGWARS\KC&gt; _</TermHeader>
      <TermTitle>&gt; ACTIONS</TermTitle>
      <CmdButton onClick={dumpBag}><Prompt>$</Prompt> dump_bag</CmdButton>
      <CmdButton><Prompt>$</Prompt> buy_item</CmdButton>
      <CmdButton><Prompt>$</Prompt> sell_item</CmdButton>
      <CmdButton><Prompt>$</Prompt> finances</CmdButton>
      <CmdButton><Prompt>$</Prompt> visit_store</CmdButton>
      <CmdButton><Prompt>$</Prompt> pay_loan</CmdButton>
      <CmdButton><Prompt>$</Prompt> use_item</CmdButton>
    </Terminal>
  );
}

export default Actions;
