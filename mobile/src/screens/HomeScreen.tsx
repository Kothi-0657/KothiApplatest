// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useRef, type ComponentProps } from "react";
import { fetchPublicServices } from "../api/publicServiceApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";

const logo = require("../assets/logoa1.gif");
const { width: winW } = Dimensions.get("window");

// Frontend tabs — IDs are the frontend category keys used after mapping DB -> frontend
const categories = [
  { id: "Home Service", name: "Home Service", icon: "home-outline" },
  { id: "Home Renovations", name: "Home Renovations", icon: "construct-outline" },
  { id: "Constructions", name: "Constructions", icon: "business-outline" },
  { id: "Packers and Movers", name: "Packers and Movers", icon: "cube-outline" },
  { id: "Home Inspections", name: "Home Inspections", icon: "search-outline" },
];


// Local collapsible (simple accordion)
const Collapsible: React.FC<{ collapsed?: boolean; children?: React.ReactNode }> = ({ collapsed, children }) => {
  if (collapsed) return null;
  return <View>{children}</View>;
};

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { items: cart, addItem } = useCart();

  const [selectedTab, setSelectedTab] = useState("Home Service");
  const [groupedServices, setGroupedServices] = useState<any>({});
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [location, setLocation] = useState("Fetching...");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevTabIndex = useRef(0);

  // Map backend category -> frontend category id
  const categoryMap: Record<string, string> = {
    "Home Service": "Home Service",
    "Home Renovations": "Renovations",
    "Constructions": "Constructions",
    "Packers and Movers": "Movers",
    "Home Inspections": "Inspections",
  };

  // -------------------------------
  // Load Services and group by frontendCategory -> subcategory
  // -------------------------------
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchPublicServices();
        const services = response.data || [];

        // Normalize each service to include frontendCategory and normalized subcat
        const normalized = services.map((srv: any) => {
          const frontendCategory = srv.category;
          const sub_category = srv.sub_category && String(srv.sub_category).trim() !== "" ? srv.sub_category : "Others";
          return { ...srv, frontendCategory, sub_category };
        });

        // Group by frontendCategory -> sub_category
        const categorized: Record<string, Record<string, any[]>> = {};
        normalized.forEach((srv: any) => {
          const cat = srv.frontendCategory;
          const sub = srv.sub_category;
          if (!categorized[cat]) categorized[cat] = {};
          if (!categorized[cat][sub]) categorized[cat][sub] = [];
          categorized[cat][sub].push(srv);
        });

        setGroupedServices(categorized);
      } catch (e) {
        console.log("Service Fetch Error:", e);
      }
    };

    loadServices();
  }, []);

  // displayed subcategories for the currently selected tab (frontend id)
  const displayedSubcategories = groupedServices[selectedTab] || {};

  // -------------------------------
  // Location fetching
  // -------------------------------
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return setLocation("Unavailable");

        const loc = await Location.getCurrentPositionAsync({});
        let placeName = "My Location";

        try {
          const places = await Location.reverseGeocodeAsync(loc.coords);
          const [place] = places || [];
          placeName = place?.city || place?.region || place?.name || placeName;
        } catch {}

        setLocation(placeName);
      } catch {
        setLocation("Unavailable");
      }
    })();
  }, []);

  // -------------------------------
  // Tab animation
  // -------------------------------
  const handleTabSwitch = (tab: string, index: number) => {
    const direction = index > prevTabIndex.current ? 1 : -1;

    slideAnim.setValue(direction * winW);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();

    prevTabIndex.current = index;
    setSelectedTab(tab);
    setActiveSub(null);
    // clear search when switching tabs
    setSearchText("");
    setSearchActive(false);
  };

  // -------------------------------
  // Logout
  // -------------------------------
  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  // -------------------------------
  // Render Service Card (keeps your styles)
  // -------------------------------
  const renderServiceCard = (item: any) => {
    const cartQty = (cart || []).find((c: any) => c.service?.id === item.id)?.qty || 0;

    return (
      <BlurView intensity={60} tint="light" style={styles.cardWrapper}>
        <LinearGradient
          colors={["rgba(255,255,255,0.42)", "rgba(255,255,255,0.12)"]}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.cardPrice}>₹{item.price}</Text>
            <TouchableOpacity
              style={[styles.bookButton, cartQty > 0 && { backgroundColor: "#C6A664" }]}
              onPress={() =>
                // addItem expects the service object — keep same shape as your CartContext
                addItem({
                  id: item.id,
                  name: item.name,
                  price: Number(item.price || 0),
                  ...item,
                })
              }
            >
              <Text style={styles.bookButtonText}>
                Add to Cart {cartQty > 0 ? `(${cartQty})` : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    );
  };

  // -------------------------------
  // Search Filter — searches name and sub_category (case-insensitive)
  // -------------------------------
  const filteredServices = Object.keys(groupedServices)
    .flatMap(category =>
      Object.keys(groupedServices[category] || {}).flatMap(sub =>
        (groupedServices[category][sub] || []).filter((service: any) => {
          const q = searchText.trim().toLowerCase();
          if (!q) return false;
          return (
            String(service.name || "").toLowerCase().includes(q) ||
            String(service.sub_category || "").toLowerCase().includes(q)
          );
        })
      )
    );

  // count of items in cart for badge
  const cartCount = (cart || []).reduce((acc: number, cur: any) => acc + (cur.qty || 0), 0);

  const profileImage =
    user?.profile_picture && user.profile_picture.startsWith("http")
      ? { uri: user.profile_picture }
      : require("../assets/profilepicplaceholder.png");

  return (
    <ImageBackground
      source={require("../assets/back.png")}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(12, 11, 11, 0.9)", "rgba(40, 30, 30, 0.85)"]}
        style={styles.overlay}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.leftBlock}>
            <Text style={styles.welcomeText}>Welcome {user?.name || "Guest"}</Text>
            <Text style={styles.kothiText}>to Kothi India Private Limited</Text>
          </View>
    
          <View style={styles.rightBlock}>
            <TouchableOpacity onPress={() => navigation.navigate("My Profile")}>
              <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>

            {/* CART ICON WITH BADGE */}
            <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={{ marginRight: 8 }}>
              <View style={{ position: "relative" }}>
                <Ionicons name="cart-outline" size={28} color="#C6A664" />
                {cartCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -8,
                      top: -6,
                      backgroundColor: "#ff3b30",
                      borderRadius: 10,
                      minWidth: 18,
                      paddingHorizontal: 4,
                      height: 18,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={28} color="#C6A664" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOCATION */}
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="#333" />
          <Text style={styles.locationText}>{location}</Text>
        </TouchableOpacity>

        {/* HEADINGS */}
          <Text style={styles.heading}>Kothi India Home Solutions</Text>
        <Text style={styles.subheading}>Curated All Services under one roof</Text>

        {/* SEARCH BAR */}
        <View style={{ paddingHorizontal: 18, marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.95)",
              paddingHorizontal: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(247, 96, 9, 0.06)",
            }}
          >
            <Ionicons name="search-outline" size={18} color="#666" />
            <TextInput
              value={searchText}
              onChangeText={(t) => {
                setSearchText(t);
                setSearchActive(t.length > 0);
              }}
              placeholder="Search services, subcategory or category..."
              style={{ flex: 1, paddingVertical: 6, paddingLeft: 6 }}
              returnKeyType="search"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => { setSearchText(""); setSearchActive(false); }} style={{ padding: 6 }}>
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* SLIDE ANIMATION WRAPPER */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            marginTop: 19,
            flex: 1,
          }}
        >
          {/* CATEGORY TABS */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 10 }}>
              {categories.map((cat, index) => {
                const isActive = selectedTab === cat.id;
                return (
                  <TouchableOpacity key={cat.id} onPress={() => handleTabSwitch(cat.id, index)}>
                    <BlurView
                      intensity={80}
                      tint="light"
                      style={[
                        styles.tabBlur,
                        {
                          borderColor: isActive ? "#ff6f00ff" : "rgba(0,0,0,0.2)",
                          backgroundColor: isActive ? "rgba(198,166,100,0.25)" : "rgba(255,255,255,0.15)",
                        },
                      ]}
                    >
                      <Ionicons name={cat.icon} size={16} color={isActive ? "#050200ff" : "#f9f7f7ff"} />
                      <Text style={[styles.tabText, { color: isActive ? "#fa7102ff" : "#fcf8f8ff" }]}>{cat.name}</Text>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* SEARCH RESULTS mode */}
          {searchActive ? (
            <FlatList
              data={filteredServices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderServiceCard(item)}
              contentContainerStyle={{ paddingBottom: 140 }}
              ListEmptyComponent={<Text style={{ padding: 16, color: "#666" }}>No matching services found.</Text>}
            />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
              {/* SUBCATEGORIES - Accordion style */}
              {Object.keys(displayedSubcategories).length === 0 ? (
                <Text style={{ marginHorizontal: 20, color: "#666" }}>
                  No services available for this category.
                </Text>
              ) : (
                Object.keys(displayedSubcategories).map((sub, index) => (
                  <View key={sub}>
                    <TouchableOpacity
                      onPress={() => setActiveSub(activeSub === index ? null : index)}
                      style={styles.subCategoryHeader}
                    >
                      <Text style={{ fontWeight: "700", fontSize: 15 }}>{sub}</Text>
                      <Ionicons name={activeSub === index ? "chevron-up" : "chevron-down"} size={18} color="#333" />
                    </TouchableOpacity>

                    <Collapsible collapsed={activeSub !== index}>
                      {displayedSubcategories[sub].map((srv: any) => (
                        <View key={srv.id}>{renderServiceCard(srv)}</View>
                      ))}
                    </Collapsible>
                  </View>
                ))
              )}

              <View style={{ height: 200 }} />
            </ScrollView>
          )}
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

// -----------------------------------------------------
// STYLES — preserved & slightly adjusted where needed
// -----------------------------------------------------
const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1 },

  headerRow: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  leftBlock: {gap: 2 },
  welcomeText: { color: "#ed7733ff", fontSize: 12, fontWeight: "700", textAlign: "left",},
  kothiText: { color: "#e1a263ff", fontSize: 10, textAlign: "left", },

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
    color: "#ee8649ff",
    textAlign: "center",
    marginTop: 12,
  },
  subheading: {
    textAlign: "center",
    color: "#eebb95ff",
    marginBottom: 10,
  },

  tabContainer: { marginTop: 8 },

  tabBlur: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    gap: 6,
  },
  tabText: { fontSize: 13, fontWeight: "600" },

  subCategoryHeader: { padding: 12, marginHorizontal: 20, backgroundColor: "#EEE", borderRadius: 8, marginBottom: 6, marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  cardWrapper: { marginHorizontal: 20, marginBottom: 14, borderRadius: 14, overflow: "hidden" },

  card: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(255,255,255,0.15)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 20px rgba(198,166,100,0.10)" }
      : {}),
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  cardPrice: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  bookButton: {
    backgroundColor: "#070769",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    elevation: 6,
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
