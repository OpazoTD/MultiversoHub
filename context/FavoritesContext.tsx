import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { saveFavorites, getFavorites } from '../services/storage';
import { logFavoriteToggle } from '../services/telemetry';

// Estado del contexto de favs
interface FavoritesState {
  favoriteIds: number[];          // Array de IDs de personajes favs
}

// Acciones disponibles para el reducer
type FavoritesAction =
  | { type: 'SET_FAVORITES'; payload: number[] }
  | { type: 'ADD_FAVORITE'; payload: number } 
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'RESET_FAVORITES' }; 

// Interfaz del contexto
export interface FavoritesContextType {
  favoriteIds: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  resetFavoritesState: () => void; 
  favoritesCount: number;
}

// Crea el contexto
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Maneja el estado de favoritos
const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  switch (action.type) {
    case 'SET_FAVORITES':
      // Reemplazar toda la lista de favoritos
      return { favoriteIds: action.payload };
      
    case 'ADD_FAVORITE':
      // Agregar un ID si no existe
      if (state.favoriteIds.includes(action.payload)) {
        return state; // Ya existe, no hacer nada
      }
      return { favoriteIds: [...state.favoriteIds, action.payload] };
      
    case 'REMOVE_FAVORITE':
      // Filtrar el ID a remover
      return {
        favoriteIds: state.favoriteIds.filter(id => id !== action.payload),
      };

    case 'RESET_FAVORITES': // <--- NUEVO: Maneja el reseteo
      return {
        favoriteIds: [],
      };
      
    default:
      return state;
  }
};

// Estado inicial
const initialState: FavoritesState = {
  favoriteIds: [],
};

// Provider para favoritos
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useReducer para manejar el estado de favoritos
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Cargar favoritos guardados al iniciar
  useEffect(() => {
    loadFavorites();
  }, []);

  // Guardar favoritos cada vez que cambian
  useEffect(() => {
    if (state.favoriteIds.length >= 0) {
      saveFavorites(state.favoriteIds);
    }
  }, [state.favoriteIds]);

  // Carga los favoritos desde AsyncStorage
  const loadFavorites = async () => {
    const savedFavorites = await getFavorites();
    dispatch({ type: 'SET_FAVORITES', payload: savedFavorites });
  };

  // Agrega un personaje a favoritos
  const addFavorite = (id: number) => {
    dispatch({ type: 'ADD_FAVORITE', payload: id });
    logFavoriteToggle(id, true);
  };

  // Remueve un personaje de favoritos
  const removeFavorite = (id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
    logFavoriteToggle(id, false);
  };

  // Verifica si un personaje es favorito
  const isFavorite = (id: number): boolean => {
    return state.favoriteIds.includes(id);
  };

  // Cambia el estado de favorito de un personaje
  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  // <--- NUEVO: Función para limpiar el estado
  const resetFavoritesState = () => {
    dispatch({ type: 'RESET_FAVORITES' });
  };

  const value: FavoritesContextType = {
    favoriteIds: state.favoriteIds,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    resetFavoritesState, // <--- NUEVO: Agregado al value
    favoritesCount: state.favoriteIds.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto (Asegúrate de tener esto exportado)
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};