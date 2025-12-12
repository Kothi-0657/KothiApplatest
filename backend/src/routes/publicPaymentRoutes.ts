import { Router } from "express";
import pool from "../config/db";

const router = Router();

// 📌 GET payments for a customer
router.get("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.*, 
        s.name as service_name
       FROM payments p
       JOIN bookings b ON p.related_booking = b.id
       JOIN services s ON s.id = b.service_id
       WHERE b.customer_id = $1
       ORDER BY p.created_at DESC`,
      [customerId]
    );

    res.json({ success: true, payments: result.rows });
  } catch (error) {
    console.error("Customer Payment Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
