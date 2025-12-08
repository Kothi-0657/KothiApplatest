// src/screens/ProfileBookings.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileBookings() {
  const { user } = useAuth();
  const navigation = useNavigation(); // ✅ FIX: must be used here (not inside onPress)
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/api/customer/${user.id}`);
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.log("Error fetching customer bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user]);

  // ⏳ Loading
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );

  // ❌ No Bookings
  if (!bookings.length)
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.msg}>No bookings found.</Text>
      </View>
    );

  // 📌 Single Booking Item
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.service}>{item.service?.name}</Text>

      {item.service?.sub_category && (
        <Text style={styles.date}>Subcategory: {item.service.sub_category}</Text>
      )}

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

      <Text style={styles.price}>Price: ₹{item.service?.price}</Text>

      <Text style={styles.created}>
        Booked on: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  // 📌 MAIN JSX
  return (
    <View style={{ flex: 1 }}>
      {/* BACK BUTTON */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backTxt}>← Back</Text>
      </TouchableOpacity>

      {/* BOOKINGS LIST */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
      />
    </View>
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

  service: { color: "#fff", fontWeight: "700", fontSize: 16 },
  date: { color: "#9CA3AF", marginTop: 4 },

  status: { marginTop: 6, fontSize: 14, fontWeight: "600" },
  accepted: { color: "#06B6D4" },
  pending: { color: "#FBBF24" },

  price: { color: "#fff", marginTop: 6, fontSize: 14 },
  created: { color: "#9CA3AF", marginTop: 6, fontSize: 12 },
});
