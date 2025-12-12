import { Request, Response } from "express";
import pool from "../config/db"; // Make sure you exported pool from db.ts

// =========================
// Get ALL bookings by customer
// =========================
export const getBookingsByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const query = `
      SELECT *
      FROM bookings
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [customerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    return res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Get Customer Bookings Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =========================
// Get SINGLE booking
// =========================
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
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching single booking:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// Get Payment Status of Booking
// =========================
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
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({
      success: true,
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
