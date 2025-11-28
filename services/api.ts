import { Character, ApiResponse, Episode } from '../types';

// URL de la API de Rick & Morty
const BASE_URL = 'https://rickandmortyapi.com/api';

//Obtiene una lista de personajes con paginación
export const getCharacters = async (
  page: number = 1,
  status?: string
): Promise<ApiResponse> => {
  try {
    let url = `${BASE_URL}/character?page=${page}`;
        if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    const response = await fetch(url);
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parsea la respuesta JSON
    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

//Obtiene un personaje por su ID
export const getCharacterById = async (id: number): Promise<Character> => {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Character = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
};

//Obtiene información de un episodio por su URL
export const getEpisodeByUrl = async (url: string): Promise<Episode> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Episode = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw error;
  }
};

//Obtiene múltiples episodios en paralelo
export const getMultipleEpisodes = async (urls: string[]): Promise<Episode[]> => {
  try {
    // Usar Promise.all para hacer todas las peticiones en paralelo
    const promises = urls.map(url => getEpisodeByUrl(url));
    const episodes = await Promise.all(promises);
    return episodes;
  } catch (error) {
    console.error('Error fetching multiple episodes:', error);
    throw error;
  }
};

//Busca personajes por nombre
export const searchCharactersByName = async (name: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/character?name=${name}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching characters:', error);
    throw error;
  }
};