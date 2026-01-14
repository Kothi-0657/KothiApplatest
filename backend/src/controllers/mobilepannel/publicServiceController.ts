// backend/src/controllers/publicServiceController.ts
import { Request, Response } from "express";
import pool from "../../config/db";

export const listServices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, category, sub_category, name, price, sequence, icon, created_at, updated_at FROM services ORDER BY sequence ASC, created_at DESC"
    );
    return res.json({ success: true, services: result.rows });
  } catch (error) {
    console.error("Error fetching public services:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, category, sub_category, name, price, sequence, icon, created_at, updated_at FROM services WHERE id = $1 LIMIT 1",
      [req.params.id]
    );

    if (rows.length === 0) 
      return res.status(404).json({ success: false, message: "Service not found" });

    return res.json({ success: true, service: rows[0] });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch service" });
  }
};
