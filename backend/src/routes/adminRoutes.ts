// src/routes/adminRoutes.ts

import express, { Request, Response } from "express";
import pool from "../config/db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

/**
 * 📊 Admin Dashboard Stats
 */
router.get("/stats", authenticate, async (_req: Request, res: Response) => {
  try {
    const [customers, vendors, bookings, services, payments, revenue] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM customers"),
      pool.query("SELECT COUNT(*) FROM vendors"),
      pool.query("SELECT COUNT(*) FROM bookings"),
      pool.query("SELECT COUNT(*) FROM services"),
      pool.query("SELECT COUNT(*) FROM payments"),
      pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status='success'")
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers: Number(customers.rows[0].count),
        totalVendors: Number(vendors.rows[0].count),
        totalBookings: Number(bookings.rows[0].count),
        totalServices: Number(services.rows[0].count),
        totalPayments: Number(payments.rows[0].count),
        totalRevenue: Number(revenue.rows[0].total),
      },
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
  }
});

/**
 * 👥 Fetch All Customers
 */
router.get("/customers", authenticate, async (_req: Request, res: Response) => {
  try {
    const customers = await pool.query(`
      SELECT id, full_name AS name, email, phone, status, created_at
      FROM customers
      ORDER BY created_at DESC
    `);

    res.json({ success: true, customers: customers.rows });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch Cusotmers" });
  }
});

/**
 * 🧰 Fetch All Vendors
 */
router.get("/vendors", authenticate, async (_req: Request, res: Response) => {
  try {
    const vendors = await pool.query(`
      SELECT id, name, email, phone, service_category, city, created_at
      FROM vendors
      ORDER BY created_at DESC
    `);

    res.json({ success: true, vendors: vendors.rows });
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
});

/**
 * 📦 Fetch All Bookings
 */
router.get("/bookings", authenticate, async (_req: Request, res: Response) => {
  try {
    const bookings = await pool.query(`
      SELECT 
        b.id,
        c.full_name AS customer_name,
        v.name AS vendor_name,
        s.name AS service_name,
        b.scheduled_at,
        b.address,
        b.status,
        b.created_at
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN vendors v ON b.vendor_id = v.id
      LEFT JOIN services s ON b.service_id = s.id
      ORDER BY b.created_at DESC
    `);

    res.json({ success: true, bookings: bookings.rows });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/**
 * 💳 Fetch All Payments
 */
router.get("/payments", authenticate, async (_req: Request, res: Response) => {
  try {
    const payments = await pool.query(`
      SELECT 
        p.id,
        p.amount,
        p.status,
        p.payment_method,
        p.created_at,
        c.full_name AS customer_name,
        b.id AS booking_id,
        b.scheduled_at AS booking_date
      FROM payments p
      LEFT JOIN customers c ON p.payer_id = c.id
      LEFT JOIN bookings b ON p.related_booking = b.id
      ORDER BY p.created_at DESC
    `);

    res.json({ success: true, payments: payments.rows });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

/**
 * 🛠️ Fetch All Services
 */
router.get("/services", authenticate, async (_req: Request, res: Response) => {
  try {
    const services = await pool.query(`
      SELECT 
        id, 
        name, 
        description,
        category,
        image_url,
        created_at
      FROM services
      ORDER BY created_at DESC
    `);

    res.json({ success: true, services: services.rows });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
});

/**
 * ➕ Add Service
 */
router.post("/services", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description, category, image_url } = req.body;

    if (!name)
      return res.status(400).json({ success: false, message: "Service name is required" });

    const result = await pool.query(
      `INSERT INTO services (name, description, category, image_url, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [name, description, category, image_url]
    );

    res.json({ success: true, message: "Service added successfully", service: result.rows[0] });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ success: false, message: "Failed to add service" });
  }
});

/**
 * ✏️ Update Service
 */
router.put("/services/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category, image_url } = req.body;

    const result = await pool.query(
      `UPDATE services 
       SET name=$1, description=$2, category=$3, image_url=$4, updated_at=NOW()
       WHERE id=$5
       RETURNING *`,
      [name, description, category, image_url, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, message: "Service updated", service: result.rows[0] });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
});

/**
 * ❌ Delete Service
 */
router.delete("/services/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM services WHERE id=$1`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
});

/**
 * 🔍 Search Feature
 */
router.get("/search", authenticate, async (req: Request, res: Response) => {
  try {
    const { type, q } = req.query;

    if (!type || !q)
      return res.status(400).json({ success: false, message: "Missing search parameters" });

    let query = "";

    switch (type) {
      case "customers":
        query = `SELECT id, full_name AS name, email, phone 
                 FROM customers 
                 WHERE full_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1`;
        break;

      case "vendors":
        query = `SELECT id, name, email, phone, city 
                 FROM vendors 
                 WHERE name ILIKE $1 OR city ILIKE $1`;
        break;

      case "services":
        query = `SELECT id, name, description 
                 FROM services 
                 WHERE name ILIKE $1 OR description ILIKE $1`;
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid search type" });
    }

    const result = await pool.query(query, [`%${q}%`]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

export default router;
