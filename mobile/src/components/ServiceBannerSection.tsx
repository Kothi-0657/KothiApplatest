import React, { useRef, useEffect, useState } from "react";
import { View, Animated, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ServiceBannerSection({ banners = [], onPressBanner }) {
  if (!banners.length) return null;

  const scrollX = useRef(new Animated.Value(0)).current;

  // Duplicate list for seamless infinite looping
  const data = [...banners, ...banners];

  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentWidth === 0) return;

    const animate = () => {
      scrollX.setValue(0);

      Animated.timing(scrollX, {
        toValue: -contentWidth / 2, // scroll exactly one set of banners
        duration: 25000,            // speed (slow)
        useNativeDriver: true,
      }).start(() => {
        animate(); // restart seamlessly
      });
    };

    animate();
  }, [contentWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX: scrollX }],
        }}
        onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}
      >
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => onPressBanner?.(item)}>
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={styles.banner}
            />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
    paddingVertical: 10,
  },
  banner: {
    width: 160,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
  },
});
