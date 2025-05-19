import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: "#0097A7",
    },
    primary: {
      main: "#4dd0e1",
      dark: "#b2ebf2",
    },
    secondary: {
      main: "#ffecb3",
    },
    error: {
      main: "#3f51b5",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: "var(--mui-palette-primary-main)",
          margin: 0,
          width: "100vw",
          maxWidth: "1800px",
        },
      },
    },
  },
});

export default theme;
