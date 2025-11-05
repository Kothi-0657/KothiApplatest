// src/navigation/AppNavigator.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Screens
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ServiceListScreen from "../screens/ServiceListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapPickerScreen from "../screens/MapPickerScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------------------
// 🔹 Custom Glass Bottom Tab Bar
// ------------------------------
function GlassTabBar({ state, descriptors, navigation }: any) {
  return (
    <BlurView
      tint="light"
      intensity={60}
      style={[
        styles.tabBarContainer,
        Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Services") iconName = "construct-outline";
          else if (route.name === "Profile") iconName = "person-circle-outline";

          const color = isFocused ? "#d4af37" : "#777";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={isFocused ? 28 : 24}
                color={color}
              />
              <Text
                style={{
                  color,
                  fontSize: 11,
                  marginTop: 2,
                  fontWeight: isFocused ? "700" : "500",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

// ------------------------------
// 🔹 Bottom Tabs (Main App Navigation)
// ------------------------------
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />} // ✅ Custom glass tab bar
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServiceListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ------------------------------
// 🔹 Root Stack Navigation (Includes Map Picker)
// ------------------------------
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        contentStyle: { backgroundColor: "#f4f4f4" },
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* Main App */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* 🌍 Map Picker Screen */}
      <Stack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{
          headerShown: true,
          title: "Choose Location",
          headerTintColor: "#d4af37",
          headerStyle: {
            backgroundColor: "#f8f8f8",
          },
        }}
      />
    </Stack.Navigator>
  );
}

// ------------------------------
// 🎨 Styles
// ------------------------------
const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  tabBarInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  androidShadow: {
    elevation: 8,
  },
});
