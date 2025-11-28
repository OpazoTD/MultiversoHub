import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, Theme } from '../types';

// Keys para AsyncStorage
const STORAGE_KEYS = {
  FAVORITES: '@multiverso_hub:favorites',
  THEME: '@multiverso_hub:theme',
  CACHED_CHARACTERS: '@multiverso_hub:cached_characters',
};

//Guarda la lista de favoritos en AsyncStorage
export const saveFavorites = async (favorites: number[]): Promise<void> => {
  try {
    // Convertir array a JSON string
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, jsonValue);
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Obtiene la lista de favoritos desde AsyncStorage
export const getFavorites = async (): Promise<number[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    // Si no existe, retornar array vacío
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Guarda el tema seleccionado
export const saveTheme = async (theme: Theme): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

//Obtiene el tema guardado
export const getTheme = async (): Promise<Theme> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as Theme) || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

// Guarda personajes en caché para modo offline
export const cacheCharacters = async (characters: Character[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(characters);
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_CHARACTERS, jsonValue);
  } catch (error) {
    console.error('Error caching characters:', error);
  }
};

//Obtiene personajes desde el caché
export const getCachedCharacters = async (): Promise<Character[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_CHARACTERS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting cached characters:', error);
    return [];
  }
};

//Limpia todos los datos guardados
export const clearAllData = async (): Promise<void> => {
  try {
    // Obtener todas las keys de la app
    await AsyncStorage.multiRemove([STORAGE_KEYS.FAVORITES, STORAGE_KEYS.CACHED_CHARACTERS, STORAGE_KEYS.THEME])

    console.log("✅ All app data cleared successfully")
  } catch (error) {
    console.error("Error clearing data:", error)
    throw error
  }
}