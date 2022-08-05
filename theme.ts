import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';


// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff8e5c',
      light: '#ffbf8a',
      dark: '#c75f30',
    },
    secondary: {
      main: '#d3d3d3',
      light: '#ffffff',
      dark: '#a2a2a2',
    },
    error: {
      main: red.A400,
    },
  },
  //custom theme variables   
  bg: {
        main: '#F5F5F5',
        light: '#F4F5F7'
  },
    text: {
        main: '#F5F5F5',
        light: '#262930'
    }
});

export default theme;


