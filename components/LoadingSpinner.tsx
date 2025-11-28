import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

//Componente de carga que muestra un spinner animado

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ActivityIndicator es el componente nativo para spinners */}
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                      // Ocupa todo el espacio disponible
    justifyContent: 'center',     // Centra verticalmente
    alignItems: 'center',         // Centra horizontalmente
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});