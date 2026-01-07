import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function ExclusiveOfferSection({ offers = [], onPressOffer }) {
  if (!offers.length) return null;

  return (
    <View style={{ marginTop: 20 }}>

      {/* Heading + Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={require("../assets/logoa2.png")}
          style={{ width: 32, height: 32, marginLeft: 8, marginBottom: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Exclusive Offers and Deals</Text>
      </View>

      <FlatList
        data={offers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onPressOffer?.(item)}>
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.img}
            />
            <Text style={styles.name}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 15,
  },

  card: {
    width: 400,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 13,
    marginRight: 12,
  },

  img: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },

  name: {
    color: "#f3851eff",
    marginTop: 8,
    fontWeight: "600",
  },
});
