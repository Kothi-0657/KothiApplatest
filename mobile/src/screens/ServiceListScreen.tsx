import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const services = [
  { id: "1", name: "Home Cleaning" },
  { id: "2", name: "AC Repair" },
  { id: "3", name: "Plumbing" },
  { id: "4", name: "Electrician" },
];

export default function ServiceListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: { fontSize: 16, color: "#333" },
});
