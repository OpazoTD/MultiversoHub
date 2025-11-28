import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { Character, CharacterStatus } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNetInfo } from "../../hooks/useNetInfo";
import { Colors } from "../../constants/Colors";
import CharacterCard from "../../components/CharacterCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { OfflineBanner } from "../../components/OfflineBanner";
import { getCharacters, searchCharactersByName } from "../../services/api";
import { cacheCharacters, getCachedCharacters } from "../../services/storage";
import {
  logScreenView,
  logFilterApplied,
  logError,
} from "../../services/telemetry";


export default function CharactersScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  //  detecta si hay conexión a internet
  const { isConnected } = useNetInfo();

  // Estados locales del componente
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Si hay más páginas
  const [searchQuery, setSearchQuery] = useState<string>(""); // Texto de búsqueda
  const [statusFilter, setStatusFilter] = useState<CharacterStatus>("all"); // Filtro activo
  const [error, setError] = useState<string>(""); // Mensaje de error

  useEffect(() => {
    logScreenView("Characters");
    loadInitialData(); // Cargar datos iniciales
  }, []);

  // se ejecuta cuando cambia el filtro de estado
  useEffect(() => {
    if (statusFilter !== "all") {
      resetAndLoadWithFilter();
    }
  }, [statusFilter]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      if (isConnected) {
        // Obtener desde la API
        const data = await getCharacters(1);
        setCharacters(data.results);
        setHasMore(data.info.next !== null);
        setCurrentPage(1);

        // Guardar en caché para modo offline
        await cacheCharacters(data.results);
      } else {
        // Modo offline: obtener desde caché
        const cachedData = await getCachedCharacters();
        setCharacters(cachedData);
        setHasMore(false); // No hay paginación en modo offline
      }
    } catch (err) {
      const errorMessage = "Error al cargar personajes";
      setError(errorMessage);
      logError(errorMessage, err);

      // Intentar cargar desde caché como fallback
      const cachedData = await getCachedCharacters();
      if (cachedData.length > 0) {
        setCharacters(cachedData);
      }
    } finally {
      setLoading(false);
    }
  };

  //Carga más personajes al hacer scroll (paginación infinita)
  const loadMoreCharacters = async () => {
    // Validaciones: no cargar si ya está cargando, no hay más, o no hay conexión
    if (loadingMore || !hasMore || !isConnected) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const statusParam = statusFilter !== "all" ? statusFilter : undefined;
      const data = await getCharacters(nextPage, statusParam);

      // Agrega nuevos personajes al final de la lista existente
      setCharacters((prev) => [...prev, ...data.results]);
      setCurrentPage(nextPage);
      setHasMore(data.info.next !== null);
      // Actualizar caché con la lista completa
      await cacheCharacters([...characters, ...data.results]);
    } catch (err) {
      logError("Error loading more characters", err);
    } finally {
      setLoadingMore(false);
    }
  };

  //Reinicia la lista y carga con el filtro seleccionado
  const resetAndLoadWithFilter = async () => {
    try {
      setLoading(true);
      setError("");
      const statusParam = statusFilter !== "all" ? statusFilter : undefined;
      const data = await getCharacters(1, statusParam);
      setCharacters(data.results);
      setCurrentPage(1);
      setHasMore(data.info.next !== null);
      logFilterApplied("status", statusFilter);
    } catch (err) {
      setError("No se encontraron personajes con ese filtro");
      setCharacters([]);
      logError("Error applying filter", err);
    } finally {
      setLoading(false);
    }
  };

  //Realiza búsqueda por nombre
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData(); // Si no hay búsqueda, recargar todo
      return;
    }

    if (!isConnected) {
      setError("Se requiere conexión para buscar");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchCharactersByName(searchQuery);
      setCharacters(data.results);
      setHasMore(false); // Deshabilitar paginación en búsqueda
    } catch (err) {
      setError("No se encontraron personajes con ese nombre");
      setCharacters([]);
      logError("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  //Componente de filtro individual
  const FilterButton = ({
    status,
    label,
  }: {
    status: CharacterStatus;
    label: string;
  }) => (
    <Pressable
      onPress={() => setStatusFilter(status)}
      style={[
        styles.filterChip,
        {
          backgroundColor:
            statusFilter === status ? colors.primary : colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: statusFilter === status ? "#FFF" : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  //Componente de footer que se muestra al final de la lista
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };


//Componente que se muestra cuando la lista está vacía
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {error || "No se encontraron personajes"}
        </Text>
      </View>
    );
  };

  // Mostrar spinner de carga completa solo en la carga inicial
  if (loading && characters.length === 0) {
    return <LoadingSpinner message="Cargando personajes..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Banner de modo offline */}
      {!isConnected && <OfflineBanner />}

      {/* Header con búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Buscar por nombre..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Buscar al presionar Enter
          returnKeyType="search" // Botón "Buscar" en teclado
        />

        <Pressable
          onPress={handleSearch}
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>
      </View>

      {/* Filtros por estado */}
      <View style={styles.filtersContainer}>
        <FilterButton status="all" label="Todos" />
        <FilterButton status="alive" label="Vivos" />
        <FilterButton status="dead" label="Muertos" />
        <FilterButton status="unknown" label="Desconocidos" />
      </View>

      {/* Lista de personajes con FlatList */}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()} // Key única para cada item
        renderItem={({ item }) => <CharacterCard character={item} />}
        ListFooterComponent={renderFooter} // Componente al final
        ListEmptyComponent={renderEmpty} // Cuando no hay datos
        onEndReached={loadMoreCharacters} // Callback al llegar al final
        onEndReachedThreshold={0.5} // Activar al 50% del final
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} // Ocultar scrollbar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
  },
  searchContainer: {
    flexDirection: "row", // Elementos en fila horizontal
    padding: 16,
    gap: 12, // Espacio entre input y botón
    alignItems: "center",
  },
  searchInput: {
    fontFamily: "WubbaLubbaDubDub",
    flex: 1, // Ocupar espacio restante
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    fontFamily: "WubbaLubbaDubDub",
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    fontFamily: "WubbaLubbaDubDub",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
