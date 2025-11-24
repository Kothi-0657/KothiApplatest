import api from "../api/api";

// Fetch all services
export const fetchServices = async () => {
  try {
    const res = await api.get("/api/public/services");
    return res.data.services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Fetch a single service
export const fetchServiceById = async (id: string) => {
  try {
    const res = await api.get(`/api/public/services/${id}`);
    return res.data.service;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return null;
  }
};
