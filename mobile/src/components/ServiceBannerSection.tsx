import React, { useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = 160;
const SPACING = 18;
const FULL_WIDTH = ITEM_WIDTH + SPACING;

/**
 * 🔹 Service metadata formula
 * Key can be id OR inferred order
 */
const SERVICE_CONTENT: Record<
  string,
  { title: string; description: string }
> = {
  "1": {
    title: "Painting Services",
    description:
      "Premium painting solutions with flawless finish and expert supervision.",
  },
  "2": {
    title: "Cleaning Services",
    description:
      "Professional deep cleaning for a spotless and healthy home.",
  },
  "3": {
    title: "Construction Services",
    description:
      "End-to-end construction with quality materials and timely execution.",
  },
  "4": {
    title: "Electrical Services",
    description:
      "Safe and reliable electrical installations by certified professionals.",
  },
  "5": {
    title: "Interior Services",
    description:
      "Thoughtfully designed interiors blending comfort and functionality.",
  },
  "6": {
    title: "Plumbing Services",
    description:
      "Efficient plumbing solutions for durable and leak-free systems.",
  },
  "7": {
    title: "Carpentry Services",
    description:
      "Precision carpentry crafted for strength, style, and longevity.",
  },
};

export default function ServiceBannerSection({
  banners = [],
  onPressBanner,
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  let currentIndex = 0;

  // 🔁 Auto scroll
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToOffset({
        offset: currentIndex * FULL_WIDTH,
        animated: true,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={FULL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_WIDTH,
            index * FULL_WIDTH,
            (index + 1) * FULL_WIDTH,
          ];

          const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: ["35deg", "0deg", "-35deg"],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          // 🧠 Formula lookup (fallback safe)
          const content =
            SERVICE_CONTENT[item.id] || SERVICE_CONTENT[String(index + 1)] || {
              title: "Premium Service",
              description:
                "High quality execution with professional experts.",
            };

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPressBanner?.(item)}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [
                      { perspective: 900 },
                      { rotateY },
                      { scale },
                    ],
                  },
                ]}
              >
                {/* LEFT IMAGE */}
                <View style={styles.imageWrapper}>
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.textWrapper}>
                  <Text style={styles.title} numberOfLines={1}>
                    {content.title}
                  </Text>

                  <Text style={styles.description} numberOfLines={2}>
                    {content.description}
                  </Text>

                  <Text style={styles.cta}>View Details →</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 32,
  },

  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: SPACING,
    borderRadius: 22,
    backgroundColor: "#121826",
    flexDirection: "row",
    overflow: "hidden",

    // Android
    elevation: 8,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },

  imageWrapper: {
    width: "38%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#103881ff",
    padding: 12,
  },

  image: {
    width: "120%",
    height: "120%",
  },

  textWrapper: {
    width: "62%",
    paddingVertical: 28,
    paddingHorizontal: 14,
    justifyContent: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
  },

  cta: {
    marginTop: 10,
    marginBottom: 14,
    fontSize: 12,
    color: "#f3680bff",
    fontWeight: "600",
  },
});
