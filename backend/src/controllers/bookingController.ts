import { Request, Response } from "express";
import pool from "../config/db";

// GET /api/bookings
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.status, b.created_at,
             u.name AS user_name, u.email AS user_email,
             s.name AS service_name, s.category AS service_category,
             v.name AS vendor_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN vendors v ON b.vendor_id = v.id
      ORDER BY b.id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

// PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE bookings SET status=$1 WHERE id=$2", [status, id]);
    res.json({ success: true, message: "Booking status updated" });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// PATCH /api/bookings/:id/vendor
export const assignVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendor_id } = req.body;

    await pool.query("UPDATE bookings SET vendor_id=$1 WHERE id=$2", [vendor_id, id]);
    res.json({ success: true, message: "Vendor assigned to booking" });
  } catch (err) {
    console.error("Error assigning vendor:", err);
    res.status(500).json({ success: false, message: "Failed to assign vendor" });
  }
};
