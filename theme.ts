import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';


// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff8e5c',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  //custom theme variables   
  bg: {
        main: '#fff',
        light: '#F4F5F7'
  },
    text: {
        main: '#172B4D',
        light: '#262930'
    }
});

export default theme;


