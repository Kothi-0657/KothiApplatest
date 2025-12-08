import { Request, Response } from "express";
import pool from "../config/db";

export const getBookingsByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const query = `
      SELECT 
        b.id,
        b.customer_id,
        b.service,
        b.date,
        b.time,
        b.status,
        b.price,
        b.created_at
      FROM bookings b
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, [customerId]);

    res.json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getSingleBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT *
      FROM bookings
      WHERE id = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error("Error fetching single booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT 
        p.status,
        p.transaction_id,
        p.amount,
        p.updated_at
      FROM payments p
      WHERE p.booking_id = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({
      success: true,
      payment: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
