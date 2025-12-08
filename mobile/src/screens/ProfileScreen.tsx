// src/screens/ProfileScreen.tsx

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
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { user, loading, logout } = useAuth();
  const [image, setImage] = useState<string | null>(null);

  // Load profile picture from storage
  useEffect(() => {
    const loadProfileImage = async () => {
      const img = await AsyncStorage.getItem("profile_image");
      if (img) setImage(img);
    };
    loadProfileImage();
  }, []);

  // Pick new profile image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission Denied", "Allow access to photos.");
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem("profile_image", result.assets[0].uri);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logout(); // <-- AuthContext logout

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color="#c6a664" />;

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

      {/* Profile Picture */}
      <View style={styles.imageWrapper}>
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
        <Text style={styles.uploadText}>Tap to change picture</Text>
      </View>

      {/* User Details */}
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Customer ID</Text>
        <Text style={styles.value}>{user.id}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>

      {/* Links */}
      <View style={styles.links}>
        <Option text="Manage Account" onPress={() => navigation.navigate("Account")} />
        <Option text="Saved Addresses" onPress={() => navigation.navigate("Addresses")} />
        <Option text="My Bookings" onPress={() => navigation.navigate("Bookings")} />
        <Option text="Payment History" onPress={() => navigation.navigate("Payments")} />
        <Option text="Help & Support" onPress={() => navigation.navigate("Help")} />
        <Option text="Partner With Us" onPress={() => navigation.navigate("Partner")} />
      </View>

      {/* Logout Button */}
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={styles.logoutContainer}>
          <LinearGradient
            colors={["rgba(198,166,100,0.25)", "rgba(248,228,176,0.15)"]}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Option = ({ text, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.option}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1c1c1c" },
  header: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 10 },

  imageWrapper: { alignItems: "center", marginBottom: 15 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#f8e4b0",
  },
  uploadText: { color: "#bbb", marginTop: 8, fontSize: 13 },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  label: { color: "#bbb", fontSize: 14, marginTop: 10 },
  value: { color: "#fff", fontSize: 16, fontWeight: "600" },

  links: { marginTop: 10 },
  option: {
    color: "#f8e4b0",
    fontSize: 17,
    marginVertical: 10,
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },
  msg: { color: "#fff", fontSize: 18, marginBottom: 10 },
  link: { color: "#c6a664", fontSize: 17, fontWeight: "600" },

  logoutContainer: {
    width: "80%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoutButton: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#f8e4b0",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
