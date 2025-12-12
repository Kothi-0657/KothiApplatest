// src/screens/ProfileBookings.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // ✅ FIXED ROUTE BASED ON server.ts FINAL PATH
        const res = await api.get(`/customer/booking/customer/${user.id}`);

        setBookings(res.data.bookings || []);
      } catch (err) {
        console.log("Error fetching customer bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user]);

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color="#FFD700" size="large" />;

  if (!bookings.length)
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No bookings found.</Text>
      </View>
    );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.service}>{item.service}</Text>

      <Text style={styles.date}>Date: {item.date}</Text>
      <Text style={styles.date}>Time: {item.time}</Text>

      <Text
        style={[
          styles.status,
          item.status === "accepted" ? styles.accepted : styles.pending,
        ]}
      >
        Status: {item.status}
      </Text>

      <Text style={styles.price}>Price: ₹{item.price}</Text>

      <Text style={styles.created}>
        Booked on: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  date: { color: "#9CA3AF", marginTop: 4 },
  status: { marginTop: 6, fontSize: 14, fontWeight: "600" },
  accepted: { color: "#06B6D4" },
  pending: { color: "#FBBF24" },
  price: { color: "#fff", marginTop: 6, fontSize: 14 },
  created: { color: "#9CA3AF", marginTop: 6, fontSize: 12 },
});
