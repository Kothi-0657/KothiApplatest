// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useAuth } from "../context/AuthContext";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HelpScreen from "../screens/HelpScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import BookingScreen from "../screens/BookingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import TermsAndConditions from "../screens/TermsAndConditions";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentSuccessScreen from "../screens/PaymentSuccess";
import PaymentFailedScreen from "../screens/PaymentFailed";
// NEW
import CartScreen from "../screens/CartScreen";
import ServiceBannerScreen from "../components/ServiceBannerSection";
import ExclusiveOffersScreen from "../components/ExclusiveOfferSection";
import TestimonialsScreen from "../components/TestimonialSections";
import ServicesScreen from "../screens/serviceScreen";
// Profile related screens
import ProfileAddress from "../screens/profileAddress";
import ProfileBookings from "../screens/profileBookings";
import ProfilePayments from "../screens/profilePayments";
import ServiceBannerSection from "../components/ServiceBannerSection";
import TestimonialsSection from "../components/TestimonialSections";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarBackground: () => (
          <BlurView intensity={30} tint="dark" style={{ flex: 1 }} />
        ),

        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          left: 20,
          right: 20,
          height: 55,
          borderRadius: 30,
          backgroundColor: "rgba(33,14,14,0.45)",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color, focused }) => (
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: focused
            ? "rgba(255,215,0,0.25)"
            : "rgba(255,255,255,0.08)",
        }}
      >
        <Image
          source={require("../assets/logoa1.gif")}
          style={{
            width: 56,
            height: 56,
            borderRadius: 6,
          }}
          resizeMode="contain"
        />
      </View>
    ),
  }}
/>

<Tab.Screen
  name="Services"
  component={ServicesScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="apps-outline" size={size} color={color} />
    ),
  }}
/>

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused
                  ? "rgba(255,215,0,0.25)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <Ionicons name="cart-outline" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="My Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused
                  ? "rgba(255,215,0,0.25)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <Ionicons name="person" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused
                  ? "rgba(255,215,0,0.25)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <Ionicons name="help-circle" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            {/* Main Tabs */}
            <Stack.Screen name="Main" component={Tabs} />

            {/* Cart (also available in stack) */}
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#FFD700",
                title: "My Cart",
              }}
            />

            {/* Booking & Payment Screens */}
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#FFD700",
                title: "Booking",
              }}
            />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
              <Stack.Screen name="Service Banners" component={ServiceBannerSection} />
            <Stack.Screen name="Exclusive Offers" component={ExclusiveOffersScreen} />
            <Stack.Screen name="Testimonials" component={TestimonialsSection} />

            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
              options={{ headerShown: true, title: "Terms & Conditions" }}
            />

            {/* Service Detail */}
            <Stack.Screen
              name="ServiceDetail"
              component={ServiceDetailScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#FFD700",
                title: "Service Detail",
              }}
            />

            {/* Profile Subscreens */}
            <Stack.Screen name="Bookings" component={ProfileBookings} />
            <Stack.Screen name="Addresses" component={ProfileAddress} />
            <Stack.Screen name="Payments" component={ProfilePayments} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
