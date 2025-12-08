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
import banner7 from "../assets/banners/carb.png";

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
    { id: "7", image: banner7 },
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
            <Image source={logo} style={styles.logo} />
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

        

        {/* -------------------------------- */}
        {/* 🔵 SERVICE BANNERS WITH IMAGES */}
        {/* -------------------------------- */}
        <ServiceBannerSection 
          banners={banners}
          onPressBanner={(banner) => navigation.navigate("Services", { banner })}
        />


        {/* -------------------------------- */}
        {/* 🟣 EXCLUSIVE OFFERS WITH IMAGES */}
        {/* -------------------------------- */}
        <ExclusiveOffersSection offers={offers} onPressOffer={undefined} />

        {/* -------------------------------- */}
        {/* 🟡 TESTIMONIALS (TEXT ONLY) */}
        {/* -------------------------------- */}
        <TestimonialsSection testimonials={testimonials} />

        <View style={{ height: 220 }} />
      </ScrollView>

    
    </View>
  );
}

/* ------------------------------- */
/* ✨ STYLES                       */
/* ------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b2557ff",
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
    color: "#f3680bff",
    fontSize: 18,
    fontWeight: "600",
  },

  company: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
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
    width: 85,
    height: 85,
    resizeMode: "contain",
  },

  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#fff",
  },


  
});
