import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { user, loading, logout } = useAuth();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("profile_image").then((img) => {
      if (img) setImage(img);
    });
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("profile_image", uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f8e4b0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No user found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#0d0d0d", "#1a1a1a"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* PROFILE IMAGE SECTION */}
        <View style={styles.imageCard}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../assets/profilepicplaceholder.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to add / change profile picture</Text>
        </View>

        {/* CUSTOMER DETAILS */}
        <BlurView intensity={35} tint="dark" style={styles.glassCard}>
          <Info label="Name" value={user.name} />
          <Info label="Email ID" value={user.email} />
          <Info label="Customer ID" value={user.id} />
          <Info label="Location / Address" value={user.location || "Not added"} />
          <Info
            label="Subscribed On"
            value={
              user.created_at
                ? new Date(user.created_at).toDateString()
                : "N/A"
            }
          />
        </BlurView>

        {/* ACTION BOX */}
        <BlurView intensity={30} tint="dark" style={styles.actionCard}>
          <Option text="Manage Address" onPress={() => navigation.navigate("Addresses")} />
          <Option text="Profile Settings" onPress={() => navigation.navigate("ProfileSettings")} />
          <Option text="My Bookings" onPress={() => navigation.navigate("Bookings")} />
          <Option text="My Payments" onPress={() => navigation.navigate("Payments")} />
          <Option text="Help & Support" onPress={() => navigation.navigate("Help")} />
        </BlurView>

        {/* RATINGS & LOGOUT */}
        <BlurView intensity={30} tint="dark" style={styles.bottomCard}>
          <Text style={styles.ratingText}>⭐ 4.8 / 5</Text>
          <Text style={styles.feedbackText}>
            Thanks for being a valued customer 💛
          </Text>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </BlurView>

      </ScrollView>
    </LinearGradient>
  );
}

/* ---------- COMPONENTS ---------- */

const Info = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Option = ({ text, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.optionRow}>
    <Text style={styles.optionText}>{text}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },

  imageCard: {
    backgroundColor: "#f5f1e8",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },

  imageHint: {
    marginTop: 10,
    fontSize: 13,
    color: "#555",
  },

  glassCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  infoRow: {
    marginBottom: 14,
  },

  infoLabel: {
    color: "#aaa",
    fontSize: 13,
  },

  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },

  actionCard: {
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  optionText: {
    color: "#f8e4b0",
    fontSize: 16,
    fontWeight: "600",
  },

  arrow: {
    color: "#888",
    fontSize: 18,
  },

  bottomCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  ratingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8e4b0",
  },

  feedbackText: {
    color: "#ccc",
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#f8e4b0",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
  },

  logoutText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
