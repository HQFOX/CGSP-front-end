import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(',')
  },
  palette: {
    primary: {
      main: '#FF7F51',
      light: '#ffb79e',
      dark: '#c75f30',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f0efc0',
      light: '#f6f5d9',
      dark: '#d8d7ac'
    },
    warning: {
      light: '#fbe5a0',
      main: '#f7cb42',
      dark: '#c5a234'
    },
    error: {
      light: '#fb7f9c',
      main: '#f92b5b',
      dark: '#ae1e3f'
    },
    success: {
      light: '#d6f3e3',
      main: '#9ae3bb',
      dark: '#7bb595'
    },
    info: {
      dark: '#40a7cc',
      main: '#48bce5'
    }
  },
  //custom theme variables
  bg: {
    main: '#F9F9F9',
    light: '#F4F5F7'
  },
  text: {
    main: '#F5F5F5',
    light: '#262930'
  }
});

export default theme;
