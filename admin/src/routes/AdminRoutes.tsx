import express, { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * 🔒 Admin Authentication Middleware
 */
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No auth token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* ---------------------------------------
   DASHBOARD ROUTE
---------------------------------------- */
router.get("/dashboard", isAdmin, async (req: Request, res: Response) => {
  try {
    const { from, to, city } = req.query as Record<string, string | undefined>;

    const params: any[] = [];
    let whereClause = "WHERE 1=1";

    if (from && to) {
      params.push(from, to);
      whereClause += ` AND b.date BETWEEN $${params.length - 1}::date AND $${params.length}::date`;
    }
    if (city) {
      params.push(city);
      whereClause += ` AND u.city = $${params.length}`;
    }

    // Total users
    const totalUsers = await pool.query(
      `SELECT COUNT(*)::int AS total FROM users WHERE role = 'user'`
    );

    // Total bookings
    const totalBookings = await pool.query(
      `SELECT COUNT(*)::int AS total 
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       ${whereClause}`,
      params
    );

    // Total revenue
    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(p.amount), 0)::numeric AS revenue
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       JOIN users u ON u.id = b.user_id
       WHERE p.payment_status = 'paid'`,
      []
    );

    // Bookings by status
    const bookingsByStatus = await pool.query(
      `SELECT b.status, COUNT(*)::int AS count
       FROM bookings b
       GROUP BY b.status`
    );

    // Revenue graph (last 30 days)
    const graphData = await pool.query(
      `SELECT DATE_TRUNC('day', b.date)::date AS day, COALESCE(SUM(p.amount), 0)::numeric AS revenue
       FROM bookings b
       LEFT JOIN payments p ON p.booking_id = b.id AND p.payment_status = 'paid'
       WHERE b.date >= (CURRENT_DATE - INTERVAL '30 days')
       GROUP BY day
       ORDER BY day ASC`
    );

    res.json({
      success: true,
      totalUsers: totalUsers.rows[0].total,
      totalBookings: totalBookings.rows[0].total,
      totalRevenue: totalRevenue.rows[0].revenue,
      bookingsByStatus: bookingsByStatus.rows,
      graphData: graphData.rows,
    });
  } catch (err) {
    console.error("Admin /dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------
   USERS MANAGEMENT
---------------------------------------- */
router.get("/users", isAdmin, async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "50", city, role } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: any[] = [];
    let query = `SELECT id, name, email, phone, role, city, created_at FROM users WHERE 1=1`;

    if (city) {
      params.push(city);
      query += ` AND city = $${params.length}`;
    }
    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    params.push(Number(limit), offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const users = await pool.query(query, params);
    res.json({ success: true, users: users.rows });
  } catch (err) {
    console.error("GET /admin/users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------
   OTHER ROUTES (SERVICES / PAYMENTS / VENDORS / BOOKINGS)
---------------------------------------- */
// Keep the rest of your routes as in your original file (they are good)
// Example for payments endpoint shown below:

router.get("/payments", isAdmin, async (req, res) => {
  try {
    const { status, page = "1", limit = "50" } = req.query as any;
    const offset = (Number(page) - 1) * Number(limit);

    const params: any[] = [];
    let base = `
      SELECT p.id, p.booking_id, p.user_id, p.amount, p.payment_method, p.payment_status, p.created_at,
             u.name AS user_name, u.email AS user_email
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE 1=1
    `;

    if (status) {
      params.push(status);
      base += ` AND p.payment_status = $${params.length}`;
    }

    params.push(Number(limit), offset);
    base += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(base, params);
    res.json({ success: true, payments: result.rows });
  } catch (err) {
    console.error("GET /admin/payments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
