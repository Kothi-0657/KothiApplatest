import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getMyPayments } from "../api/api"; // make sure this function exists
import { useAuth } from "../context/AuthContext";

export default function ProfilePayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPayments = async () => {
      try {
        const data = await getMyPayments(); // ✅ call the API function here
        setPayments(data);
      } catch (err) {
        console.log("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchUserPayments();
  }, [user]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#06B6D4" />;

  if (!payments.length)
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No payments found.</Text>
      </View>
    );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.service}>{item.service_name || item.booking_ref}</Text>
      <Text style={styles.amount}>Amount: ₹ {parseFloat(item.amount).toFixed(2)}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      {item.refund_amount > 0 && <Text style={styles.refund}>Refunded: ₹ {item.refund_amount.toFixed(2)}</Text>}
      <Text style={styles.date}>Date: {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1c" },
  msg: { color: "#fff", fontSize: 16 },
  card: {
    backgroundColor: "#0B1220",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  service: { color: "#fff", fontWeight: "700", fontSize: 16 },
  amount: { color: "#06B6D4", marginTop: 4 },
  refund: { color: "#F87171", marginTop: 4 },
  status: { color: "#fff", marginTop: 4 },
  date: { color: "#9CA3AF", marginTop: 4, fontSize: 13 },
});
