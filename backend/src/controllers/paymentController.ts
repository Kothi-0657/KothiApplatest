import { Request, Response } from "express";
import pool from "../config/db";

// ✅ Create new payment
export const createPayment = async (req: Request, res: Response) => {
  const { booking_id, user_id, amount, payment_method, payment_status, transaction_id } = req.body;

  if (!booking_id || !user_id || !amount || !payment_method) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [booking_id, user_id, amount, payment_method, payment_status || "pending", transaction_id || null]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get payments by user
export const getPaymentsByUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching user payments:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get payment by booking
export const getPaymentByBooking = async (req: Request, res: Response) => {
  const { booking_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM payments WHERE booking_id = $1", [booking_id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error fetching booking payment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payment_status, transaction_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE payments SET payment_status = $1, transaction_id = $2 WHERE id = $3 RETURNING *",
      [payment_status, transaction_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM payments WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
