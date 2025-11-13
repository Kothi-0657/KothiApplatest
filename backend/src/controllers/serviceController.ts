// backend/src/controllers/serviceController.ts
import { Request, Response } from "express";
import pool from "../config/db";

// 🟩 Get all services
export const listServices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id DESC");
    res.json({ success: true, services: result.rows });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Error fetching services" });
  }
};

// 🟩 Get single service
export const getService = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM services WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, service: result.rows[0] });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ success: false, message: "Error fetching service" });
  }
};

// 🟩 Create new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, category_id, price } = req.body;

    // ✅ Basic validation
    if (!name || !description || !category_id || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, category_id, price) are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO services (name, description, category_id, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, category_id, price]
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
    const { name, description, category_id, price } = req.body;

    const result = await pool.query(
      `UPDATE services
       SET name = $1, description = $2, category_id = $3, price = $4
       WHERE id = $5 RETURNING *`,
      [name, description, category_id, price, id]
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
    await pool.query("DELETE FROM services WHERE id = $1", [id]);
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, message: "Error deleting service" });
  }
};
