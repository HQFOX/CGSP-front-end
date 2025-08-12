import { createContext } from 'react';

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
