// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuth } from "../context/AuthContext";

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

// Profile related screens
import ProfileAddress from "../screens/profileAddress";
import ProfileBookings from "../screens/profileBookings";
import ProfilePayments from "../screens/profilePayments";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
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
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentSuccess"
              component={PaymentSuccessScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentFailed"
              component={PaymentFailedScreen}
              options={{ headerShown: false }}
            />
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

            {/* Profile Stack Screens */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#1c1c1c" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" },
                title: "My Profile",
              }}
            />
            <Stack.Screen
              name="Bookings"
              component={ProfileBookings}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#1c1c1c" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" },
                title: "My Bookings",
              }}
            />
            <Stack.Screen
              name="Addresses"
              component={ProfileAddress}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#1c1c1c" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" },
                title: "Saved Addresses",
              }}
            />
            <Stack.Screen
              name="Payments"
              component={ProfilePayments}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#1c1c1c" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" },
                title: "Payment History",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
