import React, { createContext, useContext, useState, useEffect, ReactNode, JSX } from 'react';
import { Theme } from '../types';
import { saveTheme, getTheme } from '../services/storage';
import { logThemeChange } from '../services/telemetry';

// Interfaz para el contexto del tema
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }): React.JSX.Element => {
  const [theme, setTheme] = useState<Theme>('light');

  // Carga el tema guardado al iniciar la app
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Carga el tema guardado en AsyncStorage
  const loadSavedTheme = async () => {
    const savedTheme = await getTheme();
    setTheme(savedTheme);
  };

  const setThemeMode = async (mode: Theme) => {
    setTheme(mode);
    await saveTheme(mode);
    logThemeChange(mode);
  };

  const toggleTheme = async () => {
    // Determina el nuevo tema
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    await setThemeMode(newTheme);
  };
  
  const isDark = theme === 'dark';

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto del tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
