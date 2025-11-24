// src/screens/ServiceDetailScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  ServiceDetail: { srv: any };
  MapPicker: { selectedService: any };
};

type ServiceDetailNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ServiceDetail"
>;

type ServiceDetailRoute = RouteProp<RootStackParamList, "ServiceDetail">;

export default function ServiceDetailScreen({
  route,
}: {
  route: ServiceDetailRoute;
}) {
  const navigation = useNavigation<ServiceDetailNavigation>();
  const { srv } = route.params || {};

  // If no data received — avoid crash
  if (!srv) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>Service not found.</Text>
      </View>
    );
  }

  // Safe fields with fallback values
  const serviceImage =
    srv.image ||
    srv.photo ||
    "https://via.placeholder.com/600x400.png?text=Service+Image";

  const serviceName = srv.name ?? "Unnamed Service";
  const serviceDesc =
    srv.description ?? "No description available for this service.";
  const servicePrice = srv.price ?? "499";
  const serviceRating = srv.rating ?? "4.8";
  const serviceReviews = srv.reviews ?? "120";

  const handleBookNow = () => {
    // Navigate to booking or map picker
    navigation.navigate("MapPicker", { selectedService: srv });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image source={{ uri: serviceImage }} style={styles.image} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent"]}
        style={styles.overlay}
      />

      {/* Content */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>{serviceName}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" color="#FFD700" size={18} />
          <Text style={styles.ratingText}>
            {serviceRating} ★ | {serviceReviews} reviews
          </Text>
        </View>

        <Text style={styles.desc}>{serviceDesc}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.priceValue}>₹{servicePrice}</Text>
        </View>

        {/* Book Now Button */}
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow}>
          <LinearGradient
            colors={["#d4af37", "#c6a664"]}
            style={styles.bookGradient}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.bookText}>Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ============================
   STYLE SHEET
=============================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  infoCard: {
    padding: 20,
  },
  title: {
    color: "#FFD700",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    color: "#ccc",
    marginLeft: 6,
    fontSize: 14,
  },
  desc: {
    color: "#eee",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceLabel: {
    color: "#999",
    fontSize: 15,
  },
  priceValue: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "700",
  },
  bookBtn: {
    borderRadius: 30,
    overflow: "hidden",
  },
  bookGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  bookText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
