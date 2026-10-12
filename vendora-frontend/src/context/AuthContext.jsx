// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vendora_token') || sessionStorage.getItem('vendora_token'));
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem('vendora_token');
    sessionStorage.removeItem('vendora_token');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken, newUser, remember = true) => {
    localStorage.removeItem('vendora_token');
    sessionStorage.removeItem('vendora_token');
    (remember ? localStorage : sessionStorage).setItem('vendora_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) { setIsLoading(false); return undefined; }
    setIsLoading(true);
    authAPI.getMe()
      .then(({ data }) => { if (active) setUser(data.data); })
      .catch(() => { if (active) logout(); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [token, logout]);

  const value = useMemo(() => ({ user, token, login, logout, isAuthenticated: Boolean(token && user), isLoading }), [user, token, login, logout, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
