// src/components/Sidebar.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native-web";

interface SidebarProps {
  features: { name: string; onPress: () => void }[];
}

const Sidebar: React.FC<SidebarProps> = ({ features }) => {
  return (
    <View style={styles.sidebar}>
      {features.map((feature, index) => (
        <TouchableOpacity key={index} onPress={feature.onPress} style={styles.tab}>
          <Text style={styles.tabText}>{feature.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
    paddingHorizontal: 10,
    height: "100%",
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Sidebar;
