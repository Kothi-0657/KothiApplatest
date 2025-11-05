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

type ServiceDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ServiceDetail"
>;

type ServiceDetailScreenRouteProp = RouteProp<RootStackParamList, "ServiceDetail">;

export default function ServiceDetailScreen({ route }: { route: ServiceDetailScreenRouteProp }) {
  const navigation = useNavigation<ServiceDetailScreenNavigationProp>();
  const { srv } = route.params || {};

  if (!srv) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>No service data available.</Text>
      </View>
    );
  }

  const handleBookNow = () => {
    // Navigate to booking or map picker
    navigation.navigate("MapPicker", { selectedService: srv });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Service Image */}
      <Image
        source={{ uri: srv.image || "https://via.placeholder.com/400" }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent"]}
        style={styles.overlay}
      />

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>{srv.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" color="#FFD700" size={18} />
          <Text style={styles.ratingText}>
            {srv.rating || "4.8"} ★ | {srv.reviews || "120"} reviews
          </Text>
        </View>

        <Text style={styles.desc}>
          {srv.description ||
            "Experience top-quality service with our skilled professionals. We ensure satisfaction, safety, and excellence every time."}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.priceValue}>₹{srv.price || "499"}</Text>
        </View>

        {/* Book Button */}
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
