// src/api/adminAPI.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_ADMIN_API || "http://localhost:4000";

const adminAPI = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach admin token to every request
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   CUSTOMERS (ADMIN)
========================= */
export const fetchCustomers = async () => {
  const res = await adminAPI.get("/api/customers");
  return res.data.customers || [];
};

export const updateCustomersStatus = async (id: string, status: string) =>
  adminAPI.put(`/api/customers/${id}/status`, { status });

export const deleteCustomers = async (id: string) =>
  adminAPI.delete(`/api/customers/${id}`);

/* =========================
   BOOKINGS (ADMIN)
========================= */
export const fetchBookings = async () => {
  const res = await adminAPI.get("/api/bookings");
  return res.data.bookings || [];
};

export const updateBooking = async (id: string, status: string) =>
  adminAPI.patch(`/api/bookings/${id}/status`, { status });

/* =========================
   PAYMENTS (ADMIN)
========================= */
export const fetchPayments = async () => {
  const res = await adminAPI.get("/api/admin/payments");
  return res.data.payments || [];
};

export const updatePayment = async (id: string, data: any) =>
  adminAPI.put(`/api/admin/payments/${id}`, data);

export const deletePayment = async (id: string) =>
  adminAPI.delete(`/api/admin/payments/${id}`);

export const getPaymentById = async (id: string) => {
  const res = await adminAPI.get(`/api/admin/payments/${id}`);
  return res.data.payment;
};

export const createPayment = async (data: any) =>
  adminAPI.post("/api/admin/payments", data);

/* =========================
   VENDORS (ADMIN)
========================= */
export const fetchVendors = async () => {
  const res = await adminAPI.get("/api/admin/vendors");
  return res.data.vendors || [];
};

export const addVendor = async (vendorData: any) =>
  adminAPI.post("/api/admin/vendors", vendorData);

export const updateVendor = async (id: string, vendorData: any) =>
  adminAPI.put(`/api/admin/vendors/${id}`, vendorData);

export const deleteVendor = async (id: string) =>
  adminAPI.delete(`/api/admin/vendors/${id}`);

export const updateVendorStatus = async (id: string, status: string) =>
  adminAPI.put(`/api/admin/vendors/${id}/status`, { status });

/* =========================
   SERVICES (ADMIN)
========================= */
export const fetchServices = async () => {
  const res = await adminAPI.get("/api/admin/services");
  return res.data.services || [];
};

export const addService = async (serviceData: any) =>
  adminAPI.post("/api/admin/services", serviceData);

export const updateService = async (id: string, data: any) =>
  adminAPI.put(`/api/admin/services/${id}`, data);

export const deleteService = async (id: string) =>
  adminAPI.delete(`/api/admin/services/${id}`);

/* =========================
   DASHBOARD
========================= */
export const fetchDashboardStats = async () => {
  const res = await adminAPI.get("/api/dashboard");
  return res.data;
};

/* =========================
   AUTH (ADMIN)
========================= */
export const adminLogin = async (email: string, password: string) => {
  const res = await adminAPI.post("/api/admin/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const adminRegister = async (data: any) => {
  const res = await adminAPI.post("/api/admin/auth/register", data);
  return res.data;
};

export const fetchAdminProfile = async () => {
  const res = await adminAPI.get("/api/admin/auth/profile");
  return res.data.admin;
};

export const updateAdminProfile = async (data: any) => {
  const res = await adminAPI.put("/api/admin/auth/profile", data);
  return res.data;
};

export const changeAdminPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await adminAPI.put("/api/admin/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};

/* =========================
   RM & FRM USERS (ADMIN)
========================= */
export const fetchRMs = async () => {
  const res = await adminAPI.get("/api/admin/user-management/rms");
  // Map backend response to match frontend User interface
  return res.data.rms.map((u: any) => ({
    id: u.id.toString(),
    email: u.email,
    status: u.isActive ? "active" : "inactive",
  }));
};

export const fetchFRMs = async () => {
  const res = await adminAPI.get("/api/admin/user-management/frms");
  return res.data.frms.map((u: any) => ({
    id: u.id.toString(),
    email: u.email,
    status: u.isActive ? "active" : "inactive",
  }));
};

export const createRM = async (data: { email: string }) => {
  const res = await adminAPI.post("/api/admin/user-management/rms", data);
  return res.data;
};

export const createFRM = async (data: { email: string }) => {
  const res = await adminAPI.post("/api/admin/user-management/frms", data);
  return res.data;
};

export const toggleUserStatus = async (id: string) => {
  const res = await adminAPI.patch(`/api/admin/user-management/${id}/toggle`);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await adminAPI.delete(`/api/admin/user-management/${id}`);
  return res.data;
};

export default adminAPI;
