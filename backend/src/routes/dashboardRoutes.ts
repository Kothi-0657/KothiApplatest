import express from "express";
import pool from "../config/db"; // your PostgreSQL pool

const router = express.Router();

/* =======================
   📊 ADMIN DASHBOARD API
   ======================= */
router.get("/", async (req, res) => {
  const { from, to } = req.query;

  try {
    // Apply date filters only if received
    let dateFilterBookings = "";
    let dateFilterPayments = "";

    if (from && to) {
      dateFilterBookings = `WHERE b.created_at BETWEEN '${from}' AND '${to}'`;
      dateFilterPayments = `WHERE p.paid_at BETWEEN '${from}' AND '${to}' AND p.status = 'completed'`;
    } else {
      dateFilterPayments = `WHERE p.status = 'completed'`;
    }

    /* 1️⃣ Total Customers */
    const customers = await pool.query(
      `SELECT COUNT(*) AS total FROM customers`
    );

    /* 2️⃣ Total Bookings */
    const bookings = await pool.query(
      `SELECT COUNT(*) AS total FROM bookings`
    );

    /* 3️⃣ Total Revenue (successful payments only) */
    const revenue = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total
       FROM payments p
       ${dateFilterPayments}`
    );

    /* 4️⃣ Revenue Trend (Group by Day) */
    const graph = await pool.query(
      `SELECT 
          TO_CHAR(p.paid_at, 'YYYY-MM-DD') AS day,
          SUM(p.amount) AS revenue
       FROM payments p
       WHERE p.status = 'completed'
       GROUP BY day
       ORDER BY day ASC`
    );

    /* 5️⃣ City Distribution */
    const cityData = await pool.query(
      `SELECT 
          c.city,
          COUNT(b.id) AS bookings,
          COALESCE(SUM(p.amount), 0) AS revenue
       FROM customers c
       LEFT JOIN bookings b ON b.customer_id = c.id
       LEFT JOIN payments p ON p.booking_id = b.id 
       GROUP BY c.city
       ORDER BY bookings DESC`
    );

    return res.json({
      totalCustomers: Number(customers.rows[0].total),
      totalBookings: Number(bookings.rows[0].total),
      totalRevenue: Number(revenue.rows[0].total),
      graphData: graph.rows,
      cityDistribution: cityData.rows
    });

  } catch (err: any) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
      error: err.message
    });
  }
});

export default router;
