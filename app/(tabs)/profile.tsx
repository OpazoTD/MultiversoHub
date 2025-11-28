import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Colors } from "../../constants/Colors";
import { ThemeToggle } from "../../components/ThemeToggle";
import { HeartIconR, SunIcon, MoonIcon } from "@/components/IconLibrary";
import { clearAllData } from "../../services/storage";
import { logScreenView } from "../../services/telemetry";

type IconElement = React.ReactElement<
  any,
  string | React.JSXElementConstructor<any>
> | null;

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  colors: any; 
  favoritesCount: number;
}
// modal interno de confirmación de borrado
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  visible, 
  onClose, 
  onConfirm, 
  colors, 
  favoritesCount 
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Título */}
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            ¿Borrar Realidad?
          </Text>
          {/* Cuerpo del mensaje */}
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
            Vas a eliminar {favoritesCount} favoritos, el tema y la caché. 
            {"\n\n"}
            <Text style={{color: colors.error, fontWeight: 'bold'}}>
              ⚠️ Esta acción no se puede deshacer en este universo.
            </Text>
          </Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: "#4a5568" }]} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Botón Borrar (Estilo similar a "Muertos" - Rojo) */}
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: "#ef4444" }]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Borrar Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- PANTALLA PRINCIPAL ---
export default function ProfileScreen() {
  const { theme, setThemeMode } = useTheme();
  const colors = Colors[theme];
  const { favoritesCount, resetFavoritesState } = useFavorites();
  
  // Estado para controlar la visibilidad del modal
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  React.useEffect(() => {
    logScreenView("Profile");
  }, []);

  // 1. Función que abre el modal
  const handleClearDataPress = () => {
    setDeleteModalVisible(true);
  };

  // 2. Función que ejecuta el borrado real (se pasa al modal)
  const performClearData = async () => {
    try {
      await clearAllData();
      resetFavoritesState();
      if (setThemeMode) setThemeMode("light");
      
      // Cerramos el modal
      setDeleteModalVisible(false);
      
      // Opcional: Mostrar un pequeño feedback visual o cerrar modal
      // (Aquí podrías usar un Toast en lugar de Alert si quisieras evitar UI nativa al 100%)
      
    } catch (error) {
      console.error("❌ Error borrando datos:", error);
      setDeleteModalVisible(false);
    }
  };

  const handleAbout = () => {
    // Si quieres también puedes hacer un modal custom para esto, 
    // pero por ahora mantenemos el Alert sencillo
    /* Alert.alert(...) */
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de perfil */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <Text style={[styles.username, { color: colors.text }]}>Test User</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <StatItem
            label="Favoritos"
            value={favoritesCount}
            iconElement={<HeartIconR size={30} color={colors.primary} />}
            colors={colors}
          />

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <StatItem
            label="Tema"
            value={theme === "dark" ? "Oscuro" : "Claro"}
            iconElement={
              theme === "dark" ? (
                <MoonIcon size={30} color={colors.primary} />
              ) : (
                <SunIcon size={30} color={colors.primary} />
              )
            }
            colors={colors}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Apariencia
          </Text>
          <ThemeToggle />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datos de la App
          </Text>

          <Pressable
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={handleClearDataPress} // Cambiado para abrir modal
          >
            <Text style={[styles.buttonText, { color: colors.error }]}>
              Borrar todos los datos
            </Text>
            <Text style={[styles.buttonSubtext, { color: colors.textSecondary }]}>
              Elimina favoritos y configuraciones
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información
          </Text>

          <Pressable
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={handleAbout}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Acerca de
            </Text>
            <Text style={[styles.buttonSubtext, { color: colors.textSecondary }]}>
              Versión y créditos
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Renderizamos el Modal aquí, fuera del ScrollView pero dentro del fragmento */}
      <DeleteConfirmationModal 
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={performClearData}
        colors={colors}
        favoritesCount={favoritesCount}
      />
    </>
  );
}

const StatItem: React.FC<{
  label: string;
  value: string | number;
  iconElement: IconElement;
  colors: any;
}> = ({ label, value, iconElement, colors }) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>{iconElement}</View>
    <View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "700",
  },
  username: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 24,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: "100%",
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  buttonText: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSubtext: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontFamily: "WubbaLubbaDubDub",
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontFamily: "WubbaLubbaDubDub",
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  }
});