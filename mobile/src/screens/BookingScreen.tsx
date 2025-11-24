import React, { useState, useMemo, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation, useRoute } from "@react-navigation/native";

/**
 * BookingScreen (Layout B) — multiple address fields, GST calc + total,
 * T&C link opens TermsAndConditions screen, passes calculatedTotal to PaymentScreen.
 * Now also fetches existing bookings for the logged-in user.
 */

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const service = route.params?.service || { id: "", name: "Unknown", price: "0" };

  const { user } = useAuth();
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const priceNum = useMemo(() => {
    const p = Number(service.price);
    return isNaN(p) ? 0 : p;
  }, [service.price]);

  const gst = useMemo(() => +(priceNum * 0.18).toFixed(2), [priceNum]);
  const calculatedTotal = useMemo(() => +(priceNum + gst).toFixed(2), [priceNum, gst]);

  // Fetch user bookings
  useEffect(() => {
    if (user?.id) fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get(`/bookings/customer/${user.id}`);
      setMyBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      Alert.alert("Error", "Could not load your bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const validateAddress = () => {
    return house.trim() && street.trim() && city.trim() && stateField.trim() && pincode.trim();
  };

  const onConfirmAndPay = () => {
    if (!validateAddress()) {
      Alert.alert("Address Required", "Please fill all address fields.");
      return;
    }
    if (!agree) {
      Alert.alert("Terms Required", "Please accept Terms & Conditions.");
      return;
    }

    const fullAddress = `${house.trim()}, ${street.trim()}, ${city.trim()}, ${stateField.trim()} - ${pincode.trim()}`;

    navigation.navigate("PaymentScreen", {
      service,
      address: fullAddress,
      notes,
      gst,
      calculatedTotal,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={bookingStyles.container}>
        {/* Existing Booking Summary */}
        <Text style={bookingStyles.heading}>Booking Summary</Text>

        <View style={bookingStyles.card}>
          <Text style={bookingStyles.cardTitle}>Service Selected</Text>
          <Text style={bookingStyles.serviceName}>{service.name}</Text>

          <View style={bookingStyles.row}>
            <Text style={bookingStyles.label}>Base Price</Text>
            <Text style={bookingStyles.value}>₹ {priceNum.toFixed(2)}</Text>
          </View>

          <View style={bookingStyles.divider} />

          <View style={bookingStyles.row}>
            <Text style={bookingStyles.label}>GST (18%)</Text>
            <Text style={bookingStyles.value}>₹ {gst.toFixed(2)}</Text>
          </View>

          <View style={bookingStyles.divider} />

          <View style={bookingStyles.row}>
            <Text style={bookingStyles.totalLabel}>Total Payable</Text>
            <Text style={bookingStyles.totalValue}>₹ {calculatedTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Address Inputs */}
        <Text style={bookingStyles.sectionLabel}>Address — Property Details</Text>
        <TextInput
          style={bookingStyles.input}
          placeholder="House / Flat No."
          placeholderTextColor="#9CA3AF"
          value={house}
          onChangeText={setHouse}
        />
        <TextInput
          style={bookingStyles.input}
          placeholder="Street / Area"
          placeholderTextColor="#9CA3AF"
          value={street}
          onChangeText={setStreet}
        />
        <View style={bookingStyles.rowTwo}>
          <TextInput
            style={[bookingStyles.input, { flex: 1, marginRight: 8 }]}
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[bookingStyles.input, { width: 110 }]}
            placeholder="Pincode"
            placeholderTextColor="#9CA3AF"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
          />
        </View>
        <TextInput
          style={bookingStyles.input}
          placeholder="State"
          placeholderTextColor="#9CA3AF"
          value={stateField}
          onChangeText={setStateField}
        />

        {/* Notes */}
        <Text style={bookingStyles.sectionLabel}>Notes (Optional)</Text>
        <TextInput
          style={[bookingStyles.input, { height: 100 }]}
          placeholder="Landmark, instructions..."
          placeholderTextColor="#9CA3AF"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* T&C */}
        <View style={bookingStyles.tcRow}>
          <Checkbox value={agree} onValueChange={setAgree} color={agree ? "#06B6D4" : undefined} />
          <TouchableOpacity onPress={() => navigation.navigate("TermsAndConditions")}>
            <Text style={bookingStyles.tcText}>
              I agree to the <Text style={bookingStyles.tcLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Confirm */}
        <TouchableOpacity style={bookingStyles.confirmBtn} onPress={onConfirmAndPay}>
          <Text style={bookingStyles.confirmBtnText}>Confirm & Pay</Text>
        </TouchableOpacity>

        {/* ---------------- My Bookings Section ---------------- */}
        <Text style={[bookingStyles.heading, { marginTop: 30 }]}>My Bookings</Text>
        {loadingBookings ? (
          <ActivityIndicator color="#06B6D4" />
        ) : myBookings.length === 0 ? (
          <Text style={{ color: "#fff", fontSize: 14, marginTop: 8 }}>No bookings found.</Text>
        ) : (
          myBookings.map((b) => (
            <View key={b.id} style={bookingStyles.bookingCard}>
              <Text style={bookingStyles.bookingService}>{b.service_name}</Text>
              <Text style={bookingStyles.bookingText}>Booking Ref: {b.booking_ref}</Text>
              <Text style={bookingStyles.bookingText}>Status: {b.status}</Text>
              <Text style={bookingStyles.bookingText}>Price: ₹{b.price}</Text>
            </View>
          ))
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ------------------- Styles -------------------
const bookingStyles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#071029" },
  heading: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 12 },

  card: {
    backgroundColor: "#0B1220",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  cardTitle: { color: "#9CA3AF", fontSize: 13, marginBottom: 6, fontWeight: "600" },
  serviceName: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  label: { color: "#cbd5e1", fontSize: 15 },
  value: { color: "#fff", fontSize: 15 },

  divider: { height: 1, backgroundColor: "#1f2937", marginVertical: 8 },

  totalLabel: { color: "#cbd5e1", fontSize: 16, fontWeight: "700" },
  totalValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

  sectionLabel: { color: "#9CA3AF", fontSize: 13, marginTop: 8, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#061426",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  rowTwo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  tcRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  tcText: { color: "#cbd5e1", marginLeft: 8 },
  tcLink: { color: "#06B6D4", textDecorationLine: "underline", fontWeight: "700" },

  confirmBtn: {
    backgroundColor: "#06B6D4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },
  confirmBtnText: { color: "#041222", fontWeight: "800", fontSize: 16 },

  bookingCard: {
    backgroundColor: "#071829",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  bookingService: { color: "#fff", fontWeight: "800", marginBottom: 6 },
  bookingText: { color: "#cbd5e1", fontSize: 13 },
});
