// React: biblioteca principal
import React from 'react';

// React Native: componentes nativos
import { View, Text, StyleSheet } from 'react-native';

// Tipos y contexts
import { Episode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

// Props que recibe el componente
interface Props {
  episodes: Episode[];  // Array de episodios a mostrar
}

/**
 * Componente que muestra una lista de episodios
 * Cada episodio se muestra como una tarjeta con información básica
 */
export const EpisodeList: React.FC<Props> = ({ episodes }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      {/* Mapear cada episodio a un componente EpisodeCard */}
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} colors={colors} />
      ))}
    </View>
  );
};

/**
 * Componente individual para cada episodio
 * Muestra: código del episodio, nombre y fecha de emisión
 */
const EpisodeCard: React.FC<{ episode: Episode; colors: any }> = ({ episode, colors }) => (
  <View style={[styles.card, { backgroundColor: colors.card }]}>
    {/* Código del episodio (ej: S01E01) */}
    <Text style={[styles.episodeCode, { color: colors.primary }]}>
      {episode.episode}
    </Text>
    
    {/* Nombre del episodio */}
    <Text style={[styles.episodeName, { color: colors.text }]} numberOfLines={1}>
      {episode.name}
    </Text>
    
    {/* Fecha de emisión */}
    <Text style={[styles.airDate, { color: colors.textSecondary }]}>
      {episode.air_date}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,  // Espacio entre tarjetas
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,           // Borde izquierdo de acento
    borderLeftColor: '#00B5CC',   // Color del portal de Rick & Morty
  },
  episodeCode: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,             // Espaciado entre letras
  },
  episodeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  airDate: {
    fontSize: 12,
  },
});