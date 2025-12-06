import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://localhost:4000"; // change when deploying

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Automatically attach JWT token to all API requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log("Token fetch error:", e);
  }
  return config;
});

export default api;
