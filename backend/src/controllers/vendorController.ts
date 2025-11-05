import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";

/**
 * 👥 Get all vendors (Admin use)
 */
export const getAllVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await pool.query(
      `SELECT id, name, email, phone, city, service_category, created_at 
       FROM vendors ORDER BY created_at DESC`
    );
    res.json({ success: true, vendors: vendors.rows });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
};

/**
 * 👤 Get vendor by ID
 */
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, phone, city, service_category, created_at 
       FROM vendors WHERE id = $1`,
      [id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    res.json({ success: true, vendor: result.rows[0] });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vendor" });
  }
};

/**
 * ➕ Create new vendor
 */
export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, city, service_category } = req.body;

    if (!name || !email || !phone || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await pool.query("SELECT * FROM vendors WHERE email = $1", [email]);
    if (existing.rows.length)
      return res.status(400).json({ success: false, message: "Vendor already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO vendors (name, email, phone, password, city, service_category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, city, service_category, created_at`,
      [name, email, phone, hashed, city, service_category]
    );

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ success: false, message: "Failed to create vendor" });
  }
};

/**
 * ✏️ Update vendor
 */
export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, city, service_category } = req.body;

    const result = await pool.query(
      `UPDATE vendors 
       SET name = $1, email = $2, phone = $3, city = $4, service_category = $5 
       WHERE id = $6 RETURNING id, name, email, phone, city, service_category, created_at`,
      [name, email, phone, city, service_category, id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    res.json({ success: true, message: "Vendor updated successfully", vendor: result.rows[0] });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ success: false, message: "Failed to update vendor" });
  }
};

/**
 * 🗑️ Delete vendor
 */
export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM vendors WHERE id = $1", [id]);
    res.json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ success: false, message: "Failed to delete vendor" });
  }
};
