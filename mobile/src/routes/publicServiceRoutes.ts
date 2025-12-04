// mobile/src/routes/publicServiceRoutes.ts
import api from "../api/api";

// Fetch all services
export const fetchServices = async () => {
  try {
    const res = await api.get("/api/public/services");

    // backend returns { success, data: [...] }
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Fetch a single service
export const fetchServiceById = async (id: string) => {
  try {
    const res = await api.get(`/api/public/services/${id}`);

    // backend returns { success, data: {...} }
    return res.data.data || null;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return null;
  }
};
