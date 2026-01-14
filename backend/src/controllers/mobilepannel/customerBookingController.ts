import { Request, Response } from "express";
import pool from "../../config/db";

export const getBookingsByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID required" });
    }

    const query = `
      SELECT
        b.id,
        b.booking_ref,
        b.status,
        b.price,
        b.date,
        b.time,
        b.created_at,
        s.name AS service_name
      FROM bookings b
      JOIN services s ON s.id = b.service_id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, [customerId]);

    return res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Get Customer Bookings Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
//customer details with booking and payment summary
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        u.id AS customers_id,
        u.name,
        u.email,
        u.phone,
        u.status,
        u.created_at,

        COUNT(DISTINCT b.id) AS total_bookings,
        COALESCE(SUM(b.price), 0) AS total_booking_value,

        COUNT(DISTINCT p.id) AS total_payments,
        COALESCE(SUM(p.amount), 0) AS total_payment_amount

      FROM customers u
      LEFT JOIN bookings b ON b.customer_id = u.id
      LEFT JOIN payments p ON p.related_booking = b.id   -- ✅ Correct column

      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `;

    const result = await pool.query(query);

    return res.json({
      success: true,
      customers: result.rows
    });

  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
