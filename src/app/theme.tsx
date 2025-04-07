import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: "#6699CC",
    },
    primary: {
      main: "#99cc66",
      dark: "#37521b",
    },
    secondary: {
      main: "#189ab4",
    },
    error: {
      main: "#e32227",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: "var(--mui-palette-primary-main)",
          borderRadius: "2%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          border: "3px solid var(--mui-palette-primary-dark)",
          borderRadius: "2%",
        },
      },
    },
  },
});

declare module "@mui/material/Container" {
  interface ContainerPropsVariantOverrides {
    outlined: true;
  }
}

export default theme;
