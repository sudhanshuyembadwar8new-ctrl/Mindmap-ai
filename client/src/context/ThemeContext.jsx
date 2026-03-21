import { createContext, useContext, useState, useEffect } from 'react';
import { themes, applyTheme } from '../utils/themes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('mindmap-theme') || 'dark'
  );

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('mindmap-theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
