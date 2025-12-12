import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";

export default function BookingDetailScreen({ route, navigation }: any) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    try {
      const res = await api.get(`/customer/bookings/single/${bookingId}`);
      setBooking(res.data.booking);
    } catch (err) {
      console.log("❌ Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Booking details not available.</Text>
      </View>
    );
  }

  // Safe nested data
  const service = booking.service || {};
  const vendor = booking.vendor || {};
  const customer = booking.customer || {};
  const address = booking.address || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Booking Details</Text>

      {/* Booking Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Booking Reference</Text>
        <Text style={styles.value}>{booking.booking_ref}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: "#0ad" }]}>{booking.status}</Text>

        <Text style={styles.label}>Service</Text>
        <Text style={styles.value}>{service.name || "N/A"}</Text>

        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>₹{booking.price}</Text>

        <Text style={styles.label}>Scheduled At</Text>
        <Text style={styles.value}>
          {new Date(booking.scheduled_at).toLocaleString()}
        </Text>

        <Text style={styles.label}>Booked At</Text>
        <Text style={styles.value}>
          {new Date(booking.booked_at).toLocaleString()}
        </Text>

        {booking.notes && (
          <>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{booking.notes}</Text>
          </>
        )}
      </View>

      {/* Address Info */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Address</Text>
        <Text style={styles.value}>{address.flat_no}</Text>
        <Text style={styles.value}>{address.street}</Text>
        <Text style={styles.value}>{address.landmark}</Text>
        <Text style={styles.value}>
          {address.city} - {address.pincode}
        </Text>
      </View>

      {/* Vendor Info */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Vendor Assigned</Text>

        {vendor?.name ? (
          <>
            <Text style={styles.value}>{vendor.name}</Text>
            <Text style={styles.value}>{vendor.phone}</Text>
            <Text style={styles.value}>{vendor.email}</Text>
          </>
        ) : (
          <Text style={styles.value}>No vendor assigned yet</Text>
        )}
      </View>

      {/* Payment Summary */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Payment Summary</Text>

        {booking.payments?.length > 0 ? (
          booking.payments.map((p: any, index: number) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={styles.value}>Status: {p.status}</Text>
              <Text style={styles.value}>Amount: ₹{p.amount}</Text>
              <Text style={styles.value}>
                Updated: {new Date(p.updated_at).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>No payments yet</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Back to Bookings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* --------------------------
   STYLE SHEET
--------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#1b1c1f",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: { color: "#999", marginTop: 10, fontSize: 13 },
  value: { color: "#fff", fontSize: 16, marginTop: 2 },

  subHeader: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  backBtn: {
    marginTop: 20,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: { color: "#fff", marginLeft: 8, fontSize: 16 },
});
