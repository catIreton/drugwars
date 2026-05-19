import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#D4AF37',
    },
    background: {
      default: '#0d001a',
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
