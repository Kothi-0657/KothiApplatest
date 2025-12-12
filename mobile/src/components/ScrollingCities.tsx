// ScrollingCities.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

const cities = ["Delhi", "Mumbai", "Bengaluru", "PUNE", "Chennai", "Hyderabad"];

export default function ScrollingCities() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatedLoop = () => {
      translateX.setValue(200);
      Animated.timing(translateX, {
        toValue: -600,
        duration: 15000,
        useNativeDriver: true,
      }).start(() => animatedLoop());
    };

    animatedLoop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          { transform: [{ translateX }], pointerEvents: "none" } // ✅ FIXED WARNING
        ]}
      >
        {cities.join("   •   ")}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: 600,
    height: 22,
  },

  text: {
    fontSize: 10,
    color: "#00D4FF",
    fontWeight: "600",
  },
});
