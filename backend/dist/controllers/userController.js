"use strict";
// src/controllers/userController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomers = exports.updateCustomersStatus = exports.getAllCustomers = void 0;
const db_1 = __importDefault(require("../config/db"));
// ========================================================
//  ✅ GET ALL customers (with booking + payment counts & totals)
// ========================================================
const getAllCustomers = async (_req, res) => {
    try {
        const query = `
      SELECT 
        u.id AS customers_id,
        u.name,
        u.email,
        u.phone,
        u.status,
        u.created_at,

        COUNT(DISTINCT b.id) AS total_bookings,
        COALESCE(SUM(b.price), 0) AS total_booking_value,

        COUNT(DISTINCT p.id) AS total_payments,
        COALESCE(SUM(p.amount), 0) AS total_payment_amount

      FROM customers u
      LEFT JOIN bookings b ON b.customer_id = u.id
      LEFT JOIN payments p ON p.related_booking = b.id   -- ✅ Correct column

      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `;
        const result = await db_1.default.query(query);
        return res.json({
            success: true,
            customers: result.rows
        });
    }
    catch (error) {
        console.error("❌ Error fetching customers:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getAllCustomers = getAllCustomers;
// ========================================================
//  ✅ UPDATE USER STATUS (active / blocked)
// ========================================================
const updateCustomersStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value"
        });
    }
    try {
        const result = await db_1.default.query(`UPDATE customers 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`, [status, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "customers not found"
            });
        }
        return res.json({
            success: true,
            user: result.rows[0]
        });
    }
    catch (error) {
        console.error("❌ Error updating user status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.updateCustomersStatus = updateCustomersStatus;
// ========================================================
//  ✅ DELETE USER (with related bookings + payments)
// ========================================================
const deleteCustomers = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete payments connected to bookings from this user
        await db_1.default.query(`DELETE FROM payments 
       WHERE related_booking IN (
         SELECT id FROM bookings WHERE customer_id = $1
       )`, [id]);
        // Delete bookings
        await db_1.default.query(`DELETE FROM bookings WHERE customer_id = $1`, [id]);
        // Delete user
        const deleteCustomersResult = await db_1.default.query(`DELETE FROM customers WHERE id = $1 RETURNING *`, [id]);
        if (deleteCustomersResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.json({
            success: true,
            message: "customers deleted successfully"
        });
    }
    catch (error) {
        console.error("❌ Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.deleteCustomers = deleteCustomers;
