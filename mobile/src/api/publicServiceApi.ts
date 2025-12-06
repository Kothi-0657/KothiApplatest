// mobile/src/api/publicServiceApi.ts
import api from "./api";

/**
 * Returns object with `.data` property (HomeScreen expects response.data)
 * Backend returns: { success: true, services: [...] }
 */
export const fetchPublicServices = async () => {
  const res = await api.get("/api/public/services"); //do not remove api nahi to path worong hojayega and list will not display
  // return an object with `.data` so HomeScreen code `response.data` works
  return { data: res.data.services || [] };
};

export const fetchPublicServiceById = async (id: string) => {
  const res = await api.get(`/api/public/services/${id}`);
  return { data: res.data.service || null };
};

export const fetchUserBookings = async (customerId: string) => {
  const res = await api.get(`/api/customer/${customerId}`);
  return res.data.bookings || [];
};

export const fetchUserPayments = async (customerId: string) => {
  const res = await api.get(`/api/payments/my/${customerId}`);
  return res.data.payments || [];
};

export const fetchBookingDetails = async (bookingId: string) => {
  const res = await api.get(`/api/booking/${bookingId}`);
  return res.data.booking || null;
};
export const fetchPaymentStatus = async (bookingId: string) => {
  const res = await api.get(`/api/payment/status/${bookingId}`);
  return res.data.payment || null;
};
