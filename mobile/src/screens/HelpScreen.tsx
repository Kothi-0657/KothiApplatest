import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HelpScreen() {
  const contactNow = (method: "call" | "whatsapp" | "mail", topic: string) => {
    if (method === "call") Linking.openURL("tel:+919972225551");
    if (method === "whatsapp") Linking.openURL("https://wa.me/919972225551");
    if (method === "mail") Linking.openURL(`mailto:service@kothiindia.com?subject=Help regarding ${topic}`);
  };

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Need Help?</Text>

        <HelpSection title="Help in Bookings" topic="Booking Support" contactNow={contactNow} />
        <HelpSection title="Help in Partnership" topic="Partnership Enquiry" contactNow={contactNow} />

        <Text style={styles.email}>
          For general enquiries: {"\n"}service@kothiindia.com
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const HelpSection = ({
  title,
  topic,
  contactNow,
}: {
  title: string;
  topic: string;
  contactNow: any;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.btn} onPress={() => contactNow("call", topic)}>
        <Ionicons name="call-outline" size={20} color="#000" />
        <Text style={styles.btnText}>Call</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => contactNow("whatsapp", topic)}>
        <Ionicons name="logo-whatsapp" size={20} color="#000" />
        <Text style={styles.btnText}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => contactNow("mail", topic)}>
        <Ionicons name="mail-outline" size={20} color="#000" />
        <Text style={styles.btnText}>Mail</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70 },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f5d77b",
    textAlign: "center",
    marginBottom: 25,
  },
  section: {
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  sectionTitle: { color: "#fff", fontSize: 17, fontWeight: "600", marginBottom: 15 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    backgroundColor: "#f5d77b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: { marginLeft: 6, fontWeight: "600", color: "#000" },
  email: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 10,
    fontSize: 13,
  },
});
