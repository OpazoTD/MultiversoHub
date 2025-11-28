import { TelemetryEvent } from '../types';

// Registra un evento en la consola
export const logEvent = (action: string, details: Record<string, any> = {}): void => {
  const event: TelemetryEvent = {
    timestamp: new Date().toISOString(),
    action,
    details,
  };

  // Log formateado para debugging
  console.log('📊 [TELEMETRY]', JSON.stringify(event, null, 2));
};




//Registra cuando un usuario ve una pantalla
export const logScreenView = (screenName: string): void => {
  logEvent('screen_view', { screen: screenName });
};

//Registra cuando se marca/desmarca un favorito
export const logFavoriteToggle = (characterId: number, isFavorite: boolean): void => {
  logEvent('favorite_toggle', { 
    character_id: characterId, 
    is_favorite: isFavorite 
  });
};

//Registra cuando se aplica un filtro
export const logFilterApplied = (filterType: string, filterValue: string): void => {
  logEvent('filter_applied', { 
    type: filterType, 
    value: filterValue 
  });
};

//Registra cuando cambia el tema
export const logThemeChange = (theme: string): void => {
  logEvent('theme_change', { theme });
};

// Registra errores de la aplicación
export const logError = (errorMessage: string, errorDetails?: any): void => {
  logEvent('error', { 
    message: errorMessage, 
    details: errorDetails 
  });
};

//Registra cuando se carga la API
export const logApiCall = (endpoint: string, success: boolean): void => {
  logEvent('api_call', { 
    endpoint, 
    success 
  });
};