// React: biblioteca principal
import React, { useState, useEffect } from 'react';

// React Native: componentes nativos
import {
  View,
  Text,
  FlatList,        // Lista optimizada para renderizar grandes cantidades de datos
  StyleSheet,
} from 'react-native';

// Tipos personalizados
import { Character } from '../../types';

// Contexts: acceso al estado global
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNetInfo } from '../../hooks/useNetInfo';

// Constantes y componentes
import { Colors } from '../../constants/Colors';
import  CharacterCard  from '../../components/CharacterCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { OfflineBanner } from '../../components/OfflineBanner';

// Servicios
import { getCharacterById } from '../../services/api';
import { logScreenView, logError } from '../../services/telemetry';
import { HeartIconR } from '@/components/IconLibrary';

/**
 * Pantalla de favoritos
 * Muestra todos los personajes marcados como favoritos
 * Obtiene la información completa de cada personaje desde la API
 */
export default function FavoritesScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { favoriteIds } = useFavorites();  // Obtener IDs de favoritos
  const { isConnected } = useNetInfo();

  // Estados locales
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect: cargar personajes favoritos cuando cambian los IDs
  useEffect(() => {
    logScreenView('Favorites');
    loadFavoriteCharacters();
  }, [favoriteIds]); // Se ejecuta cada vez que cambia la lista de favoritos

  /**
   * Carga la información completa de cada personaje favorito
   * Hace una llamada a la API por cada ID en favoriteIds
   */
  const loadFavoriteCharacters = async () => {
    try {
      setLoading(true);

      if (favoriteIds.length === 0) {
        setFavoriteCharacters([]);
        setLoading(false);
        return;
      }

      if (!isConnected) {
        // En modo offline, no se pueden cargar favoritos
        setLoading(false);
        return;
      }

      // Promise.all: ejecuta todas las peticiones en paralelo
      // Más eficiente que hacer una petición después de otra
      const promises = favoriteIds.map(id => getCharacterById(id));
      const characters = await Promise.all(promises);
      
      setFavoriteCharacters(characters);
    } catch (err) {
      logError('Error loading favorite characters', err);
      setFavoriteCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Componente que se muestra cuando no hay favoritos
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        <HeartIconR size={64} color={colors.textSecondary} />
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No tienes favoritos aún
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        Toca el corazón en un personaje para agregarlo
      </Text>
    </View>
  );

  // Mostrar spinner durante la carga inicial
  if (loading) {
    return <LoadingSpinner message="Cargando favoritos..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Banner de modo offline */}
      {!isConnected && <OfflineBanner />}

      {/* Header con contador */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mis Favoritos
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>
            {favoriteIds.length}
          </Text>
        </View>
      </View>

      {/* Lista de personajes favoritos */}
      <FlatList
        data={favoriteCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  // Título a la izquierda, badge a la derecha
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 24,
    fontWeight: '700',
  },
  badge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,              // Círculo
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'WubbaLubbaDubDub',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,                  // Icono semi-transparente
  },
  emptyText: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 14,
    textAlign: 'center',
  },
});