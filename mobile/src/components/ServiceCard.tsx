import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../context/CartContext";

type Props = {
  service: any;
  onPress?: () => void;
};

export default function ServiceCard({ service, onPress }: Props) {
  const { addItem, items } = useCart();

  const isAdded = items.some((i) => i.service.id === service.id);

  const handleAdd = () => {
    if (!isAdded) {
      addItem({
        id: service.id,
        name: service.name,
        price: Number(service.price || 0),
        ...service,
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
      <LinearGradient
        colors={["#0f172a", "#020617"]}
        style={styles.card}
      >
        {/* TITLE */}
        <Text numberOfLines={2} style={styles.title}>
          {service.name}
        </Text>

        {/* OPTIONAL SUBTEXT */}
        <Text numberOfLines={1} style={styles.subText}>
          Professional service with expert execution
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.price}>₹ {service.price}</Text>

          <TouchableOpacity
            style={[
              styles.cartBtn,
              isAdded && styles.cartBtnAdded,
            ]}
            onPress={handleAdd}
            disabled={isAdded}
          >
            <Text style={styles.cartBtnText}>
              {isAdded ? "Added ✓" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }
      : {}),
    elevation: 6,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  subText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },

  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
  },

  cartBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#f97316",
  },

  cartBtnAdded: {
    backgroundColor: "#16a34a",
  },

  cartBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
