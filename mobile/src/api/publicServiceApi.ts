// mobile/src/api/publicServiceApi.ts
import api from "./api";

/**
 * Returns object with `.data` property (HomeScreen expects response.data)
 * Backend returns: { success: true, services: [...] }
 */
export const fetchPublicServices = async () => {
  const res = await api.get("/public/services");
  // return an object with `.data` so HomeScreen code `response.data` works
  return { data: res.data.services || [] };
};

export const fetchPublicServiceById = async (id: string) => {
  const res = await api.get(`/public/services/${id}`);
  return { data: res.data.service || null };
};

export const fetchUserBookings = async (customerId: string) => {
  const res = await api.get(`/bookings/user/${customerId}`);
  return res.data.bookings || [];
};

export const fetchUserPayments = async (customerId: string) => {
  const res = await api.get(`/payments/user/${customerId}`);
  return res.data.payments || [];
};