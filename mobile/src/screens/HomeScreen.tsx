// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ExclusiveOffersSection from "../components/ExclusiveOfferSection";
import TestimonialsSection from "../components/TestimonialSections";
import ServiceBannerSection from "../components/ServiceBannerSection";

// Images
import logo from "../assets/logoa1.gif";
import profilePlaceholder from "../assets/profilepicplaceholder.png";

// 🔵 LOCAL BANNERS (Add your assets)
import banner1 from "../assets/banners/painb.png";
import banner2 from "../assets/banners/cleab.png";
import banner3 from "../assets/banners/conb.png";
import banner4 from "../assets/banners/elecb.png";
import banner5 from "../assets/banners/inteb.png";
import banner6 from "../assets/banners/plumb.png";

// 🟣 LOCAL OFFERS (Add your assets)
import offer1 from "../assets/offers/cleano.mp4";
import offer2 from "../assets/offers/painoffer.mp4";

// 🟡 TESTIMONIALS (Simple text list)
const testimonials = [
  { id: "1", text: "Great service! Highly recommended." },
  { id: "2", text: "Very professional and fast." },
  { id: "3", text: "Affordable and excellent work!" },
];

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  // ----------------------------------------
  // 🔵 HARD-CODED BANNERS UNTIL API IS READY
  // ----------------------------------------
  const banners = [
    { id: "1", image: banner1 },
    { id: "2", image: banner2 },
    { id: "3", image: banner3 },
    { id: "4", image: banner4 },
    { id: "5", image: banner5 },
    { id: "6", image: banner6 },
  ];

  // ------------------------------------------
  // 🟣 HARD-CODED EXCLUSIVE OFFERS (No API yet)
  // ------------------------------------------
  const offers = [
    { id: "1", title: "50% Off Painting", image: offer1 },
    { id: "2", title: "Flat ₹999 Deep Cleaning", image: offer2 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --------------------------------------------- */}
        {/* 🔵 HEADER WITH LOGO | LOCATION | PROFILE ICON */}
        {/* --------------------------------------------- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>
              Welcome {user?.name || "Guest"}
            </Text>
            <Text style={styles.company}>Kothi India Private Limited</Text>
            <Text style={styles.location}>
              📍 {user?.location || "Your Location"}
            </Text>
          </View>

          {/* LOGO + PROFILE ICON */}
          <View style={styles.rightHeader}>
            <Image source={logo} style={styles.logo} />

            <TouchableOpacity onPress={() => navigation.navigate("MyProfile")}>
              <Image
                source={
                  user?.profileImage
                    ? { uri: user.profileImage }
                    : profilePlaceholder
                }
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* -------------------------------- */}
        {/* 🔵 SERVICE BANNERS WITH IMAGES */}
        {/* -------------------------------- */}
        <ServiceBannerSection banners={banners} onPressBanner={undefined} />

        {/* -------------------------------- */}
        {/* 🟣 EXCLUSIVE OFFERS WITH IMAGES */}
        {/* -------------------------------- */}
        <ExclusiveOffersSection offers={offers} />

        {/* -------------------------------- */}
        {/* 🟡 TESTIMONIALS (TEXT ONLY) */}
        {/* -------------------------------- */}
        <TestimonialsSection testimonials={testimonials} />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ❤️ HELP BUTTON */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => navigation.navigate("Help")}
      >
        <Text style={styles.helpButtonText}>Need Help?</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------- */
/* ✨ STYLES                       */
/* ------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 150,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  company: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 2,
  },

  location: {
    color: "#06B6D4",
    fontSize: 14,
    marginTop: 6,
  },

  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#fff",
  },

  logoutBtn: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
  },

  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  helpButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#06B6D4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#06B6D4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  helpButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
