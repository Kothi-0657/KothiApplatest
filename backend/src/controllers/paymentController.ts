import { Request, Response } from "express";
import pool from "../config/db";

/* ---------------------------------------------------------
   CREATE PAYMENT  (Admin Manual Creation)
   POST /api/admin/payments
---------------------------------------------------------- */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      payment_ref,
      direction,
      amount,
      currency,
      status,
      method,
      transaction_id,
      related_booking,
      payer_id,
      payee_id,
      metadata,
    } = req.body;

    if (!direction || !amount) {
      return res.status(400).json({
        success: false,
        message: "direction and amount are required",
      });
    }

    const q = `
      INSERT INTO payments (
        payment_ref,
        direction,
        amount,
        currency,
        status,
        method,
        transaction_id,
        related_booking,
        payer_id,
        payee_id,
        metadata,
        created_at,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        COALESCE($11, '{}'::jsonb),
        NOW(), NOW()
      )
      RETURNING *;
    `;

    const vals = [
      payment_ref || null,
      direction,
      amount,
      currency || "INR",
      status || "pending",
      method || null,
      transaction_id || null,
      related_booking || null,
      payer_id || null,
      payee_id || null,
      metadata ? JSON.stringify(metadata) : null,
    ];

    const result = await pool.query(q, vals);
    return res.status(201).json({ success: true, payment: result.rows[0] });
  } catch (err: any) {
    console.error("createPayment error:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Payment reference already exists",
      });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to create payment" });
  }
};

/* ---------------------------------------------------------
   GET ALL PAYMENTS
   GET /api/admin/payments
---------------------------------------------------------- */
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const q = `
  SELECT
    p.*,
    b.booking_ref,
    b.scheduled_at AS booking_date,
    (SELECT json_build_object('id', c.id, 'name', c.name, 'phone', c.phone)
       FROM customers c WHERE c.id = p.payer_id) AS payer,
    (SELECT json_build_object('id', v.id, 'name', v.company_name, 'phone', v.phone)
       FROM vendors v WHERE v.id = p.payee_id) AS payee
  FROM payments p
  LEFT JOIN bookings b ON b.id = p.related_booking
  ORDER BY p.created_at DESC;
`;

    const result = await pool.query(q);
    return res.json({ success: true, payments: result.rows });
  } catch (err: any) {
    console.error("getAllPayments error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch payments" });
  }
};

/* ---------------------------------------------------------
   GET PAYMENT BY ID
   GET /api/admin/payments/:id
---------------------------------------------------------- */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const q = `
      SELECT
        p.*,
        b.booking_ref,
        (SELECT full_name FROM customers WHERE id = p.payer_id) AS payer_name,
        (SELECT full_name FROM vendors WHERE id = p.payee_id) AS payee_name
      FROM payments p
      LEFT JOIN bookings b ON b.id = p.related_booking
      WHERE p.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(q, [req.params.id]);

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    return res.json({ success: true, payment: result.rows[0] });
  } catch (err: any) {
    console.error("getPaymentById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment" });
  }
};

/* ---------------------------------------------------------
   UPDATE PAYMENT
   PUT /api/admin/payments/:id
---------------------------------------------------------- */
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { amount, status, method, transaction_id, metadata } = req.body;

    const q = `
      UPDATE payments SET
        amount = COALESCE($1, amount),
        status = COALESCE($2, status),
        method = COALESCE($3, method),
        transaction_id = COALESCE($4, transaction_id),
        metadata = COALESCE($5, metadata),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    const vals = [
      amount || null,
      status || null,
      method || null,
      transaction_id || null,
      metadata ? JSON.stringify(metadata) : null,
      req.params.id,
    ];

    const result = await pool.query(q, vals);

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    return res.json({ success: true, payment: result.rows[0] });
  } catch (err: any) {
    console.error("updatePayment error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update payment" });
  }
};

/* ---------------------------------------------------------
   DELETE PAYMENT
   DELETE /api/admin/payments/:id
---------------------------------------------------------- */
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM payments WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    return res.json({ success: true, message: "Payment deleted" });
  } catch (err: any) {
    console.error("deletePayment error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete payment" });
  }
};
