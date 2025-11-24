// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import { fetchPublicServices } from "../api/publicServiceApi";
import { useAuth } from "../context/AuthContext";
const logo = require("../assets/logoa1.gif");
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";

const { width: winW } = Dimensions.get("window");

const categories = [
  { id: "Home Services", name: "Home Services", icon: "home-outline" },
  { id: "Constructions", name: "Constructions", icon: "business-outline" },
  { id: "Renovations", name: "Renovations", icon: "construct-outline" },
  { id: "Movers", name: "Movers", icon: "cube-outline" },
  { id: "Inspections", name: "Inspections", icon: "search-outline" },
];

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const [selectedTab, setSelectedTab] = useState("Home Services");
  const [location, setLocation] = useState("Fetching...");
  const [allServices, setAllServices] = useState<{ [key: string]: any[] }>({});

  const categoryMap: Record<string, string> = {
    "Home Service": "Home Services",
    "Home Renovations": "Renovations",
    "Constructions": "Constructions",
    "Packers and Movers": "Movers",
    "Home Inspections": "Inspections",
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchPublicServices();
        const services = response.data || [];

        const categorized: any = {};

        services.forEach((srv: any) => {
          const mapped = categoryMap[srv.category];
          if (!mapped) return;
          if (!categorized[mapped]) categorized[mapped] = [];
          categorized[mapped].push(srv);
        });

        setAllServices(categorized);
      } catch (e) {
        console.log("Service Fetch Error:", e);
      }
    };

    loadServices();
  }, []);

  const displayedServices = allServices[selectedTab] || [];

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Unavailable");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        // reverseGeocodeAsync may be removed in some SDKs — keep safe guarded usage
        let placeName = "My Location";
        try {
          const places = await Location.reverseGeocodeAsync(loc.coords);
          const [place] = places || [];
          placeName = place?.city || place?.region || place?.name || placeName;
        } catch (err) {
          // If runtime warns or API removed, ignore and show generic string
          // (Recommended: replace with Places Autocomplete for production)
          console.warn("reverseGeocodeAsync failed:", err);
        }

        setLocation(placeName);
      } catch (err) {
        console.warn("Location error:", err);
        setLocation("Unavailable");
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const profileImage =
    user?.profile_picture && user.profile_picture.startsWith("http")
      ? { uri: user.profile_picture }
      : require("../assets/profilepicplaceholder.png");

  const openMapPicker = () => navigation.navigate("MapPicker");

  const renderServiceCard = ({ item }: any) => (
    <BlurView intensity={60} tint="light" style={styles.cardWrapper}>
      <LinearGradient
        colors={["rgba(255,255,255,0.42)", "rgba(255,255,255,0.12)"]}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.cardPrice}>₹{item.price}</Text>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate("Booking", { service: item })}
          >
            <Text style={styles.bookButtonText}>Book Now →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );

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
        <View style={styles.headerRow}>
          <View style={styles.leftBlock}>
            <Text style={styles.welcomeText}>
              Welcome {user?.name || "Guest"}
            </Text>
            <Text style={styles.kothiText}>to Kothi India</Text>
          </View>

          <Image source={logo} style={styles.headerLogo} resizeMode="contain" />

          <View style={styles.rightBlock}>
            <TouchableOpacity onPress={() => navigation.navigate("My Profile")}>
              <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={28} color="#C6A664" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOCATION */}
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={openMapPicker}
        >
          <Ionicons name="location-outline" size={20} color="#C6A664" />
          <Text numberOfLines={1} style={styles.locationText}>
            {location}
          </Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Kothi India Home Solutions</Text>
        <Text style={styles.subheading}>
          Curated All Services under one roof
        </Text>

        {/* CATEGORY TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {categories.map((cat) => {
            const active = cat.id === selectedTab;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedTab(cat.id)}
              >
                <BlurView
                  intensity={90}
                  tint="light"
                  style={[
                    styles.tabBlur,
                    {
                      backgroundColor: active
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.5)",
                      borderColor: active
                        ? "#C6A664"
                        : "rgba(255,255,255,0.3)",
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={active ? "#000" : "#C6A664"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      { color: active ? "#000" : "#333" },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SERVICES LIST */}
        <FlatList
          data={displayedServices}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1 },

  headerRow: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  leftBlock: {},
  welcomeText: { color: "#333", fontSize: 18, fontWeight: "700" },
  kothiText: { color: "#666", fontSize: 14 },

  headerLogo: { width: 80, height: 80 },

  rightBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#C6A664",
  },

  locationContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
  },
  locationText: { marginLeft: 6, color: "#333", maxWidth: winW * 0.6 },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  subheading: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },

  tabContainer: {
    marginTop: 15,
    paddingLeft: 10,
  },

  tabBlur: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* Glass card wrapper */
  cardWrapper: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
  },

  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.18)",
    // web-friendly boxShadow (avoid deprecated "shadow*" warnings)
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 24px rgba(198,166,100,0.12)" }
      : {}),
    // native elevation for Android; keeps depth on mobile
    elevation: 6,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  bookButton: {
    backgroundColor: "#C6A664",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    // boxShadow instead of shadow* for web
    ...(Platform.OS === "web" ? { boxShadow: "0 6px 14px rgba(198,166,100,0.28)" } : {}),
    elevation: 4,
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
