import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function HelpScreen() {
  const { user } = useAuth();

  const contactNow = (method: "call" | "whatsapp" | "mail") => {
    if (!user) {
      alert("Please login to contact support.");
      return;
    }

    if (method === "call") Linking.openURL("tel:+919972225551");

    if (method === "whatsapp")
      Linking.openURL("https://wa.me/919972225551?text=Hello%20Kothi%20India");

    if (method === "mail")
      Linking.openURL("mailto:service@kothiindia.com?subject=Support Request");
  };

  return (
    <LinearGradient
      colors={["#000000", "#111111", "#1a1a1a"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>We're Here to Help</Text>

        {!user && (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color="#ffcc00"
            />
            <Text style={styles.warningText}>
              Login required to contact support.
            </Text>
          </View>
        )}

        <HelpOption
          title="Call Support"
          subtitle="Talk to our customer support team"
          icon="call-outline"
          onPress={() => contactNow("call")}
        />

        <HelpOption
          title="WhatsApp Support"
          subtitle="Chat instantly with our support team"
          icon="logo-whatsapp"
          onPress={() => contactNow("whatsapp")}
        />

        <HelpOption
          title="Email Support"
          subtitle="Drop us a detailed message"
          icon="mail-outline"
          onPress={() => contactNow("mail")}
        />

        <Text style={styles.footer}>
          Kothi India Home Solutions {"\n"}
          © 2025 All Rights Reserved
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const HelpOption = ({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: any;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.optionCard}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name={icon} size={26} color="#c6a664" style={{ marginRight: 14 }} />
      <View>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={22} color="#777" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 20 },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f5d77b",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },

  warningBox: {
    backgroundColor: "rgba(255, 204, 0, 0.12)",
    borderColor: "#ffcc00",
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  warningText: {
    marginLeft: 8,
    color: "#ffcc00",
    fontWeight: "600",
    fontSize: 14,
  },

  optionCard: {
    backgroundColor: "#141414",
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  optionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  optionSubtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },

  footer: {
    textAlign: "center",
    color: "#555",
    marginTop: 20,
    fontSize: 12,
  },
});
