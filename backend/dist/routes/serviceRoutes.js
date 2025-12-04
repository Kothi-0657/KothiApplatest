"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Example for POST /api/services
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db")); // or your Postgres connection
const router = express_1.default.Router();
// Get all services
router.get("/", async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT id, category, name, price, sequence, icon FROM services ORDER BY sequence ASC");
        res.json({ success: true, data: result.rows });
    }
    catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// Add new service
router.post("/", async (req, res) => {
    try {
        const { category, name, price, sequence = 0, icon = null } = req.body;
        // Validation
        if (!category || !name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide category, name, and price"
            });
        }
        const result = await db_1.default.query(`INSERT INTO services (category, name, price, sequence, icon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [category, name, price, sequence, icon]);
        res.status(201).json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        console.error("Error adding service:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// modify service
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { category, name, price, sequence = 0, icon = null } = req.body;
    try {
        const result = await db_1.default.query("UPDATE services SET category = $1, name = $2, price = $3, sequence = $4, icon = $5 WHERE id = $6 RETURNING *", [category, name, price, sequence, icon, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
//delete service
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.default.query("DELETE FROM services WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, message: "Service deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting service:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.default = router;
