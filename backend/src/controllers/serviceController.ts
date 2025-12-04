//backend/src/controllers/serviceController.ts
import { Request, Response } from "express";
import pool from "../config/db";

// 🟩 Get all services
export const listServices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, category, sub_category, name, price, sequence, icon, created_at, updated_at FROM services ORDER BY sequence ASC, created_at DESC"
    );
    res.json({ success: true, services: result.rows });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Error fetching services" });
  }
};

// 🟩 Get single service
export const getService = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, category, sub_category, name, price, sequence, icon, created_at, updated_at FROM services WHERE id = $1 LIMIT 1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service: rows[0] });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ success: false, message: "Error fetching service" });
  }
};

// 🟩 Create new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { category, sub_category, name, price, sequence = 0, icon = null } = req.body;

    if (!category || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, name, and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO services (category, sub_category, name, price, sequence, icon)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [category, sub_category, name, price, sequence, icon]
    );

    res.status(201).json({ success: true, service: result.rows[0] });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ success: false, message: "Error creating service" });
  }
};

// 🟩 Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, sub_category, name, price, sequence = 0, icon = null } = req.body;

    const result = await pool.query(
      `UPDATE services
       SET category = $1, sub_category = $2, name = $3, price = $4, sequence = $5, icon = $6
       WHERE id = $7 RETURNING *`,
      [category, sub_category, name, price, sequence, icon, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service: result.rows[0] });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ success: false, message: "Error updating service" });
  }
};

// 🟩 Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM services WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, message: "Error deleting service" });
  }
};
