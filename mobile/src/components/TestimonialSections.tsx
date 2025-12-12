// TestimonialsSection.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <View style={{ marginTop: 25 }}>
      <Text style={styles.title}>Voice of Our Customers</Text>

      <FlatList
        data={testimonials}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ pointerEvents: "auto" }}     // ✅ FIXED
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 5,
  },

  card: {
    width: 250,
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    boxShadow: "0px 3px 6px rgba(0,0,0,0.25)", // NEW API
  },

  text: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
