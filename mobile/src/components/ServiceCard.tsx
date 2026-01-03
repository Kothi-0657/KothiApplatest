// src/components/ServiceCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../context/CartContext";

type Props = {
  service: any;
  showBook?: boolean; // if true show Book now (backwards compat)
  onPress?: () => void; // optional for custom press
};

export default function ServiceCard({ service, showBook = false, onPress }: Props) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: service.id,
      name: service.name,
      price: Number(service.price || 0),
      ...service,
    });
  };

  return (
    <BlurView intensity={60} tint="light" style={styles.cardWrapper}>
      <LinearGradient
        colors={["rgba(255,255,255,0.42)", "rgba(255,255,255,0.12)"]}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>{service.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.cardPrice}>₹{service.price}</Text>

          {showBook ? (
            <TouchableOpacity style={styles.bookButton} onPress={onPress}>
              <Text style={styles.bookButtonText}>Book Now →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.bookButton} onPress={handleAddToCart}>
              <Text style={styles.bookButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 69,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },

  card: {
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(255,255,255,0.15)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 20px rgba(198,166,100,0.10)" }
      : {}),
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  cardPrice: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
  },

  bookButton: {
    backgroundColor: "#070769ff",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 18,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 6px 14px rgba(198,166,100,0.28)" }
      : {}),
    elevation: 6,
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
