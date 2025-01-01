import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a2a6c',
    },
    secondary: {
      main: '#0277bd',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a2a6c',
        },
      },
    },
  },
});

export default theme; 

//colors
// #0384BD - blue
// #06FB07 - green
// #000000 - black
