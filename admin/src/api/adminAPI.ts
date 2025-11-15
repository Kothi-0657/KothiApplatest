// src/api/adminAPI.ts
import axios from "axios";

// Base URL
const API_URL =
  import.meta.env.VITE_ADMIN_API || "http://localhost:4000";

// Axios instance
const adminAPI = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminAPI;

// -------------------------------- customers --------------------------------
export const fetchCustomers = async () => {
  const res = await adminAPI.get("/api/customers");
  return res.data.customers || [];
};

export const updateCustomersStatus = async (id: string, status: string) => {
  return adminAPI.put(`/api/customers/${id}/status`, { status });
};

export const deleteCustomers = async (id: string) => {
  return adminAPI.delete(`/api/customers/${id}`);
};

// -------------------------------- BOOKINGS --------------------------------
export const fetchBookings = async () => {
  const res = await adminAPI.get("/api/bookings");
  return res.data.bookings || [];
};

export const updateBooking = async (id: string, status: string) => {
  return adminAPI.put(`/api/bookings/${id}/status`, { status });
};

// -------------------------------- PAYMENTS --------------------------------
export const fetchPayments = async () => {
  const res = await adminAPI.get("/api/payments");
  return res.data.payments || [];
};

export const updatePaymentStatus = async (id: string, status: string) => {
  return adminAPI.put(`/api/payments/${id}/status`, { status });
};

export const verifyPayment = async (id: string) => {
  return adminAPI.put(`/api/payments/${id}/verify`);
};
