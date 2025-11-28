// Interfaz principal para un personaje de Rick & Morty
export interface Character {
  id: number;                    // ID único del personaje
  name: string;                  // Nombre del personaje
  status: 'Alive' | 'Dead' | 'unknown'; // Estado vital
  species: string;               // Especie (Human, Alien, etc.)
  type: string;                  // Subtipo o variante
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;                // Nombre del lugar de origen
    url: string;                 // URL para más detalles
  };
  location: {
    name: string;                // Ubicación actual
    url: string;
  };
  image: string;                 // URL de la imagen del personaje
  episode: string[];             // Array de URLs de episodios
  url: string;                   // URL del personaje en la API
  created: string;               // Fecha de creación en la API
}

// Respuesta de la API al obtener lista de personajes
export interface ApiResponse {
  info: {
    count: number;               // Total de personajes
    pages: number;               // Total de páginas
    next: string | null;         // URL siguiente página
    prev: string | null;         // URL página anterior
  };
  results: Character[];          // Array de personajes
}

// Interfaz para un episodio
export interface Episode {
  id: number;
  name: string;                  // Nombre del episodio
  air_date: string;              // Fecha de emisión
  episode: string;               // Código del episodio (S01E01)
  characters: string[];
  url: string;
  created: string;
}

// Tipo para eventos de telemetría
export interface TelemetryEvent {
  timestamp: string;             // Fecha y hora del evento
  action: string;                // Tipo de acción (view, favorite, etc.)
  details: Record<string, any>;  // Detalles adicionales del evento
}

// Tema de la aplicación
export type Theme = 'light' | 'dark';

// Filtros disponibles para personajes
export type CharacterStatus = 'alive' | 'dead' | 'unknown' | 'all';