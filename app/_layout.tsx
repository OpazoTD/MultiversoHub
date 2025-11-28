import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

//Layout raíz de la aplicación
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    WubbaLubbaDubDub: require("../assets/fonts/WubbaLubbaDubDub.ttf"),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavoritesProvider>
          {/* Stack Navigator para navegación entre pantallas */}
          <Stack>
            {/* Ocultar header porque usamos tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="character/[id]"
              options={{
                headerTitle: "Detalle del Personaje",
                presentation: "card",
                headerTitleStyle: {
                  fontFamily: "WubbaLubbaDubDub",
                },
                headerBackTitleStyle: {
                  fontFamily: "WubbaLubbaDubDub",
                },
              }}
            />
          </Stack>
        </FavoritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
