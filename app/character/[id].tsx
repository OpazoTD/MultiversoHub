import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,      
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Character, Episode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Colors } from '../../constants/Colors';
import { getCharacterById, getMultipleEpisodes } from '../../services/api';
import { logScreenView, logError } from '../../services/telemetry';
import { EpisodeList } from '../../components/EpisodeList';
import { HeartIconR } from '@/components/IconLibrary';
/**
 * Pantalla de detalle del personaje
 * Muestra información completa y episodios en los que aparece
 * URL: /character/[id] (ej: /character/1)
 */
export default function CharacterDetailScreen() {
  // Obtener el ID desde la URL usando el hook de Expo Router
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Hooks de contexto
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { isFavorite, toggleFavorite } = useFavorites();

  // Estados locales
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Convertir ID de string a número
  const characterId = parseInt(id as string, 10);
  const isCharacterFavorite = isFavorite(characterId);

  //carga datos cuando cambia el ID
  useEffect(() => {
    if (characterId) {
      loadCharacterData();
    }
  }, [characterId]);

  const loadCharacterData = async () => {
    try {
      setLoading(true);
      setError('');
      
      //Obtener personaje por ID
      const characterData = await getCharacterById(characterId);
      setCharacter(characterData);
      
      logScreenView(`Character Detail: ${characterData.name}`);

      // Obtener episodios 
      if (characterData.episode.length > 0) {
        const episodeUrls = characterData.episode.slice(0, 5);
        const episodesData = await getMultipleEpisodes(episodeUrls);
        setEpisodes(episodesData);
      }
    } catch (err) {
      const errorMessage = 'Error al cargar el personaje';
      setError(errorMessage);
      logError(errorMessage, err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el toggle de favorito
   */
  const handleFavoritePress = () => {
    toggleFavorite(characterId);
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Mostrar error si falla la carga
  if (error || !character) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || 'Personaje no encontrado'}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  // Obtener color según estado del personaje
  const statusColor = colors[character.status.toLowerCase() as 'alive' | 'dead' | 'unknown'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Imagen del personaje */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: character.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Botón de favorito flotante */}
        <Pressable
          onPress={handleFavoritePress}
          style={[styles.favoriteButton, { backgroundColor: colors.card }]}
        >
          <Text style={styles.favoriteIcon}>
            {isCharacterFavorite ? 
          <HeartIconR size={35}color={colors.error} /> : 
          <HeartIconR size={35} color={colors.textSecondary} />  
          }
          </Text>
        </Pressable>
      </View>

      {/* Información del personaje */}
      <View style={styles.content}>
        {/* Nombre */}
        <Text style={[styles.name, { color: colors.text }]}>
          {character.name}
        </Text>

        {/* Badge de estado */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {character.status} - {character.species}
          </Text>
        </View>

        {/* Sección de información */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <InfoRow
            label="Género"
            value={character.gender}
            colors={colors}
          />
          <InfoRow
            label="Especie"
            value={character.species}
            colors={colors}
          />
          {character.type && (
            <InfoRow
              label="Tipo"
              value={character.type}
              colors={colors}
            />
          )}
          <InfoRow
            label="Origen"
            value={character.origin.name}
            colors={colors}
          />
          <InfoRow
            label="Ubicación"
            value={character.location.name}
            colors={colors}
          />
        </View>

        {/* Lista de episodios */}
        {episodes.length > 0 && (
          <View style={styles.episodesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Episodios ({character.episode.length})
            </Text>         
            <EpisodeList episodes={episodes} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

/**
 * Componente auxiliar para mostrar una fila de información
 * Reutilizable para cada dato del personaje
 */
const InfoRow = ({ 
  label, 
  value, 
  colors 
}: { 
  label: string; 
  value: string; 
  colors: any;
}) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
      {label}:
    </Text>
    <Text style={[styles.infoValue, { color: colors.text }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 400,           // Altura fija para la imagen
    position: 'relative',  // Permite posicionar el botón de favorito
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: { 
    position: 'absolute',   // Posición absoluta sobre la imagen
    top: 20,
    right: 20,
    width: 1,
    height: 1,
    borderRadius: 25,       // Círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,           // Sombra en Android
  },
  favoriteIcon: {
    fontSize: 28,
  },
  content: {
    padding: 20,
  },
  name: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,        // Círculo
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)', // Línea divisoria sutil
  },
  infoLabel: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 14,
    fontWeight: '600',
    width: 100,            // Ancho fijo para alinear valores
  },
  infoValue: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 14,
    flex: 1,               // Ocupar espacio restante
  },
  episodesSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 14,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});