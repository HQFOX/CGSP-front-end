import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultValue = {
  user: undefined,
  setUser: (_?: User) => {},
  isAuth: false,
  setIsAuth: () => {}
};

export const AuthContext = createContext<{
  user?: User;
  setUser: (user?: User) => void;
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
}>(defaultValue);
