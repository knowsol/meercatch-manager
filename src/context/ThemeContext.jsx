import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('mc_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mc_theme', theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t);
  const toggleTheme = () => setThemeState(t => t === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
