// src/screens/CartScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }: any) {
  const { items, increaseQty, decreaseQty, removeItem, total, clearCart } =
    useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Please add services before continuing.");
      return;
    }
    navigation.navigate("Booking", { cartItems: items });
  };

  const renderFooter = () => (
    <BlurView intensity={60} tint="dark" style={styles.floatingFooter}>
      <Text style={styles.totalText}>Total: ₹{total.toFixed(2)}</Text>

      <View style={styles.footerBtns}>
        <TouchableOpacity style={styles.clearBtn} onPress={() => clearCart()}>
          <Text style={{ color: "#fff" }}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutTxt}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      <FlatList
        data={items}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(i) => i.service.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
        renderItem={({ item }) => (
          <BlurView intensity={40} tint="dark" style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.service.name}</Text>

              <Text style={styles.itemPrice}>
                ₹{item.service.price} × {item.qty} ={" "}
                <Text style={{ color: "#fff" }}>
                  ₹{item.qty * Number(item.service.price || 0)}
                </Text>
              </Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item.service.id)}
              >
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increaseQty(item.service.id)}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => removeItem(item.service.id)}
              style={styles.removeBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#ff5252" />
            </TouchableOpacity>
          </BlurView>
        )}
        ListFooterComponent={items.length > 0 ? renderFooter : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0e",
    padding: 14,
  },

  header: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },

  emptyText: {
    color: "#999",
    fontSize: 15,
    marginTop: 30,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  itemName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  itemPrice: {
    color: "#aaa",
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },

  qtyBtn: {
    backgroundColor: "#1c1c22",
    padding: 6,
    borderRadius: 8,
  },

  qtyText: {
    color: "#fff",
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "700",
  },

  removeBtn: {
    marginLeft: 4,
  },

  // Floating footer just below last item
  floatingFooter: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },

  totalText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  footerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  clearBtn: {
    backgroundColor: "#2c2c2c",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  checkoutBtn: {
    backgroundColor: "#0080ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  checkoutTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
