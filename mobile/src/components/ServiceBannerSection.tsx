// ServiceBannerSection.tsx
import React from "react";
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ServiceBannerSection({ banners = [], onPressBanner }) {
  if (!banners.length) return null;

  return (
    <FlatList
      data={banners}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 30 }}
      style={{ pointerEvents: "auto" }}   // ✅ FIXED WARNING
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressBanner?.(item)}
          style={{ pointerEvents: "auto" }}  // ✅ FIXED WARNING
        >
          <Image source={item.image} style={styles.banner} />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    width: 180,
    height: 175,
    borderRadius: 12,
    marginRight: 12,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)", // future-safe shadow
  },
});
