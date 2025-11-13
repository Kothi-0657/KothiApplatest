import express, { Request, Response } from "express";
import pool from "../config/db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

/**
 * ✅ Admin Dashboard – Summary Stats
 */
router.get("/stats", authenticate, async (_req: Request, res: Response) => {
  try {
    const [users, vendors, bookings, services, payments, revenue] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM vendors"),
      pool.query("SELECT COUNT(*) FROM bookings"),
      pool.query("SELECT COUNT(*) FROM services"),
      pool.query("SELECT COUNT(*) FROM payments"),
      pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status='success'"),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers: Number(users.rows[0].count),
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
 * 👥 Fetch all users
 */
router.get("/users", authenticate, async (_req: Request, res: Response) => {
  try {
    const users = await pool.query(
      `SELECT id, name, email, phone, role, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, users: users.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

/**
 * 🧰 Fetch all vendors
 */
router.get("/vendors", authenticate, async (_req: Request, res: Response) => {
  try {
    const vendors = await pool.query(
      `SELECT id, name, email, phone, service_category, city, created_at 
       FROM vendors 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, vendors: vendors.rows });
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
});

/**
 * 🧾 Fetch all bookings
 */
router.get("/bookings", authenticate, async (_req: Request, res: Response) => {
  try {
    const bookings = await pool.query(`
      SELECT 
        b.id, 
        u.name AS user_name, 
        v.name AS vendor_name,
        s.name AS service_name, 
        b.date, 
        b.address, 
        b.status, 
        b.created_at 
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
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
 * 💳 Fetch all payments
 */
router.get("/payments", authenticate, async (_req: Request, res: Response) => {
  try {
    const payments = await pool.query(`
      SELECT 
        p.id, 
        p.amount, 
        p.status, 
        p.created_at,
        u.name AS user_name,
        b.id AS booking_id,
        b.date AS booking_date
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, payments: payments.rows });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

/**
 * 🛠️ Fetch all services
 */
router.get("/services", authenticate, async (_req: Request, res: Response) => {
  try {
    const services = await pool.query(
      `SELECT id, name, description, price, category, image_url, created_at 
       FROM services 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, services: services.rows });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
});

/**
 * ➕ Add new service
 */
router.post("/services", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    const result = await pool.query(
      `INSERT INTO services (name, description, price, category, image_url, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name, description, price, category, image_url]
    );

    res.json({ success: true, message: "Service added successfully", service: result.rows[0] });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ success: false, message: "Failed to add service" });
  }
});

/**
 * ✏️ Update existing service
 */
router.put("/services/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;

    const result = await pool.query(
      `UPDATE services 
       SET name=$1, description=$2, price=$3, category=$4, image_url=$5, updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [name, description, price, category, image_url, id]
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
 * ❌ Delete service
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
 * 🔍 Search users / vendors / services by query param
 */
router.get("/search", authenticate, async (req: Request, res: Response) => {
  try {
    const { type, q } = req.query;

    if (!type || !q) {
      return res.status(400).json({ success: false, message: "Missing search parameters" });
    }

    let query = "";
    switch (type) {
      case "users":
        query = `SELECT id, name, email, phone FROM users WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1`;
        break;
      case "vendors":
        query = `SELECT id, name, email, phone, city FROM vendors WHERE name ILIKE $1 OR city ILIKE $1`;
        break;
      case "services":
        query = `SELECT id, name, description, price FROM services WHERE name ILIKE $1 OR description ILIKE $1`;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid search type" });
    }

    const result = await pool.query(query, [`%${q}%`]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error searching:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

export default router;
