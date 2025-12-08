import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api"; // ✅ shared axios instance
import { useAuth } from "../context/AuthContext"; // ⭐ added

const { width: winW, height: winH } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // ⭐ added

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    console.log("🟡 Attempting login...");

    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("✅ Login response:", res.data);

      if (res.data.success && res.data.user && res.data.token) {
        const { user, token } = res.data;

        // ⭐ Instead of manual handling → use AuthContext login()
        await login(user, token);

        console.log("💾 Stored user data (via AuthContext):", user);
        Alert.alert("Success", "Login successful!");

        // ❗ DO NOT navigate here — AppNavigator will redirect automatically
      } else {
        Alert.alert(
          "Login Failed",
          res.data.message || "Invalid credentials. Please try again."
        );
      }
    } catch (err: any) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to reach the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/back.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%" }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require("../assets/logoa1.gif")}
                style={styles.logo}
              />
              <Text style={styles.brand}>Kothi India</Text>
              <Text style={styles.subtitle}>Welcome Back</Text>
            </View>

            {/* Login Box */}
            <View style={styles.card}>
              <Text style={styles.title}>Login to Your Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <LinearGradient
                  colors={["#d4af37", "#f8e4b0"]}
                  style={[styles.button, loading && { opacity: 0.6 }]}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Log In"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Signup")}
                style={{ marginTop: 20 }}
              >
                <Text style={styles.link}>
                  Don’t have an account?{" "}
                  <Text style={{ fontWeight: "700" }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  background: { flex: 1, height: winH },
  overlay: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContent: { alignItems: "center", justifyContent: "center" },

  header: { alignItems: "center", marginBottom: 30 },
  logo: { width: 130, height: 130, marginBottom: 10 },
  brand: { fontSize: 28, color: "#f8e4b0", fontWeight: "700", letterSpacing: 1 },
  subtitle: { color: "#ccc", fontSize: 15, marginTop: 2 },

  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    width: winW * 0.8,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#d4af37",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: { color: "#3b2e04", fontWeight: "700", fontSize: 16 },
  link: { color: "#f8e4b0", textAlign: "center", fontSize: 14 },
});
