// src/screens/BookingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function BookingScreen({ route, navigation }: any) {
  const { cartItems = [], totalAmount = 0 } = route.params || {};

  const [address, setAddress] = useState({
    flat_no: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [notes, setNotes] = useState("");

  if (!cartItems.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No items in booking</Text>
      </View>
    );
  }

  const validateAddress = () => {
    const { flat_no, street, city, state, pincode } = address;
    return flat_no && street && city && state && pincode;
  };

  const handleConfirmBooking = () => {
    if (!validateAddress()) {
      Alert.alert("Address Required", "Please fill all address fields");
      return;
    }

    // ✅ Navigate to PaymentScreen with full order details
    navigation.navigate("PaymentScreen", {
      cartItems,
      totalAmount,
      address,
      notes,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Booking Summary</Text>

      {/* SERVICES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service</Text>

        {cartItems.map((item: any, index: number) => (
          <View key={index} style={styles.row}>
            <Text style={styles.value}>
              {item.service.name} × {item.qty}
            </Text>
            <Text style={styles.value}>
              ₹{item.qty * Number(item.service.price)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />
        <Text style={styles.total}>Total: ₹{totalAmount}</Text>
      </View>

      {/* ADDRESS */}
      <Text style={styles.sectionTitle}>Property Address</Text>

      <TextInput
        placeholder="House / Flat No."
        placeholderTextColor="#777"
        style={styles.input}
        value={address.flat_no}
        onChangeText={(v) => setAddress({ ...address, flat_no: v })}
      />

      <TextInput
        placeholder="Street / Area"
        placeholderTextColor="#777"
        style={styles.input}
        value={address.street}
        onChangeText={(v) => setAddress({ ...address, street: v })}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          placeholder="City"
          placeholderTextColor="#777"
          style={[styles.input, { flex: 1 }]}
          value={address.city}
          onChangeText={(v) => setAddress({ ...address, city: v })}
        />

        <TextInput
          placeholder="Pincode"
          placeholderTextColor="#777"
          style={[styles.input, { flex: 1 }]}
          keyboardType="numeric"
          value={address.pincode}
          onChangeText={(v) => setAddress({ ...address, pincode: v })}
        />
      </View>

      <TextInput
        placeholder="State"
        placeholderTextColor="#777"
        style={styles.input}
        value={address.state}
        onChangeText={(v) => setAddress({ ...address, state: v })}
      />

      {/* NOTES */}
      <Text style={styles.sectionTitle}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.submitTxt}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f1724",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f1724",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#d1d5db",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  value: {
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 8,
  },
  total: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "right",
  },
  input: {
    backgroundColor: "#0b1220",
    color: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  submitTxt: {
    color: "#fff",
    fontWeight: "600",
  },
});
