import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ExclusiveOffersSection() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Exclusive Offers (Empty until API added)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#334155",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  text: { color: "#fff", fontSize: 16 },
});
