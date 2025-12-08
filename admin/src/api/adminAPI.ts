// src/api/adminAPI.ts
import axios from "axios";

// Base URL
const API_URL =
  import.meta.env.VITE_ADMIN_API || "http://localhost:4000";

// Axios instance with token
const adminAPI = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------------------- CUSTOMERS --------------------------------
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
  const res = await adminAPI.get("/bookings");
  return res.data.bookings || [];
};

export const updateBooking = async (id: string, status: string) => {
  return adminAPI.put(`/bookings/${id}/status`, { status });
};

// ---------------------------- PAYMENTS ----------------------------

// GET ALL PAYMENTS
export const fetchPayments = async () => {
  const res = await adminAPI.get("/api/admin/payments");
  return res.data.payments || [];
};

// UPDATE PAYMENT (full)
export const updatePayment = async (id: string, data: any) => {
  return adminAPI.put(`/api/admin/payments/${id}`, data);
};

// DELETE PAYMENT
export const deletePayment = async (id: string) => {
  return adminAPI.delete(`/api/admin/payments/${id}`);
};

// GET PAYMENT BY ID
export const getPaymentById = async (id: string) => {
  const res = await adminAPI.get(`/api/admin/payments/${id}`);
  return res.data.payment;
};

// CREATE PAYMENT
export const createPayment = async (data: any) => {
  return adminAPI.post("/api/admin/payments", data);
};

// -------------------------------- VENDORS --------------------------------
export const fetchVendors = async () => {
  const res = await adminAPI.get("/api/vendors");
  return res.data.vendors || [];
};

export const addVendor = async (vendorData: any) => {
  return adminAPI.post("/vendors", vendorData);
};

export const updateVendor = async (id: string, vendorData: any) => {
  return adminAPI.put(`/vendors/${id}`, vendorData);
};

export const deleteVendor = async (id: string) => {
  return adminAPI.delete(`/vendors/${id}`);
};

export const updateVendorStatus = async (id: string, status: string) => {
  return adminAPI.put(`/vendors/${id}/status`, { status });
};

// -------------------------------- SERVICES --------------------------------
export const fetchServices = async () => {
  const res = await adminAPI.get("/api/services");
  return res.data.data || res.data.services || [];
};

export const addService = async (serviceData: any) =>
  adminAPI.post("/api/services", serviceData);

export const updateService = async (id: string, data: any) =>
  adminAPI.put(`/api/services/${id}`, data);

export const deleteService = async (id: string) =>
  adminAPI.delete(`/api/services/${id}`);

// -------------------------------- DASHBOARD --------------------------------
export const fetchDashboardStats = async () => {
  const res = await adminAPI.get("/api/dashboard");
  return res.data;
};

export default adminAPI;
