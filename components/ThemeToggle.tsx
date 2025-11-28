import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';


//Componente toggle para cambiar entre modo claro y oscuro
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.labelContainer}>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>
            Modo {isDark ? 'Oscuro' : 'Claro'}
          </Text>
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            Cambia la apariencia de la app
          </Text>
        </View>
      </View>
      <Switch
        value={isDark}                    // Estado actual (true = oscuro)
        onValueChange={toggleTheme}       
        trackColor={{                     
          false: colors.textSecondary,    // Modo claro 
          true: colors.primary,           // Modo oscuro
        }}
        thumbColor={isDark ? colors.secondary : '#f4f3f4'} 
        ios_backgroundColor={colors.textSecondary} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  sublabel: {
    fontSize: 12,
    marginTop: 2,
  },
});