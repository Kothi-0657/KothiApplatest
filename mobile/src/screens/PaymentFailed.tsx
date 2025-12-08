// src/screens/PaymentFailed.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentFailed() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { reason } = route.params || {};

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Payment Failed</Text>

      <View style={styles.card}>
        <Text style={styles.reason}>{reason || "Payment was not completed."}</Text>
      </View>

      <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.goBack()}>
        <Text style={styles.btnPrimaryText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.btnSecondaryText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#071029", padding: 20, justifyContent: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#0B1220", padding: 18, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  reason: { color: "#fca5a5", fontSize: 15, textAlign: "center" },
  btnPrimary: { backgroundColor: "#FF9A3C", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  btnPrimaryText: { color: "#051223", fontWeight: "800", fontSize: 16 },
  btnSecondary: { borderWidth: 1, borderColor: "#fff", padding: 14, borderRadius: 12, alignItems: "center" },
  btnSecondaryText: { color: "#fff", fontWeight: "700" },
});
