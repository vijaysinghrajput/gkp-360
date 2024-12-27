import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    secondary: {
      main: "#FFC107",
    },
    background: {
      default: "#f9f9f9",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export default theme;
