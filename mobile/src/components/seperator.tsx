// seperator.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  thickness?: number;
  color?: string;
  marginVertical?: number;
}

const Separator = ({
  thickness = 2,
  color = "#ffffff33",
  marginVertical = 4,
}: Props) => {
  return (
    <View style={{ marginVertical }}>
      <View
        style={{
          height: thickness,
          backgroundColor: color,
          width: "100%",
        }}
      />

      {/* No shadow*, no pointerEvents warning */}
      <LinearGradient
        colors={["#00000040", "#00000010", "transparent"]}
        style={styles.shadowGradient}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowGradient: {
    width: "100%",
    height: 45,
    marginTop: -2,
  },
});

export default Separator;
