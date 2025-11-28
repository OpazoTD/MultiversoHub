import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Character } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { HeartIconR, HeartIconW } from "./IconLibrary";

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const favorite = isFavorite(character.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(character.id);
    } else {
      addFavorite(character.id);
    }
  };
  
  const iconSize = 26;
  const iconColor = favorite ? "#ff4444" : "#fff";
  return (
    <TouchableOpacity
      style={styles.card}
onPress={() =>
  router.push({
    pathname: "../character/[id]",
    params: { id: String(character.id) },
  })
}    >
      <Image source={{ uri: character.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.status}>
          {character.status} - {character.species}
        </Text>
      </View>

<TouchableOpacity onPress={toggleFavorite} style={styles.favoriteBtn}>
        {/* Lógica para renderizar el SVG basado en el estado 'favorite' */}
        {favorite ? (
          <HeartIconR width={iconSize} height={iconSize} color={iconColor} />
        ) : (
          <HeartIconW width={iconSize} height={iconSize}  /> // Blanco para vacío
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#555555ff",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  name: {
    fontFamily: 'WubbaLubbaDubDub',
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  status: {
    fontSize: 14,
    fontFamily:"WubbaLubbaDubDub",
    color: "#ccc",
  },
  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  favoriteIcon: {
    fontSize: 26,
  },
});
