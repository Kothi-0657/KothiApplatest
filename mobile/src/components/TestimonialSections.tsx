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
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.78;

/* -------------------- DATA POOLS -------------------- */

const NAMES = [
  "Amit Sharma",
  "Neha Verma",
  "Rahul Mehta",
  "Priya Singh",
  "Ankit Gupta",
  "Pooja Kapoor",
  "Suresh Iyer",
  "Ritika Jain",
];

const REVIEWS = [
  "Exceptional service quality with great attention to detail. The team was professional and very responsive throughout the project.",
  "From booking to execution, everything was smooth and transparent. Highly satisfied with the final outcome.",
  "Work was completed on time with excellent finishing. Definitely recommended for reliable home services.",
  "Very professional staff and well-organized execution. Pricing was fair and communication was clear.",
  "One of the best service experiences I’ve had. Clean work, polite team, and great results.",
  "Impressed by the quality and dedication of the team. Will surely use their services again.",
];

/* -------------------- HELPERS -------------------- */

// Random realistic customer avatar (remote)
const randomAvatar = () => {
  const gender = Math.random() > 0.5 ? "men" : "women";
  const id = Math.floor(Math.random() * 90) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

const generateTestimonials = (count = 10) =>
  Array.from({ length: count }).map((_, i) => {
    const rating = Math.random() > 0.6 ? 5 : 4;
    return {
      id: String(i),
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      text: REVIEWS[Math.floor(Math.random() * REVIEWS.length)],
      avatar: randomAvatar(),
      rating,
    };
  });

/* -------------------- COMPONENT -------------------- */

export default function TestimonialsSection() {
  const testimonials = useMemo(() => generateTestimonials(10), []);
  const flatListRef = useRef<FlatList>(null);
  const indexRef = useRef(0);

  // 🔁 Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % testimonials.length;
      flatListRef.current?.scrollToIndex({
        index: indexRef.current,
        animated: true,
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Our Customers Say</Text>
      <Text style={styles.subtitle}>
        Trusted by homeowners across India
      </Text>

      <FlatList
        ref={flatListRef}
        horizontal
        data={testimonials}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 18, paddingRight: 10 }}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.18)",
              "rgba(255,255,255,0.05)",
            ]}
            style={styles.card}
          >
            {/* HEADER */}
            <View style={styles.header}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.avatar}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.stars}>
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </Text>
              </View>
            </View>

            {/* REVIEW */}
            <Text style={styles.reviewText}>{item.text}</Text>
          </LinearGradient>
        )}
      />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginLeft: 18,
  },

  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginLeft: 18,
    marginBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    padding: 18,
    borderRadius: 18, // ⬛ soft square
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",

    // Android
    elevation: 6,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f97316",
    backgroundColor: "#111827",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  stars: {
    marginTop: 2,
    fontSize: 13,
    color: "#facc15",
  },

  reviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
  },
});
