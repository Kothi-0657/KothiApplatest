import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function ExclusiveOffersScreen({ offers = [], onPressOffer }) {
  if (!offers.length) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.title}>Exclusive Offers</Text>

      <FlatList
        data={offers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onPressOffer?.(item)}>
            <Image 
              source={ typeof item.image === "string" ? { uri: item.image } : item.image }
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
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10, marginLeft: 5 },
  card: {
    width: 200,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
  },
  img: { width: "100%", height: 100, borderRadius: 10 },
  name: { color: "#fff", marginTop: 8, fontWeight: "600" },
});
