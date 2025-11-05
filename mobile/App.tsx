import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HelpScreen from "./src/screens/HelpScreen";
import ServiceDetailScreen from "./src/screens/ServiceDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#FFD700",
            title: "Service Detail",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
