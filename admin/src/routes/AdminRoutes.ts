import axios from "axios";

const API_URL = "http://localhost:4000/api/admin";

// ---------------------- customers ----------------------
export const fetchCustomers = async () => {
  const res = await axios.get(`${API_URL}/customers`);
  return res.data.customers || [];
};

export const updateCustomersStatus = async (id: string, status: string) => {
  return axios.put(`${API_URL}/customers/${id}/status`, { status });
};

export const deleteCustomers = async (id: string) => {
  return axios.delete(`${API_URL}/customers/${id}`);
};

// ---------------------- BOOKINGS ----------------------
export const fetchBookings = async () => {
  const res = await axios.get(`${API_URL}/bookings`);
  return res.data.bookings || [];
};

export const updateBooking = async (id: string, status: string) => {
  return axios.put(`${API_URL}/bookings/${id}/status`, { status });
};

// ---------------------- PAYMENTS ----------------------
export const fetchPayments = async () => {
  const res = await axios.get(`${API_URL}/payments`);
  return res.data.payments || [];
};

export const updatePaymentStatus = async (id: string, status: string) => {
  return axios.put(`${API_URL}/payments/${id}/status`, { status });
};

export const verifyPayment = async (id: string) => {
  return axios.put(`${API_URL}/payments/${id}/verify`);
};
