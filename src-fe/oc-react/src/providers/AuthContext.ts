import { createContext } from 'react';
import type { AuthResponse } from '@/features/auth';

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

export type AuthContextType = AuthState & {
  isAuthenticated: boolean;
  setSession: (data: AuthResponse) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roleList: string[]) => boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
