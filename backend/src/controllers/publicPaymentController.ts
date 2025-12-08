import { Request, Response } from "express";
import pool from "../config/db";

/* ---------------------------------------------------------
   GET MY PAYMENTS (Mobile)
   GET /api/payments/my
---------------------------------------------------------- */
export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log("JWT user id:", userId); // <-- Add this

    const q = `
      SELECT
        p.*,
        b.booking_ref,
        b.scheduled_at AS booking_date
      FROM payments p
      LEFT JOIN bookings b ON b.id = p.related_booking
      WHERE p.payer_id = $1
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(q, [userId]);

    console.log("Payments fetched:", result.rows.length); // <-- Add this

    return res.json({
      success: true,
      payments: result.rows,
    });
  } catch (err) {
    console.error("getMyPayments error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch payments" });
  }
};


/* ---------------------------------------------------------
   GET A SINGLE PAYMENT DETAILS
   GET /api/payments/my/:id
---------------------------------------------------------- */
export const getMyPaymentById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const q = `
      SELECT
        p.*,
        b.booking_ref,
        b.scheduled_at AS booking_date
      FROM payments p
      LEFT JOIN bookings b ON b.id = p.related_booking
      WHERE p.id = $1 AND p.payer_id = $2
      LIMIT 1;
    `;

    const result = await pool.query(q, [req.params.id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({ success: true, payment: result.rows[0] });
  } catch (err) {
    console.error("getMyPaymentById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment details" });
  }
};
