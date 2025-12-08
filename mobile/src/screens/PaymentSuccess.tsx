// src/screens/PaymentSuccess.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function PaymentSuccess() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { amount, payment_id, order_id, service, note } = route.params || {};

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Payment Successful</Text>

      <View style={styles.card}>
        <Text style={styles.h1}>₹ {Number(amount || 0).toFixed(2)}</Text>
        <Text style={styles.service}>{service?.name || "Service"}</Text>

        <Text style={styles.meta}>Payment ID: {payment_id}</Text>
        <Text style={styles.meta}>Order ID: {order_id}</Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#071029", padding: 20, justifyContent: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#0B1220", padding: 18, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  h1: { color: "#FF9A3C", fontSize: 28, fontWeight: "900" },
  service: { color: "#fff", marginTop: 6, fontSize: 16, fontWeight: "700" },
  meta: { color: "#cbd5e1", marginTop: 6, fontSize: 13 },
  note: { color: "#FFD9B6", marginTop: 8, fontSize: 13 },
  btn: { backgroundColor: "#FF9A3C", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#051223", fontWeight: "800", fontSize: 16 },
});
