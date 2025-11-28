// Paleta de colores para modo claro y oscuro

const tintColorLight = '#00B5CC';  // color primario claro
const tintColorDark = '#00D9FF';   // color primario brilloso en oscuro
export const Colors = {
  light: {
    // Colores principales
    background: '#F0F4F8',        // Fondo principal 
    card: '#FFFFFF',              // Fondo de tarjetas 
    text: '#1A202C',              // Texto principal 
    textSecondary: '#718096',     // Texto secundario 
    primary: '#00B5CC',           // Color primario 
    secondary: '#97CE4C',         // Color secundario 
    accent: '#F59E0B',            // Color de acento
    border: '#E2E8F0',            // Bordes
    error: '#EF4444',             // Errores
    success: '#10B981',           // Éxito
    warning: '#F59E0B',           // Advertencias
    // Estados de personajes
    alive: '#10B981',             // Verde para vivo
    dead: '#EF4444',              // Rojo para muerto
    unknown: '#6B7280',           // Gris para desconocido
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    // Colores para modo oscuro
    background: '#101010',        // Fondo principal 
    card: '#0f131fff',              // Fondo de tarjetas 
    text: '#6FCEff',              // Texto principal 
    textSecondary: '#A0AEC0',     // Texto secundario 
    primary: '#00D9FF',           // Color primario más brillante
    secondary: '#AEE24E',         // Verde más brillante
    accent: '#FBB040',            // Naranja más brillante
    border: '#2D3748',            // Bordes
    error: '#F87171',             // Rojo más suave
    success: '#34D399',           // Verde más brillante
    warning: '#FBBF24',           // Amarillo más brillante
    // Estados de personajes
    alive: '#2768b3ff' ,
    dead: '#e94c4cff',
    unknown: '#5b5f64ff',
  },
};