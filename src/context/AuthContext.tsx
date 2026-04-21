'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserRole } from '@/types';

const STORAGE_KEY = 'meercatch_auth';

interface AuthState {
  loggedIn: boolean;
  role: 'manager' | 'direct' | null;
  userName: string;
  userRole: UserRole | null;
  userId: string | null;
  permissionId: number | null;
}

interface AuthContextValue extends AuthState {
  /** sessionStorage 복원 전까지 false — 서버/클라 첫 페인트 일치용 */
  hydrated: boolean;
  login: (role: 'manager' | 'direct', name: string, userRole: UserRole, userId: string, permissionId: number) => void;
  logout: () => void;
}

function loadAuth(): AuthState | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAuth(auth: AuthState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function clearAuth(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

const DEFAULT: AuthState = {
  loggedIn: false,
  role: null,
  userName: '',
  userRole: null,
  userId: null,
  permissionId: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // 초기값은 항상 DEFAULT — 서버와 클라이언트 첫 렌더를 동일하게 유지 (hydration 오류 방지)
  const [auth, setAuth] = useState<AuthState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadAuth();
    if (saved) setAuth(saved);
    setHydrated(true);
  }, []);

  const login = (role: 'manager' | 'direct', name: string, userRole: UserRole, userId: string, permissionId: number) => {
    const next: AuthState = { loggedIn: true, role, userName: name, userRole, userId, permissionId };
    setAuth(next);
    saveAuth(next);
  };

  const logout = () => {
    setAuth(DEFAULT);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ ...auth, hydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
