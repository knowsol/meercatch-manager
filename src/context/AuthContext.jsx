import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

const STORAGE_KEY = 'meercatch_auth';

function loadAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAuth(auth) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function clearAuth() {
  sessionStorage.removeItem(STORAGE_KEY);
}

const DEFAULT = { loggedIn: false, role: null, userName: '', userRole: null, userId: null };

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth() || DEFAULT);

  const login = (role, name, userRole, userId) => {
    const next = { loggedIn: true, role, userName: name, userRole, userId };
    setAuth(next);
    saveAuth(next);
  };

  const logout = () => {
    setAuth(DEFAULT);
    clearAuth();
  };

  return (
    <AuthCtx.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
