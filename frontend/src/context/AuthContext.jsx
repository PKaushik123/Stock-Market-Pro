import { useMemo, useState, useEffect } from 'react';
import { AuthContext } from './authContext.js';

export { AuthContext } from './authContext.js';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('stockmarket_token') || '');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('stockmarket_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('stockmarket_token', token);
    } else {
      localStorage.removeItem('stockmarket_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('stockmarket_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stockmarket_user');
    }
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      setToken,
      setUser,
      logout: () => {
        setToken('');
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
