import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

// Banner que se muestra cuando no hay conexión a internet
export const OfflineBanner: React.FC = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.banner, { backgroundColor: colors.warning }]}>      
      <Text style={styles.text}>
        Sin conexión a internet
      </Text>
      <Text style={styles.subtext}>
        Mostrando datos guardados
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    flexDirection: 'row',         
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,                      
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: '#000',               
    fontSize: 14,
    fontWeight: '600',     
  },
  subtext: {
    color: '#000',
    fontSize: 12,
  },
});