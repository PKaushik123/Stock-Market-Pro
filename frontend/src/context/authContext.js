import { createContext } from 'react';

export const AuthContext = createContext({
  token: '',
  user: null,
  setToken: () => {},
  setUser: () => {},
  logout: () => {},
});
