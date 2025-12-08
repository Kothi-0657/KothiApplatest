"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.assignVendor = exports.updateBookingStatus = exports.getBookingById = exports.getAllBookings = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * GET /api/admin/bookings
 * Returns detailed booking rows with customer, service, vendor, and payment summary.
 */
const getAllBookings = async (_req, res) => {
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
        const result = await db_1.default.query(q);
        return res.json({ success: true, bookings: result.rows });
    }
    catch (err) {
        console.error("getAllBookings error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};
exports.getAllBookings = getAllBookings;
/**
 * GET /api/admin/bookings/:id
 */
const getBookingById = async (req, res) => {
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
        const result = await db_1.default.query(q, [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        return res.json({ success: true, booking: result.rows[0] });
    }
    catch (err) {
        console.error("getBookingById error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
};
exports.getBookingById = getBookingById;
/**
 * PATCH /api/admin/bookings/:id/status
 */
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const valid = ["requested", "pending", "confirmed", "completed", "cancelled"];
        if (!valid.includes(status))
            return res.status(400).json({ success: false, message: "Invalid status" });
        const q = `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
        const result = await db_1.default.query(q, [status, id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        return res.json({ success: true, booking: result.rows[0] });
    }
    catch (err) {
        console.error("updateBookingStatus error:", err);
        return res.status(500).json({ success: false, message: "Failed to update status" });
    }
};
exports.updateBookingStatus = updateBookingStatus;
/**
 * PATCH /api/admin/bookings/:id/vendor
 */
const assignVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendor_id } = req.body;
        if (!vendor_id)
            return res.status(400).json({ success: false, message: "vendor_id required" });
        const vCheck = await db_1.default.query(`SELECT id FROM vendors WHERE id = $1`, [vendor_id]);
        if (vCheck.rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        const q = `UPDATE bookings SET vendor_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
        const result = await db_1.default.query(q, [vendor_id, id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        return res.json({ success: true, booking: result.rows[0] });
    }
    catch (err) {
        console.error("assignVendor error:", err);
        return res.status(500).json({ success: false, message: "Failed to assign vendor" });
    }
};
exports.assignVendor = assignVendor;
/**
 * DELETE /api/admin/bookings/:id
 */
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`DELETE FROM bookings WHERE id = $1`, [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        return res.json({ success: true, message: "Booking deleted" });
    }
    catch (err) {
        console.error("deleteBooking error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete booking" });
    }
};
exports.deleteBooking = deleteBooking;
