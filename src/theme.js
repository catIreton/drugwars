import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4dd0e1',
    },
    secondary: {
      main: '#ffecb3',
    },
    accent: {
      main: '#ff80ab',
    },
    accent2: {
      main: '#0097a7',
    },
    background: {
      default: 'rgba(0, 151, 167, 0.95)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
        },
        contained: {
          width: '200px',
          height: '30px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '5px',
          border: 'none !important',
        },
      },
    },
  },
});

export default theme;
