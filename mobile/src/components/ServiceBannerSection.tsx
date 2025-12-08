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
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPressBanner?.(item)}>
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
  },
});
