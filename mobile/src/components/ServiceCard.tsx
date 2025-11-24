// src/components/ServiceCard.tsx
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ServiceCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <MaterialCommunityIcons name={item.icon || "cog-outline"} size={36} color="#d4af37" />
      <Text style={styles.title}>{item.name}</Text>
      {item.price ? <Text style={styles.price}>₹{item.price}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  title: { color: "#fff", marginTop: 8, fontWeight: "600" },
  price: { color: "#d4af37", marginTop: 6, fontWeight: "700" },
});
