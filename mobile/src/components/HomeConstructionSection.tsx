// HomeConstructionSection.tsx
import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeConstructionSection({ constructions = [], onPressConstruction }) {
  if (!constructions.length) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <Image
        source={require("../assets/logoa2.png")}
        style={{ width: 32, height: 32, marginLeft: 8, marginBottom: 10 }}
        resizeMode="contain"
      />

      <Text style={styles.title}>Need help in Home Constructions and Renovations</Text>

      <FlatList
        data={constructions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ pointerEvents: "auto" }}   // ✅ FIXED
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onPressConstruction?.(item)}
          >
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.img}
            />
            <Text style={styles.name}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 5,
  },

  card: {
    width: 230,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    boxShadow: "0px 3px 5px rgba(0,0,0,0.25)", // new shadow API
  },

  img: {
    width: "100%",
    height: 210,
    borderRadius: 10,
  },

  name: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
  },
});
