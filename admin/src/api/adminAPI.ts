// src/api/adminAPI.ts
import axios from "axios";

// ✅ Use Vite's import.meta.env instead of process.env
const ADMIN_BASE =
  import.meta.env.VITE_ADMIN_API || "http://192.168.29.182:4000/api/admin";

const adminAPI = axios.create({
  baseURL: ADMIN_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ✅ Optional: Attach admin token from localStorage (if available)
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
