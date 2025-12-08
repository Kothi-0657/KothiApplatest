import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { fetchPublicServices } from "../api/publicServiceApi";
import { useCart } from "../context/CartContext";

const { width: winW } = Dimensions.get("window");

// Frontend categories
const categories = [
  { id: "Home Service", name: "Home Service", icon: "home-outline" },
  { id: "Home Renovations", name: "Home Renovations", icon: "construct-outline" },
  { id: "Constructions", name: "Constructions", icon: "business-outline" },
  { id: "Packers and Movers", name: "Packers and Movers", icon: "cube-outline" },
  { id: "Home Inspections", name: "Home Inspections", icon: "search-outline" },
];

const Collapsible: React.FC<{ collapsed?: boolean; children?: any }> = ({
  collapsed,
  children,
}) => {
  if (collapsed) return null;
  return <View>{children}</View>;
};

export default function ServiceScreen({ navigation }: any) {
  const { items: cart, addItem } = useCart();

  const [selectedTab, setSelectedTab] = useState("Home Service");
  const [groupedServices, setGroupedServices] = useState<any>({});
  const [activeSub, setActiveSub] = useState<number | null>(null);

  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevTabIndex = useRef(0);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchPublicServices();
        const services = response.data || [];

        const normalized = services.map((srv: any) => {
          const subcat =
            srv.sub_category && String(srv.sub_category).trim() !== ""
              ? srv.sub_category
              : "Others";
          return { ...srv, sub_category: subcat };
        });

        const categorized: Record<string, Record<string, any[]>> = {};

        normalized.forEach((srv: any) => {
          const cat = srv.category;
          const sub = srv.sub_category;

          if (!categorized[cat]) categorized[cat] = {};
          if (!categorized[cat][sub]) categorized[cat][sub] = [];

          categorized[cat][sub].push(srv);
        });

        setGroupedServices(categorized);
      } catch (e) {
        console.log("Failed to load services", e);
      }
    };

    loadServices();
  }, []);

  const displayedSubcategories = groupedServices[selectedTab] || {};

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
    setSearchText("");
    setSearchActive(false);
  };

  const renderServiceCard = (item: any) => {
    const qty = cart.find((c: any) => c.service?.id === item.id)?.qty || 0;

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
              style={[
                styles.bookButton,
                qty > 0 && { backgroundColor: "#C6A664" },
              ]}
              onPress={() =>
                addItem({
                  id: item.id,
                  name: item.name,
                  price: Number(item.price),
                  ...item,
                })
              }
            >
              <Text style={styles.bookButtonText}>
                Add to Cart {qty > 0 ? `(${qty})` : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    );
  };

  const filteredServices = Object.keys(groupedServices)
    .flatMap((cat) =>
      Object.keys(groupedServices[cat] || {}).flatMap((sub) =>
        groupedServices[cat][sub].filter((srv: any) => {
          const q = searchText.toLowerCase();
          if (!q) return false;
          return (
            srv.name.toLowerCase().includes(q) ||
            srv.sub_category.toLowerCase().includes(q)
          );
        })
      )
    );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>All Services</Text>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#666" />
        <TextInput
          value={searchText}
          onChangeText={(t) => {
            setSearchText(t);
            setSearchActive(t.length > 0);
          }}
          placeholder="Search..."
          style={{ flex: 1, paddingVertical: 6, paddingLeft: 6 }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              setSearchActive(false);
            }}
          >
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORY TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 10, marginTop: 10 }}
      >
        {categories.map((cat, index) => {
          const active = selectedTab === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleTabSwitch(cat.id, index)}
            >
              <BlurView
                intensity={80}
                tint="light"
                style={[
                  styles.tabBlur,
                  {
                    borderColor: active ? "#ff6f00ff" : "transparent",
                    backgroundColor: active
                      ? "rgba(198,166,100,0.25)"
                      : "rgba(255,255,255,0.15)",
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={active ? "#ff6f00" : "#555"}
                />
                <Text
                  style={{
                    color: active ? "#ff6f00" : "#444",
                    fontWeight: "600",
                  }}
                >
                  {cat.name}
                </Text>
              </BlurView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* CONTENT */}
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        {/* SEARCH MODE */}
        {searchActive ? (
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderServiceCard(item)}
            contentContainerStyle={{ paddingBottom: 180 }}
            ListEmptyComponent={
              <Text style={{ color: "#aaa", padding: 20 }}>
                No matching services found.
              </Text>
            }
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 180 }}
          >
            {Object.keys(displayedSubcategories).map((sub, index) => (
              <View key={sub}>
                <TouchableOpacity
                  onPress={() =>
                    setActiveSub(activeSub === index ? null : index)
                  }
                  style={styles.subHeader}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>{sub}</Text>
                  <Ionicons
                    name={
                      activeSub === index ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                  />
                </TouchableOpacity>

                <Collapsible collapsed={activeSub !== index}>
                  {displayedSubcategories[sub].map((srv: any) => (
                    <View key={srv.id}>{renderServiceCard(srv)}</View>
                  ))}
                </Collapsible>
              </View>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", paddingTop: 40 },
  pageTitle: {
    textAlign: "center",
    color: "#f0b174",
    fontSize: 22,
    fontWeight: "700",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    marginHorizontal: 18,
    marginTop: 12,
    padding: 8,
    borderRadius: 10,
  },

  tabBlur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },

  subHeader: {
    padding: 14,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#EEE",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 14,
    overflow: "hidden",
  },

  card: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(255,255,255,0.15)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 20px rgba(198,166,100,0.10)" }
      : {}),
  },

  cardTitle: { fontSize: 15, fontWeight: "600", color: "#000" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  cardPrice: { fontSize: 13, fontWeight: "500" },

  bookButton: {
    backgroundColor: "#070769",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  bookButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});
