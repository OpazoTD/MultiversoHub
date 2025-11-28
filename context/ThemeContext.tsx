import React, { createContext, useContext, useState, useEffect, ReactNode, JSX } from 'react';
import { Theme } from '../types';
import { saveTheme, getTheme } from '../services/storage';
import { logThemeChange } from '../services/telemetry';

// Interfaz para el contexto del tema
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: Theme) => void; // <--- Agregado: Definición en la interfaz
  isDark: boolean;
}

// Crear el contexto con valor undefined inicial
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props para el provider
interface ThemeProviderProps {
  children: ReactNode;
}

// Envuelve la app y proporciona el tema
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

  // <--- Agregado: Función para establecer un modo específico (usado al resetear datos)
  const setThemeMode = async (mode: Theme) => {
    setTheme(mode);
    await saveTheme(mode);
    logThemeChange(mode);
  };

  // Alterna entre tema claro y oscuro
  const toggleTheme = async () => {
    // Determina el nuevo tema
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    // Reutilizamos la lógica de guardar y loguear
    await setThemeMode(newTheme);
  };
  
  const isDark = theme === 'dark';

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setThemeMode, // <--- Agregado: Exponer la función
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
  
  // Verificar que se esté usando dentro del provider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};