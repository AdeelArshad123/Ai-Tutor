import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Guard against SSR/build-time execution where window is not defined.
    if (typeof window === 'undefined') {
      return 'dark';
    }
    try {
      const storedTheme = localStorage.getItem('stacktutor-theme');
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
        console.error("Could not access theme from localStorage", error);
        return 'dark';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem('stacktutor-theme', theme);
    } catch (error) {
        console.error("Could not save theme to localStorage", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};