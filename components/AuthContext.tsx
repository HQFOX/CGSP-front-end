import { createContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultValue: { currentUser?: User, setCurrentUser: (user?: User) => void } = { currentUser: undefined, setCurrentUser: (_?: User) => {}};

export const AuthContext = createContext(defaultValue);