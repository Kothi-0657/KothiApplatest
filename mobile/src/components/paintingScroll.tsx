import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { paintingServiceIds } from "../constants/paintingServiceIds";
import { paintingImages } from "../constants/paintingImages";
import { fetchPublicServiceById } from "../api/publicServiceApi";
import { useCart, ServiceItem } from "../context/CartContext";

export default function PaintingScroll({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { items, addItem } = useCart(); // ✅ Access Cart context

  useEffect(() => {
    loadPaintingServices();
  }, []);

  const loadPaintingServices = async () => {
    try {
      const results: any[] = [];

      for (const id of paintingServiceIds) {
        const res = await fetchPublicServiceById(id);
        if (res?.data) results.push(res.data);
      }

      setServices(results);
    } catch (err) {
      console.log("Error fetching painting services:", err);
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (id: string) => items.some((i) => i.service.id === id);

  const handleAddToCart = (service: ServiceItem) => {
    if (!isInCart(service.id)) addItem(service);
  };

  return (
    <View style={{ paddingVertical: 4 }}>
      {/* HEADING */}
      <View style={styles.headingRow}>
        <Image
          source={require("../assets/logoa3.png")}
          style={styles.headingIcon}
          resizeMode="contain"
        />

        <Text style={styles.headingText}>Painting Service</Text>

        <Image
          source={require("../assets/painting/p4.png")}
          style={styles.headingIcon}
          resizeMode="contain"
        />
      </View>

      {/* SCROLL SECTION */}
      {loading ? (
        <Text style={styles.loadingText}>Loading painting services...</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ pointerEvents: "auto" }}
        >
          {services.map((item) => {
            const added = isInCart(item.id);

            return (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ServiceDetail", { serviceId: item.id })
                  }
                  style={{ flex: 1 }}
                >
                  <Image
                    source={paintingImages[item.id] || paintingImages["P1"]}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  <Text numberOfLines={2} style={styles.name}>
                    {item.name}
                  </Text>

                  <Text style={styles.price}>₹ {item.price}</Text>
                </TouchableOpacity>

                {/* Add to Cart Button */}
                <TouchableOpacity
                  style={[
                    styles.cartButton,
                    added && styles.cartButtonAdded,
                  ]}
                  onPress={() => handleAddToCart(item)}
                  disabled={added}
                >
                  <Text
                    style={[
                      styles.cartButtonText,
                      added && styles.cartButtonTextAdded,
                    ]}
                  >
                    {added ? "Added ✓" : "Add to Cart"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  headingText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fbf8f8ff",
  },

  headingIcon: {
    width: 90,
    height: 80,
    marginLeft: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  loadingText: {
    fontSize: 14,
    color: "#444",
    paddingHorizontal: 10,
    marginVertical: 8,
  },

  card: {
    width: 190,
    marginRight: 12,
    backgroundColor: "#110725ff",
    borderRadius: 10,
    padding: 10,
    paddingBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    justifyContent: "space-between",
  },

  image: {
    width: "100%",
    height: 130,
    borderRadius: 8,
    marginBottom: 6,
  },

  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d4d0d0ff",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0a7",
    marginTop: 2,
  },

  cartButton: {
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3680bff",
    alignItems: "center",
    backgroundColor: "#110725ff",
  },

  cartButtonAdded: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },

  cartButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f3680bff",
  },

  cartButtonTextAdded: {
    color: "#fff",
  },
});
