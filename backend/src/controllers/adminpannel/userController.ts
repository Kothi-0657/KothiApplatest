// src/controllers/userController.ts

import { Request, Response } from "express";
import pool from "../../config/db";

// ========================================================
//  ✅ GET ALL customers (with booking + payment counts & totals)
// ========================================================

export const getAllCustomers = async (_req: Request, res: Response) => {
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

    const result = await pool.query(query);

    return res.json({
      success: true,
      customers: result.rows
    });

  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


// ========================================================
//  ✅ UPDATE USER STATUS (active / blocked)
// ========================================================

export const updateCustomersStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value"
    });
  }

  try {
    const result = await pool.query(
      `UPDATE customers 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

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

  } catch (error) {
    console.error("❌ Error updating user status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


// ========================================================
//  ✅ DELETE USER (with related bookings + payments)
// ========================================================

export const deleteCustomers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete payments connected to bookings from this user
    await pool.query(
      `DELETE FROM payments 
       WHERE related_booking IN (
         SELECT id FROM bookings WHERE customer_id = $1
       )`,
      [id]
    );

    // Delete bookings
    await pool.query(
      `DELETE FROM bookings WHERE customer_id = $1`,
      [id]
    );

    // Delete user
    const deleteCustomersResult = await pool.query(
      `DELETE FROM customers WHERE id = $1 RETURNING *`,
      [id]
    );

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

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
// ========================================================
// ✅ GET BOOKINGS FOR A SINGLE CUSTOMER
// ========================================================
export const getCustomerBookings = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const query = `
      SELECT 
        b.id,
        b.service_name,
        b.date,
        b.time,
        b.status,
        b.price,
        b.created_at
      FROM bookings b
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, [customerId]);

    return res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching customer bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};
