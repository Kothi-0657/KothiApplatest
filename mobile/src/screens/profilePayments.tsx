// src/screens/ProfilePayments.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchUserPayments } from "../api/publicServiceApi";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfilePayments() {
  const { user } = useAuth(); // user contains { id, token, name, phone... }
  const navigation = useNavigation();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const list = await fetchUserPayments(user.token); // SEND JWT
        setPayments(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) loadPayments();
  }, [user]);

  // Loading
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06B6D4" />
      </View>
    );

  // No payments
  if (!payments.length)
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.msg}>No payments found.</Text>
      </View>
    );

  // List item
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.service}>{item.service_name || item.booking_ref}</Text>

      <Text style={styles.amount}>
        Amount: ₹{parseFloat(item.amount || 0).toFixed(2)}
      </Text>

      <Text style={styles.status}>Status: {item.status}</Text>

      {item.refund_amount > 0 && (
        <Text style={styles.refund}>Refunded: ₹{item.refund_amount.toFixed(2)}</Text>
      )}

      <Text style={styles.date}>
        Date: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backTxt}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
  },

  msg: { color: "#fff", fontSize: 16 },

  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  backTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#0B1220",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  service: { color: "#fff", fontWeight: "700", fontSize: 16 },
  amount: { color: "#06B6D4", marginTop: 4, fontSize: 15 },
  refund: { color: "#F87171", marginTop: 4, fontSize: 14 },
  status: { color: "#fff", marginTop: 4, fontSize: 14 },
  date: { color: "#9CA3AF", marginTop: 4, fontSize: 12 },
});
