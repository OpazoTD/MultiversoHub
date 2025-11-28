import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNetInfo } from "../../hooks/useNetInfo";
import { Colors } from "../../constants/Colors";
import { OfflineBanner } from "../../components/OfflineBanner";
import { getCharacters } from "../../services/api";
import { logScreenView, logFilterApplied } from "../../services/telemetry";

/**
 * Pantalla principal (Home)
 * Muestra estadísticas y accesos rápidos
 */
export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const { favoritesCount } = useFavorites();
  const { isConnected } = useNetInfo();

  const [totalCharacters, setTotalCharacters] = useState<number>(0);

  // Log de vista de pantalla al montar
  useEffect(() => {
    logScreenView("Home");
    loadTotalCharacters();
  }, []);

  /**
   * Obtiene el total de personajes desde la API
   */
  const loadTotalCharacters = async () => {
    try {
      const data = await getCharacters(1);
      setTotalCharacters(data.info.count);
    } catch (error) {
      console.error("Error loading total characters:", error);
    }
  };

  /**
   * Navega a la lista de personajes con un filtro
   */
  const handleFilterPress = (status: string) => {
    logFilterApplied("status", status);
    // Aquí podrías pasar parámetros a la siguiente pantalla
    router.push("./characters");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Banner de offline */}
      {!isConnected && <OfflineBanner />}

      <ScrollView style={styles.content}>
        {/* Header de bienvenida */}
        <View style={styles.header}>
          <Image
            source={
              theme === "dark"
                ? require("../../assets/images/Dark-RyM.webp")
                : require("../../assets/images/Light-RyM.webp")
            }
            style={{ width: "100%", height: 200 }}
            resizeMode="cover"
          />

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontFamily: "WubbaLubbaDubDub",
              },
            ]}
          >
            MULTIVERSO HUB
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explora el universo de Rick & Morty
          </Text>
        </View>

        {/* Tarjetas de estadísticas */}
        <View style={styles.statsContainer}>
          {/* Total de personajes */}
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {totalCharacters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Personajes Totales
            </Text>
          </View>

          {/* Favoritos */}
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {favoritesCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Favoritos
            </Text>
          </View>
        </View>

        {/* Filtros rápidos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Filtros Rápidos
          </Text>

          <Pressable
            style={[styles.filterButton, { backgroundColor: colors.alive }]}
            onPress={() => handleFilterPress("alive")}
          >
            <Text style={styles.filterText}>Vivos</Text>
          </Pressable>

          <Pressable
            style={[styles.filterButton, { backgroundColor: colors.dead }]}
            onPress={() => handleFilterPress("dead")}
          >
            <Text style={styles.filterText}>Muertos</Text>
          </Pressable>

          <Pressable
            style={[styles.filterButton, { backgroundColor: colors.unknown }]}
            onPress={() => handleFilterPress("unknown")}
          >
            <Text style={styles.filterText}>Desconocidos</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 1,
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
    aspectRatio: 2, // Ajusta según la proporción de la imagen
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "WubbaLubbaDubDub",
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 36,
    fontWeight: "800",
  },
  statLabel: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    padding: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterText: {
    fontFamily: "WubbaLubbaDubDub",
    color: "##2768B3",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
