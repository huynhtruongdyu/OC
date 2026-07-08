import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '@/features/auth';
import { AuthContext } from './AuthContext';

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: {
    email: string;
    displayName: string;
    roles: string[];
    permissions: string[];
  } | null;
};

const AUTH_KEY = 'oc_auth';

const loadAuth = (): AuthState => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw
      ? JSON.parse(raw)
      : { token: null, refreshToken: null, user: null };
  } catch {
    return { token: null, refreshToken: null, user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(loadAuth);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  }, [state]);

  const setSession = useCallback((data: AuthResponse) => {
    setState({
      token: data.token,
      refreshToken: data.refreshToken,
      user: {
        email: data.email,
        displayName: data.displayName,
        roles: data.roles,
        permissions: data.permissions,
      },
    });
  }, []);

  const setTokens = useCallback((token: string, refreshToken: string) => {
    setState((prev) => ({ ...prev, token, refreshToken }));
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, refreshToken: null, user: null });
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const can = useCallback(
    (permission: string) =>
      state.user?.permissions?.includes(permission) ?? false,
    [state.user?.permissions],
  );

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: !!state.token,
      setSession,
      setTokens,
      logout,
      can,
    }),
    [state, setSession, setTokens, logout, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
