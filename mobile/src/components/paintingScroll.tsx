// PaintingScroll.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { paintingServiceIds } from "../constants/paintingServiceIds";
import { paintingImages } from "../constants/paintingImages";
import { fetchPublicServiceById } from "../api/publicServiceApi";

export default function PaintingScroll({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={{ paddingVertical: 10 }}>
      
      {/* HEADING */}
      <View style={styles.headingRow}>
        <Image
          source={require("../assets/logoa3.png")}
          style={styles.headingIcon}
          resizeMode="contain"
        />

        <Text style={styles.headingText}>Painting Service</Text>

        <Image
          source={require("../assets/painting/p1.png")}
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
          style={{ pointerEvents: "auto" }}     // ✅ FIXED WARNING
        >
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate("ServiceDetail", { serviceId: item.id })}
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
          ))}
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
    width: 60,
    height: 60,
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
    padding: 14,
    boxShadow: "0px 3px 6px rgba(0,0,0,0.3)",   // ✅ Updated shadow
  },

  image: {
    width: "100%",
    height: 90,
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
  },
});
