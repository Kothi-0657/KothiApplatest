import api from "./api";

// Fetch paint types for dropdown
export const fetchPaintTypes = async (surface: string, mode: string) => {
  const res = await api.get("/api/painting/persqft", {
    params: { surface, mode },
  });

  // return clean unified format for dropdown
  return res.data.data.map((p: any) => ({
    id: p.id,
    name: p.paint_type,          // <— backend field
    price_per_sqft: p.rate,      // <— backend field
    base: p.base,
    surface: p.subject_area,
  }));
};

// Calculate painting cost
export const getPaintingCost = async (payload: any) => {
  const res = await api.post("/api/painting/calculate", payload);
  return res.data;
};
