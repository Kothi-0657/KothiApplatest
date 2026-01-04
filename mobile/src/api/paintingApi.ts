import api from "./api";

/**
 * Fetch paint types for dropdown
 * Backend source: painting_rates table
 */
export const fetchPaintTypes = async (surface: string, mode: string) => {
  const res = await api.get("/api/painting/persqft", {
    params: {
      subject_area: surface, // 🔴 backend expects subject_area
      base_type: mode,       // 🔴 backend expects base_type
    },
  });

  // ✅ Normalize backend → frontend format
  return res.data.data.map((p: any) => ({
    id: p.id,
    name: p.paint_brand,          // ✅ FIXED
    price_per_sqft: Number(p.rate),
    base: p.base_type,            // ✅ FIXED
    surface: p.subject_area,
  }));
};

/**
 * Calculate painting cost
 * Backend is single source of truth
 */
export const getPaintingCost = async (payload: {
  carpetArea: number;
  doorCount?: number;
  windowCount?: number;
  ceilingRequired?: boolean;
  coatCount?: number;
  surface: string;
  paintRate: number;
}) => {
  const res = await api.post("/api/painting/calculate", payload);
  return res.data;
};
