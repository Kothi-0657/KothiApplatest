import express from "express";
import pool from "../../config/db"; // Postgres connection
const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, category, sub_category, name, price, sequence, icon FROM services ORDER BY sequence ASC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Add new service
router.post("/", async (req, res) => {
  try {
    const { category, sub_category, name, price, sequence = 0, icon = null } = req.body;

    if (!category || !sub_category || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, name, and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO services (category, sub_category, name, price, sequence, icon)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [category, sub_category, name, price, sequence, icon]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { category, sub_category, name, price, sequence = 0, icon = null } = req.body;

  try {
    const result = await pool.query(
      `UPDATE services 
       SET category = $1, sub_category = $2, name = $3, price = $4, sequence = $5, icon = $6
       WHERE id = $7 RETURNING *`,
      [category, sub_category, name, price, sequence, icon, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// GET all unique subcategories
router.get("/subcategories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT sub_category FROM services WHERE sub_category IS NOT NULL ORDER BY sub_category ASC`
    );
    const subcategories = result.rows.map(row => row.sub_category);
    res.json({ success: true, subcategories });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// GET all unique subcategories
router.get("/subcategories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT sub_category FROM services WHERE sub_category IS NOT NULL ORDER BY sub_category ASC`
    );
    const subcategories = result.rows.map(row => row.sub_category);
    res.json({ success: true, subcategories });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM services WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
