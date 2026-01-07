// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import Separator from "../components/seperator";

import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import * as Location from "expo-location";

import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ExclusiveOffersSection from "../components/ExclusiveOfferSection";
import TestimonialsSection from "../components/TestimonialSections";
import ServiceBannerSection from "../components/ServiceBannerSection";
import HomeConstructionSection from "../components/HomeConstructionSection";
import PaintingScroll from "../components/paintingScroll";
import ScrollingCities from "../components/ScrollingCities";

// Images
import logo from "../assets/logoa2.png";
import profilePlaceholder from "../assets/profilepicplaceholder.png";

// Service banners
import banner1 from "../assets/banners/painb.png";
import banner2 from "../assets/banners/cleab.png";
import banner3 from "../assets/banners/conb.png";
import banner4 from "../assets/banners/elecb.png";
import banner5 from "../assets/banners/inteb.png";
import banner6 from "../assets/banners/plumb.png";
import banner7 from "../assets/banners/carb.png";

// Offers
import offer1 from "../assets/offers/cleano.mp4";
import offer2 from "../assets/offers/painoffer.mp4";

// Calculator icon
import calIcon from "../assets/cal.png";

import { route } from "../navigation/AppNavigator";

const testimonials = [
  { id: "1", text: "Great service! Highly recommended." },
  { id: "2", text: "Very professional and fast." },
  { id: "3", text: "Affordable and excellent work!" },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<string>("Fetching location...");

  const selectedLocation = route?.params?.selectedLocation;

  useEffect(() => {
    if (selectedLocation) {
      setCurrentLocation(selectedLocation);
      return;
    }
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCurrentLocation("Permission denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (place) {
          const formatted = `${place.name || ""}, ${place.city || place.region || ""}`;
          setCurrentLocation(formatted);
        } else {
          setCurrentLocation("Unknown location");
        }
      } catch (err) {
        console.log("Error fetching location:", err);
        setCurrentLocation("Location unavailable");
      }
    })();
  }, [selectedLocation]);

  // ------------------------------
  // Banners
  // ------------------------------
  const banners = [
    { id: "1", image: banner1 },
    { id: "2", image: banner2 },
    { id: "3", image: banner3 },
    { id: "4", image: banner4 },
    { id: "5", image: banner5 },
    { id: "6", image: banner6 },
    { id: "7", image: banner7 },
  ];

  // ------------------------------
  // Offers
  // ------------------------------
  const offers = [
    { id: "1", title: "Flat ₹999 Deep Cleaning", image: offer1 },
    { id: "2", title: "50% OFF on Interior painting", image: offer2 },
  ];

  // ------------------------------
  // Constructions (static imports)
  // ------------------------------
  const constructionData = [
    { id: "1", title: "Full House Construction", image: require("../assets/construction/el1.png") },
    { id: "2", title: "Front elevation Design", image: require("../assets/construction/el2.png") },
    { id: "3", title: "Front elevation Design 2", image: require("../assets/construction/el3.png") },
    { id: "4", title: "Front elevation Design 3", image: require("../assets/construction/el4.png") },
    { id: "5", title: "Front elevation Design 4", image: require("../assets/construction/el5.png") },
    { id: "6", title: "Front elevation Design", image: require("../assets/construction/el6.png") },
    { id: "7", title: "Front elevation Design", image: require("../assets/construction/el7.png") },
    { id: "8", title: "Front elevation Design", image: require("../assets/construction/el8.png") },
    { id: "9", title: "Front elevation Design", image: require("../assets/construction/el9.png") },
    { id: "10", title: "Front elevation Design", image: require("../assets/construction/el10.png") },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcome}>Welcome {user?.name || "Guest"}</Text>
              <Text style={styles.company}>Kothi India Private Limited</Text>
              <Text style={styles.location}>📍 {currentLocation}</Text>
              <View style={styles.servicableContainer}>
                <Text style={styles.servicableText}>Servicable Location:</Text>
                <ScrollingCities />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MyProfile")}>
            <Image
              source={user?.profileImage ? { uri: user.profileImage } : profilePlaceholder}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <Separator thickness={3} color="#050000ff" marginVertical={2} />

        {/* SERVICE BANNERS */}
        <ServiceBannerSection 
          banners={banners}
          onPressBanner={(banner) => navigation.navigate("Services", { banner })}
        />

        <Separator thickness={2} color="#0b051eff" marginVertical={2} />

        {/* EXCLUSIVE OFFERS */}
        <ExclusiveOffersSection offers={offers} onPressOffer={undefined} />

        <Separator thickness={2} color="#0b051eff" marginVertical={2} />

        {/* HOME CONSTRUCTIONS */}
        <HomeConstructionSection constructions={constructionData} onPressConstruction={undefined} />

        <Separator thickness={2} color="#0b051eff" marginVertical={2} />

        {/* PAINTING SCROLL */}
        <PaintingScroll navigation={navigation} />

        <Separator thickness={2} color="#0b051eff" marginVertical={2} />

        {/* PAINTING CALCULATOR */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("PaintingCalculator")}
          style={styles.calculatorContainer}
        >
          <Image source={calIcon} style={styles.calIcon} />
          <Text style={styles.calculatorText}>Painting Calculator</Text>
        </TouchableOpacity>

        <Separator thickness={2} color="#020105ff" marginVertical={2} />

        {/* TESTIMONIALS */}
        <TestimonialsSection testimonials={testimonials} />

        <View style={{ height: 220 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------------------
// STYLES
// -------------------------------
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  welcome: {
    color: "#f3680bff",
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
    marginTop: 2,
  },
  servicableContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  servicableText: {
    fontSize: 10,
    color: "#0d8e1cff",
    marginRight: 6,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
  calculatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b2557ff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  calIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 12,
  },
  calculatorText: {
    color: "#f3680bff",
    fontSize: 16,
    fontWeight: "600",
  },
});
