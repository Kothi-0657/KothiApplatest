import api from "./api";

/**
 * Fetch paint types for dropdown
 * Backend source: painting_rates table
 */
export const fetchPaintTypes = async (surface: string, mode: string) => {
  // ✅ normalize values
  const subject_area =
    surface === "Wall" ? "wall" : "ceiling";

  const base_type =
    mode === "Fresh Painting" ? "fresh" : "repaint";

  const res = await api.get("/api/calculate-painting/persqft", {
    params: {
      subject_area,
      base_type,
    },
  });

  if (!res.data?.data) return [];

  return res.data.data.map((p: any) => ({
    id: String(p.id),
    name: p.paint_brand,
    price_per_sqft: Number(p.rate),
    surface: p.subject_area,
    base: p.base_type,
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
