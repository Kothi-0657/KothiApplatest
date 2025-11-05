import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔹 ADDED

const { width: winW } = Dimensions.get("window");

// CATEGORY LIST
const categories = [
  { id: "home", name: "Home Services", icon: "home-outline" },
  { id: "construction", name: "Constructions", icon: "business-outline" },
  { id: "renovation", name: "Renovations", icon: "construct-outline" },
  { id: "movers", name: "Movers", icon: "cube-outline" },
  { id: "inspection", name: "Inspections", icon: "search-outline" },
];

// SERVICES DATA
const allServices = {
  home: [
    { id: 1, name: "Electrical", icon: "flash-outline" },
    { id: 2, name: "Plumbing", icon: "water-outline" },
    { id: 3, name: "Painting", icon: "format-paint" },
    { id: 4, name: "Cleaning", icon: "broom" },
    { id: 5, name: "Pest Control", icon: "bug-outline" },
  ],
  construction: [
    { id: 6, name: "Full House Build", icon: "home-modern" },
    { id: 7, name: "Civil Work", icon: "tools" },
    { id: 8, name: "False Ceiling", icon: "ceiling-light" },
  ],
  renovation: [
    { id: 9, name: "Home Interiors", icon: "sofa" },
    { id: 10, name: "Flooring", icon: "floor-lamp-outline" },
    { id: 11, name: "Kitchen Upgrade", icon: "silverware-fork-knife" },
  ],
  movers: [
    { id: 12, name: "Packers & Movers", icon: "truck-outline" },
    { id: 13, name: "Local Shift", icon: "truck-delivery-outline" },
  ],
  inspection: [
    { id: 14, name: "Home Inspection", icon: "magnify" },
    { id: 15, name: "Pre-Sale Check", icon: "clipboard-check-outline" },
  ],
};

export default function HomeScreen({ navigation }: any) {
  const [selectedTab, setSelectedTab] = useState("home");
  const [location, setLocation] = useState<string>("Fetching...");
  const displayedServices = allServices[selectedTab] || [];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Location unavailable");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(loc.coords);
      if (place) {
        setLocation(place.city || place.region || "My Location");
      }
    })();
  }, []);

  // 🔹 ADDED: Logout handler
  const handleLogout = async () => {
  try {
    await AsyncStorage.multiRemove(["user", "token"]);
    Alert.alert("Logout", "You have been logged out successfully.");

    // ✅ Reset to Login at the root level
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    console.error("Logout error:", error);
    Alert.alert("Error", "Failed to log out. Please try again.");
  }
};


  const openMapPicker = () => {
    navigation.navigate("MapPicker");
  };

  return (
    <ImageBackground
      source={require("../assets/back.png")}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.9)", "rgba(240,240,240,0.85)"]}
        style={styles.overlay}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={require("../assets/logoa1.gif")} style={styles.logo} />
            <Text style={styles.brand}>Kothi India</Text>
          </View>

          {/* 🔹 Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#C6A664" />
          </TouchableOpacity>
        </View>

        {/* LOCATION */}
        <TouchableOpacity style={styles.locationContainer} onPress={openMapPicker}>
          <Ionicons name="location-outline" size={20} color="#C6A664" />
          <Text numberOfLines={1} style={styles.locationText}>
            {location}
          </Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Kothi India Home Solutions</Text>
        <Text style={styles.subheading}>Curated All Services under one roof</Text>

        {/* TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {categories.map((cat) => {
            const active = cat.id === selectedTab;
            return (
              <TouchableOpacity key={cat.id} onPress={() => setSelectedTab(cat.id)}>
                <BlurView
                  intensity={90}
                  tint="light"
                  style={[
                    styles.tabBlur,
                    {
                      backgroundColor: active
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.5)",
                      borderColor: active ? "#C6A664" : "rgba(255,255,255,0.3)",
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={active ? "#000" : "#C6A664"}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.tabText, { color: active ? "#000" : "#333" }]}>
                    {cat.name}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SERVICES */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.serviceGrid}>
            {displayedServices.map((srv) => (
              <TouchableOpacity
                key={srv.id}
                onPress={() => navigation.navigate("ServiceDetail", { srv })}
              >
                <BlurView intensity={80} tint="light" style={styles.cardWrapper}>
                  <LinearGradient
                    colors={[
                      "rgba(255,255,255,0.5)",
                      "rgba(255,255,255,0.3)",
                    ]}
                    style={styles.serviceCard}
                  >
                    <MaterialCommunityIcons
                      name={srv.icon as any}
                      size={42}
                      color="#C6A664"
                      style={{ marginBottom: 10 }}
                    />
                    <Text style={styles.serviceText}>{srv.name}</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, borderRadius: 8, marginRight: 8 },
  brand: { color: "#C6A664", fontWeight: "700", fontSize: 18 },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#C6A664",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },
  locationText: { color: "#444", fontSize: 12, marginLeft: 4, maxWidth: 120 },
  heading: {
    fontSize: 22,
    color: "#1e1e1e",
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  subheading: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 20 },
  tabContainer: { flexGrow: 0, marginBottom: 15 },
  tabBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 10,
  },
  tabText: { fontWeight: "600", fontSize: 13 },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceCard: {
    width: winW * 0.43,
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: { color: "#333", fontWeight: "600", fontSize: 15 },
});
