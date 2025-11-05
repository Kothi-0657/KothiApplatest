import express from "express";
import pool from "../config/db";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Get all bookings (Admin only)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

// ✅ Create new booking (User)
router.post("/", authenticateToken, async (req: any, res) => {
  const { service_id, date, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, service_id, date, address, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *",
      [req.user.id, service_id, date, address]
    );
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  }
});

// ✅ Assign vendor (Admin only)
router.put("/:id/assign", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { vendor } = req.body;
  try {
    await pool.query("UPDATE bookings SET vendor = $1 WHERE id = $2", [vendor, id]);
    res.json({ success: true, message: "Vendor assigned successfully" });
  } catch (err) {
    console.error("Error assigning vendor:", err);
    res.status(500).json({ success: false, message: "Failed to assign vendor" });
  }
});

export default router;
