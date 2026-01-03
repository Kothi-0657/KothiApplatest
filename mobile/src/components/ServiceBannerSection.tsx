// src/components/ServiceBannerSection.tsx
import React from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ServiceBannerSection({
  banners = [],
  onPressBanner,
}) {
  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onPressBanner?.(item)}
            style={[
              styles.cardWrapper,
              index === 0 && { marginLeft: 16 },
            ]}
          >
            <Image source={item.image} style={styles.bannerImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 8,
  },

  listContent: {
    paddingVertical: 14,
    paddingRight: 16,
  },

  cardWrapper: {
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: "#6f6863ff",

    // Android shadow
    elevation: 5,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  bannerImage: {
    width: 200,
    height: 210,
    borderRadius: 16,
    resizeMode: "cover",
  },
});
