import React from "react";
import { Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import {
  HeartIconR,
  HomeIcon,
  UserIcon,
  UsersIcon,
} from "@/components/IconLibrary";
import { useSafeAreaInsets } from "react-native-safe-area-context";
/**
 * Layout de navegación con tabs (pestañas inferiores)
 * Usa iconos simples con emojis
 */
export default function TabsLayout() {
  // Accede al tema y a los colores
  const { theme } = useTheme();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        // Estilo de la barra de tabs
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: insets.bottom > 0 ? 0 : 2,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },

        // Estilo del header
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>
              <HomeIcon size={24} />
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="characters"
        options={{
          title: "Personajes",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>
              <UsersIcon size={24} />
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>
              <HeartIconR size={24} />
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>
              <UserIcon size={24} />
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

// Estilos básicos para el icono emoji
const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24, // Tamaño de icono consistente
    // Eliminamos el marginTop: 5 porque ya lo maneja tabBarIconStyle en screenOptions
  },
});
