"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getService = exports.listServices = void 0;
const db_1 = __importDefault(require("../config/db"));
// 🟩 Get all services
const listServices = async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT * FROM services ORDER BY id DESC");
        res.json({ success: true, services: result.rows });
    }
    catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ success: false, message: "Error fetching services" });
    }
};
exports.listServices = listServices;
// 🟩 Get single service
const getService = async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT * FROM services WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, service: result.rows[0] });
    }
    catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({ success: false, message: "Error fetching service" });
    }
};
exports.getService = getService;
// 🟩 Create new service
const createService = async (req, res) => {
    try {
        const { name, description, category_id, price } = req.body;
        // ✅ Basic validation
        if (!name || !description || !category_id || !price) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, description, category_id, price) are required",
            });
        }
        const result = await db_1.default.query(`INSERT INTO services (name, description, category_id, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [name, description, category_id, price]);
        res.status(201).json({ success: true, service: result.rows[0] });
    }
    catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ success: false, message: "Error creating service" });
    }
};
exports.createService = createService;
// 🟩 Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category_id, price } = req.body;
        const result = await db_1.default.query(`UPDATE services
       SET name = $1, description = $2, category_id = $3, price = $4
       WHERE id = $5 RETURNING *`, [name, description, category_id, price, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, service: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ success: false, message: "Error updating service" });
    }
};
exports.updateService = updateService;
// 🟩 Delete service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.query("DELETE FROM services WHERE id = $1", [id]);
        res.json({ success: true, message: "Service deleted" });
    }
    catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ success: false, message: "Error deleting service" });
    }
};
exports.deleteService = deleteService;
