import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a2a6c",
    },
    secondary: {
      main: "#0277bd",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a2a6c",
        },
      },
    },
  },
});

export default theme;

//colors
// blue-#0384BD
// green-#06FB07
// black-#000000
// lightgrey-#f5f5f5
