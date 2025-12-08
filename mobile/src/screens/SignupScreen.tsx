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
import api from "../api/api"; // ✅ shared axios instance

const { width, height } = Dimensions.get("window");

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Missing Fields", "Please fill all fields before continuing.");
      return;
    }

    setLoading(true);
    console.log("📡 Sending request to:", api.defaults.baseURL);

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        phone,
      });

      console.log("✅ Signup Response:", res.data);

      if (res.data.success) {
        Alert.alert("Success", "Account created successfully!");
        navigation.replace("Login");
      } else {
        Alert.alert("Error", res.data.message || "Signup failed. Try again.");
      }
    } catch (err: any) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      Alert.alert(
        "Server Error",
        err.response?.data?.message || "Unable to reach server"
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
            <View style={styles.header}>
              <Image source={require("../assets/logoa1.gif")} style={styles.logo} />
              <Text style={styles.brand}>Kothi India</Text>
              <Text style={styles.subtitle}>Elevate Your Lifestyle</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Create Your Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
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
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={handleSignup} disabled={loading}>
                <LinearGradient
                  colors={["#c6a664", "#f8e4b0"]}
                  style={[styles.button, loading && { opacity: 0.6 }]}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 20 }}
              >
                <Text style={styles.link}>
                  Already have an account?{" "}
                  <Text style={{ fontWeight: "700" }}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const { width: winW, height: winH } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: { flex: 1, height: winH },
  overlay: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContent: { alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 130, height: 130, marginBottom: 10 }, // bigger logo
  brand: { fontSize: 26, color: "#f8e4b0", fontWeight: "700", letterSpacing: 1 },
  subtitle: { color: "#ccc", fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    width: winW * 0.75, // smaller box
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: { borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "#3b2e04", fontWeight: "700", fontSize: 16 },
  link: { color: "#f8e4b0", textAlign: "center", fontSize: 14 },
});
