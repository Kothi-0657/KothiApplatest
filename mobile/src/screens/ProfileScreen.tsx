import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#c6a664" />;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No user data found. Please log in.</Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Customer ID</Text>
        <Text style={styles.value}>{user._id}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>

      <View style={styles.links}>
        <TouchableOpacity><Text style={styles.option}>Booking Details</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.option}>Payment History</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.option}>Help</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.option}>Partnership</Text></TouchableOpacity>
      </View>

      {/* 🟡 Glass-Effect Logout Button */}
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutContainer}
        >
          <LinearGradient
            colors={["rgba(198,166,100,0.25)", "rgba(248,228,176,0.15)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "rgba(255,255,255,0.05)" },
  header: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 15 },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20,
  },
  label: { color: "#bbb", fontSize: 14, marginTop: 10 },
  value: { color: "#fff", fontSize: 16, fontWeight: "600" },
  links: { marginTop: 10 },
  option: { color: "#f8e4b0", fontSize: 16, marginVertical: 8, fontWeight: "600" },
  msg: { color: "#fff", fontSize: 16, marginBottom: 10 },
  link: { color: "#c6a664", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1c" },

  // 🧊 Logout Button Glass Style
  logoutContainer: {
    width: "80%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutButton: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#f8e4b0",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
