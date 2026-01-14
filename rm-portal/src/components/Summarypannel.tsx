// src/components/SummaryPanel.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SummaryCardProps {
  title: string;
  count: number;
  onPress?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.count}>{count}</Text>
  </TouchableOpacity>
);

interface SummaryPanelProps {
  data: { title: string; count: number; onPress?: () => void }[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ data }) => (
  <View style={styles.container}>
    {data.map((item, idx) => (
      <SummaryCard key={idx} {...item} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 120, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  title: { fontSize: 14, color: "#555", marginBottom: 5 },
  count: { fontSize: 20, fontWeight: "bold" },
});

export default SummaryPanel;
