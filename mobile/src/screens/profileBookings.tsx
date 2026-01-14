import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileBookings() {
  const { user, token } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    // ⛔ DO NOT CALL API until auth is READY
    if (!user?.id || !token) {
      console.log("Auth not ready → skipping bookings fetch");
      return;
    }

    try {
      setError(null);

      const res = await api.get(
        `/api/customers/bookings/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bookings API response:", res.data);

      // ✅ Handle ALL backend shapes
      const list =
        Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

      setBookings(list);
    } catch (err: any) {
      console.error(
        "Bookings fetch error:",
        err?.response?.data || err.message || err
      );
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (user?.id && token) {
      fetchBookings();
    }
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  /* ---------------- STATES ---------------- */

  if (!user || !token) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.msg}>Loading user session…</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>{error}</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No bookings found yet</Text>
      </View>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          const service =
            item.service_name ||
            item.service?.name ||
            "Service";

          return (
            <View style={styles.card}>
              <Text style={styles.service}>{service}</Text>

              <Text style={styles.text}>
                Date: {item.date || "N/A"}
              </Text>

              <Text style={styles.text}>
                Time: {item.time || "N/A"}
              </Text>

              <Text
                style={[
                  styles.status,
                  item.status === "accepted"
                    ? styles.accepted
                    : styles.pending,
                ]}
              >
                Status: {item.status || "pending"}
              </Text>

              <Text style={styles.price}>
                ₹ {item.price ?? 0}
              </Text>

              <Text style={styles.created}>
                Booked on:{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "N/A"}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 16,
  },

  msg: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#0B1220",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  service: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  text: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 2,
  },

  status: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },

  accepted: { color: "#06B6D4" },
  pending: { color: "#FBBF24" },

  price: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },

  created: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 6,
  },
});
