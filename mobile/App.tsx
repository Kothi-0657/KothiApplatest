import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";  // ⭐ must import

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>   {/* ⭐ wrap navigation inside CartProvider */}
        
          <AppNavigator />
        
      </CartProvider>
    </AuthProvider>
  );
}
