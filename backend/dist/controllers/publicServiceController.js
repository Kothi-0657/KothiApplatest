"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = exports.listServices = void 0;
const db_1 = __importDefault(require("../config/db"));
const listServices = async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT id, category, name, price, sequence, icon, created_at, updated_at FROM services ORDER BY sequence ASC, created_at DESC");
        return res.json({ success: true, services: result.rows });
    }
    catch (error) {
        console.error("Error fetching public services:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
};
exports.listServices = listServices;
const getService = async (req, res) => {
    try {
        const { rows } = await db_1.default.query("SELECT id, category, name, price, sequence, icon, created_at, updated_at FROM services WHERE id = $1 LIMIT 1", [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Service not found" });
        return res.json({ success: true, service: rows[0] });
    }
    catch (error) {
        console.error("Error fetching service:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch service" });
    }
};
exports.getService = getService;
