// src/api/adminAPI.ts
import axios from "axios";

// ✅ Use Vite environment or fallback to local IP
const ADMIN_BASE =
  import.meta.env.VITE_ADMIN_API || "http://192.168.29.182:4000/api/admin";

const adminAPI = axios.create({
  baseURL: ADMIN_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ✅ Auto-attach admin token from localStorage
adminAPI.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("admin_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminAPI;
