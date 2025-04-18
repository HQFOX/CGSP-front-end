import { Theme } from '@mui/material/styles';
import 'styled-components';

interface CustomTheme {
  bg: {
    main: string;
    light: string;
  };
  text: {
    main: string;
    light: string;
  };
}
declare module '@mui/material/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
