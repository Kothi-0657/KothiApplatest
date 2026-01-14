import { Request, Response } from "express";
import pool from "../../config/db";

/**
 * GET /api/admin/bookings
 * Returns detailed booking rows with customer, service, vendor, and payment summary.
 */
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const q = `
      SELECT
        b.id,
        b.booking_ref,
        b.scheduled_at,
        b.booked_at,
        b.price,
        b.status,
        b.notes,
        b.address, -- jsonb
        b.metadata,
        row_to_json(c.*) AS customer,
        row_to_json(s.*) AS service,
        row_to_json(v.*) AS vendor,
        -- payment summary (last payment row if exists)
        (SELECT row_to_json(p2.*)
         FROM payments p2
         WHERE p2.related_booking = b.id
         ORDER BY p2.created_at DESC
         LIMIT 1) AS last_payment
      FROM bookings b
      LEFT JOIN customers c ON c.id = b.customer_id
      LEFT JOIN services s ON s.id = b.service_id
      LEFT JOIN vendors v ON v.id = b.vendor_id
      ORDER BY b.created_at DESC;
    `;
    const result = await pool.query(q);
    return res.json({ success: true, bookings: result.rows });
  } catch (err: any) {
    console.error("getAllBookings error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

/**
 * GET /api/admin/bookings/:id
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const q = `
      SELECT
        b.*,
        row_to_json(c.*) AS customer,
        row_to_json(s.*) AS service,
        row_to_json(v.*) AS vendor,
        COALESCE(
          (SELECT jsonb_agg(row_to_json(p2.*))
           FROM payments p2 WHERE p2.related_booking = b.id),
          '[]'::jsonb
        ) AS payments
      FROM bookings b
      LEFT JOIN customers c ON c.id = b.customer_id
      LEFT JOIN services s ON s.id = b.service_id
      LEFT JOIN vendors v ON v.id = b.vendor_id
      WHERE b.id = $1
      LIMIT 1;
    `;
    const result = await pool.query(q, [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error("getBookingById error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch booking" });
  }
};

/**
 * PATCH /api/admin/bookings/:id/status
 */
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ["requested", "pending", "confirmed", "completed", "cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const q = `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await pool.query(q, [status, id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error("updateBookingStatus error:", err);
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

/**
 * PATCH /api/admin/bookings/:id/vendor
 */
export const assignVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendor_id } = req.body;
    if (!vendor_id) return res.status(400).json({ success: false, message: "vendor_id required" });

    const vCheck = await pool.query(`SELECT id FROM vendors WHERE id = $1`, [vendor_id]);
    if (vCheck.rowCount === 0) return res.status(404).json({ success: false, message: "Vendor not found" });

    const q = `UPDATE bookings SET vendor_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await pool.query(q, [vendor_id, id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error("assignVendor error:", err);
    return res.status(500).json({ success: false, message: "Failed to assign vendor" });
  }
};

/**
 * DELETE /api/admin/bookings/:id
 */
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.json({ success: true, message: "Booking deleted" });
  } catch (err: any) {
    console.error("deleteBooking error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};
