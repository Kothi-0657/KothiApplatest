// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  location: string;
  profileImage: any;
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile_picture?: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✔ Load saved user and token from AsyncStorage on app start
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Failed to load auth data", err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  // ✔ When user logs in
  const login = async (user: User, token: string) => {
    setUser(user);
    setToken(token);

    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("token", token);
  };

  // ✔ When user logs out
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(["user", "token"]);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
