// src/components/TestimonialsSection.tsx
import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// 🟠 Random review pool
const REVIEW_POOL = [
  "Excellent service and very professional team.",
  "Work quality was outstanding and timely.",
  "Affordable pricing with great finishing.",
  "Very smooth experience from booking to delivery.",
  "Highly recommended for home renovation.",
  "Professional staff and quality materials used.",
  "On-time service with clean finishing.",
  "Best service experience I’ve had so far.",
  "Great coordination and transparent pricing.",
  "Really impressed with the attention to detail.",
];

// 🟠 Neutral avatar pool (small & reusable)
const AVATARS = [
  require("../assets/profilepicplaceholder.png"),
  require("../assets/profilepicplaceholder.png"),
  require("../assets/profilepicplaceholder.png"),
];

// 🟠 Generate random reviews ONCE
const generateReviews = (count = 12) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${i}`,
    text: REVIEW_POOL[Math.floor(Math.random() * REVIEW_POOL.length)],
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
  }));

export default function TestimonialsSection() {
  const testimonials = useMemo(() => generateReviews(12), []);
  const flatListRef = useRef<FlatList>(null);
  const indexRef = useRef(0);

  // 🔁 Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % testimonials.length;
      flatListRef.current?.scrollToIndex({
        index: indexRef.current,
        animated: true,
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice of Our Customers</Text>

      <FlatList
        ref={flatListRef}
        data={testimonials}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: width * 0.72,
          offset: width * 0.72 * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.stars}>★★★★★</Text>
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    marginLeft: 12,
  },

  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },

  card: {
    width: width * 0.72,
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    marginRight: 14,

    // Android shadow
    elevation: 5,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#f3680bff",
  },

  stars: {
    color: "#facc15",
    fontSize: 12,
  },

  text: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
  },
});
