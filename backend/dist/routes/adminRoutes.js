"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * ===========================
 *  Admin Routes (clean file)
 *  Mount as: app.use('/api', adminRoutes)
 * ===========================
 */
/**
 * 📊 Admin Dashboard Stats
 */
router.get("/stats", auth_1.authenticate, async (_req, res) => {
    try {
        const [customers, vendors, bookings, services, payments, revenue] = await Promise.all([
            db_1.default.query("SELECT COUNT(*) FROM customers"),
            db_1.default.query("SELECT COUNT(*) FROM vendors"),
            db_1.default.query("SELECT COUNT(*) FROM bookings"),
            db_1.default.query("SELECT COUNT(*) FROM services"),
            db_1.default.query("SELECT COUNT(*) FROM payments"),
            db_1.default.query("SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM payments WHERE status = 'success'")
        ]);
        res.json({
            success: true,
            stats: {
                totalCustomers: Number(customers.rows[0].count),
                totalVendors: Number(vendors.rows[0].count),
                totalBookings: Number(bookings.rows[0].count),
                totalServices: Number(services.rows[0].count),
                totalPayments: Number(payments.rows[0].count),
                totalRevenue: Number(revenue.rows[0].total || 0),
            },
        });
    }
    catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
    }
});
/**
 * ===========================
 *  CUSTOMERS
 * ===========================
 */
// GET all customers
router.get("/customers", auth_1.authenticate, async (_req, res) => {
    try {
        const customers = await db_1.default.query(`
      SELECT id, full_name AS name, email, phone, status, created_at
      FROM customers
      ORDER BY created_at DESC
    `);
        res.json({ success: true, customers: customers.rows });
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
});
// Update customer status (e.g. active/inactive)
router.put("/customers/:id/status", auth_1.authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const result = await db_1.default.query(`UPDATE customers SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, customer: result.rows[0] });
    }
    catch (err) {
        console.error("Error updating customer status:", err);
        res.status(500).json({ success: false, message: "Failed to update customer status" });
    }
});
// Delete customer
router.delete("/customers/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`DELETE FROM customers WHERE id = $1`, [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, message: "Customer deleted" });
    }
    catch (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ success: false, message: "Failed to delete customer" });
    }
});
/**
 * ===========================
 *  BOOKINGS
 * ===========================
 */
// GET all bookings (with joined customer/service/vendor and last payment)
router.get("/bookings", auth_1.authenticate, async (_req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT
        b.id,
        b.booking_ref,
        b.scheduled_at,
        b.booked_at,
        b.price,
        b.status,
        b.notes,
        b.address,
        b.metadata,
        row_to_json(c.*) AS customer,
        row_to_json(s.*) AS service,
        row_to_json(v.*) AS vendor,
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
    `);
        res.json({ success: true, bookings: rows });
    }
    catch (err) {
        console.error("adminRoutes /bookings error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
});
// GET single booking by id (with payments array)
router.get("/bookings/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT
        b.*,
        row_to_json(c.*) AS customer,
        row_to_json(s.*) AS service,
        row_to_json(v.*) AS vendor,
        COALESCE((
          SELECT jsonb_agg(row_to_json(p2.*))
          FROM payments p2
          WHERE p2.related_booking = b.id
        ), '[]'::jsonb) AS payments
      FROM bookings b
      LEFT JOIN customers c ON c.id = b.customer_id
      LEFT JOIN services s ON s.id = b.service_id
      LEFT JOIN vendors v ON v.id = b.vendor_id
      WHERE b.id = $1
      LIMIT 1;
      `, [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        res.json({ success: true, booking: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes /bookings/:id error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
});
// PATCH booking status
router.patch("/bookings/:id/status", auth_1.authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const valid = ["requested", "pending", "confirmed", "completed", "cancelled"];
        if (!valid.includes(status))
            return res.status(400).json({ success: false, message: "Invalid status" });
        const { rows } = await db_1.default.query(`UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        res.json({ success: true, booking: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes patch booking status error:", err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
});
// PATCH assign/change vendor for booking
router.patch("/bookings/:id/vendor", auth_1.authenticate, async (req, res) => {
    try {
        const { vendor_id } = req.body;
        if (!vendor_id)
            return res.status(400).json({ success: false, message: "vendor_id required" });
        const v = await db_1.default.query(`SELECT id FROM vendors WHERE id = $1`, [vendor_id]);
        if (v.rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        const { rows } = await db_1.default.query(`UPDATE bookings SET vendor_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [vendor_id, req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        res.json({ success: true, booking: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes patch booking vendor error:", err);
        res.status(500).json({ success: false, message: "Failed to assign vendor" });
    }
});
// DELETE booking
router.delete("/bookings/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rowCount } = await db_1.default.query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);
        if (rowCount === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        res.json({ success: true, message: "Booking deleted" });
    }
    catch (err) {
        console.error("adminRoutes delete booking error:", err);
        res.status(500).json({ success: false, message: "Failed to delete booking" });
    }
});
/**
 * ===========================
 *  VENDORS
 * ===========================
 */
// GET all vendors (expand services_offered -> service id/name)
router.get("/vendors", auth_1.authenticate, async (_req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT v.*,
        COALESCE((
          SELECT jsonb_agg(json_build_object('id', s.id, 'name', s.name))
          FROM services s WHERE s.id = ANY(v.services_offered)
        ), '[]'::jsonb) AS services_offered_details
      FROM vendors v
      ORDER BY v.created_at DESC;
    `);
        res.json({ success: true, vendors: rows });
    }
    catch (err) {
        console.error("adminRoutes /vendors error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch vendors" });
    }
});
// GET single vendor
router.get("/vendors/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT v.*,
        COALESCE((
          SELECT jsonb_agg(json_build_object('id', s.id, 'name', s.name))
          FROM services s WHERE s.id = ANY(v.services_offered)
        ), '[]'::jsonb) AS services_offered_details
      FROM vendors v
      WHERE v.id = $1
      LIMIT 1;
      `, [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        res.json({ success: true, vendor: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes /vendors/:id error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch vendor" });
    }
});
// CREATE vendor
router.post("/vendors", auth_1.authenticate, async (req, res) => {
    try {
        const { company_name, contact_name, phone, email, gstin, address, services_offered, metadata } = req.body;
        if (!company_name)
            return res.status(400).json({ success: false, message: "company_name required" });
        const q = `
      INSERT INTO vendors (
        company_name, contact_name, phone, email, gstin, address, services_offered, metadata, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6::jsonb, $7::uuid[], $8::jsonb, NOW()
      ) RETURNING *;
    `;
        const vals = [
            company_name,
            contact_name || null,
            phone || null,
            email || null,
            gstin || null,
            address ? JSON.stringify(address) : null,
            services_offered || [],
            metadata ? JSON.stringify(metadata) : null,
        ];
        const { rows } = await db_1.default.query(q, vals);
        res.status(201).json({ success: true, vendor: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes post vendors error:", err);
        res.status(500).json({ success: false, message: "Failed to add vendor" });
    }
});
// UPDATE vendor (full)
router.put("/vendors/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { company_name, contact_name, phone, email, gstin, address, services_offered, rating, status, metadata } = req.body;
        const q = `
      UPDATE vendors SET
        company_name = COALESCE($1, company_name),
        contact_name = COALESCE($2, contact_name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        gstin = COALESCE($5, gstin),
        address = COALESCE($6::jsonb, address),
        services_offered = COALESCE($7::uuid[], services_offered),
        rating = COALESCE($8, rating),
        status = COALESCE($9, status),
        metadata = COALESCE($10::jsonb, metadata),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *;
    `;
        const vals = [
            company_name ?? null,
            contact_name ?? null,
            phone ?? null,
            email ?? null,
            gstin ?? null,
            address ? JSON.stringify(address) : null,
            services_offered || null,
            rating ?? null,
            status ?? null,
            metadata ? JSON.stringify(metadata) : null,
            req.params.id,
        ];
        const { rows } = await db_1.default.query(q, vals);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        res.json({ success: true, vendor: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes put vendors error:", err);
        res.status(500).json({ success: false, message: "Failed to update vendor" });
    }
});
// Update vendor status only (convenience endpoint used by frontend)
router.put("/vendors/:id/status", auth_1.authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const { rows } = await db_1.default.query(`UPDATE vendors SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        res.json({ success: true, vendor: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes put vendors status error:", err);
        res.status(500).json({ success: false, message: "Failed to update vendor status" });
    }
});
// DELETE vendor
router.delete("/vendors/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rowCount } = await db_1.default.query(`DELETE FROM vendors WHERE id = $1`, [req.params.id]);
        if (rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        res.json({ success: true, message: "Vendor deleted" });
    }
    catch (err) {
        console.error("adminRoutes delete vendors error:", err);
        res.status(500).json({ success: false, message: "Failed to delete vendor" });
    }
});
/**
 * ===========================
 *  PAYMENTS (aligned to payments table)
 * ===========================
 */
// GET all payments (with booking_ref + payer summary + payee summary)
router.get("/payments", auth_1.authenticate, async (_req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT
        p.*,
        b.booking_ref,
        b.scheduled_at AS booking_date,
        (SELECT json_build_object('id', c.id, 'name', c.name, 'phone', c.phone) FROM customers c WHERE c.id = p.payer_id) AS payer,
        (SELECT json_build_object('id', v.id, 'name', v.company_name, 'phone', v.phone) FROM vendors v WHERE v.id = p.payee_id) AS payee
      FROM payments p
      LEFT JOIN bookings b ON p.related_booking = b.id
      ORDER BY p.created_at DESC;
    `);
        res.json({ success: true, payments: rows });
    }
    catch (err) {
        console.error("adminRoutes /payments error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
});
// GET payment by id
router.get("/payments/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.default.query(`SELECT p.*, b.booking_ref FROM payments p LEFT JOIN bookings b ON p.related_booking = b.id WHERE p.id = $1 LIMIT 1`, [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Payment not found" });
        res.json({ success: true, payment: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes /payments/:id error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch payment" });
    }
});
// CREATE payment
router.post("/payments", auth_1.authenticate, async (req, res) => {
    try {
        const { payment_ref, direction, amount, currency, status, method, transaction_id, related_booking, payer_id, payee_id, metadata, } = req.body;
        if (!direction || amount == null) {
            return res.status(400).json({ success: false, message: "direction and amount are required" });
        }
        const q = `
      INSERT INTO payments (
        payment_ref, direction, amount, currency, status, method, transaction_id,
        related_booking, payer_id, payee_id, metadata, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, COALESCE($11,'{}'::jsonb), NOW(), NOW())
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
        const { rows } = await db_1.default.query(q, vals);
        res.status(201).json({ success: true, payment: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes post payments error:", err);
        if (err.code === "23505") {
            return res.status(400).json({ success: false, message: "Payment reference already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to add payment" });
    }
});
// Update payment (full)
router.put("/payments/:id", auth_1.authenticate, async (req, res) => {
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
            amount ?? null,
            status ?? null,
            method ?? null,
            transaction_id ?? null,
            metadata ? JSON.stringify(metadata) : null,
            req.params.id,
        ];
        const { rows } = await db_1.default.query(q, vals);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Payment not found" });
        res.json({ success: true, payment: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes put payments error:", err);
        res.status(500).json({ success: false, message: "Failed to update payment" });
    }
});
// Update payment status only (convenience)
router.put("/payments/:id/status", auth_1.authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const { rows } = await db_1.default.query(`UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Payment not found" });
        res.json({ success: true, payment: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes put payments status error:", err);
        res.status(500).json({ success: false, message: "Failed to update payment status" });
    }
});
// Verify payment (set status to success + store transaction id) - convenience
router.put("/payments/:id/verify", auth_1.authenticate, async (req, res) => {
    try {
        const { transaction_id } = req.body;
        const { rows } = await db_1.default.query(`UPDATE payments SET status = 'success', transaction_id = COALESCE($1, transaction_id), updated_at = NOW() WHERE id = $2 RETURNING *`, [transaction_id || null, req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Payment not found" });
        res.json({ success: true, payment: rows[0] });
    }
    catch (err) {
        console.error("adminRoutes put payments verify error:", err);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
});
// DELETE payment
router.delete("/payments/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rowCount } = await db_1.default.query(`DELETE FROM payments WHERE id = $1`, [req.params.id]);
        if (rowCount === 0)
            return res.status(404).json({ success: false, message: "Payment not found" });
        res.json({ success: true, message: "Payment deleted" });
    }
    catch (err) {
        console.error("adminRoutes delete payments error:", err);
        res.status(500).json({ success: false, message: "Failed to delete payment" });
    }
});
/**
 * ===========================
 *  SERVICES (keep as-is, cleaned)
 * ===========================
 */
// GET services
router.get("/services", auth_1.authenticate, async (_req, res) => {
    try {
        const { rows } = await db_1.default.query(`
      SELECT id, name, description, category, image_url, created_at
      FROM services
      ORDER BY created_at DESC
    `);
        res.json({ success: true, services: rows });
    }
    catch (err) {
        console.error("adminRoutes /services error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
});
// CREATE service
router.post("/services", auth_1.authenticate, async (req, res) => {
    try {
        const { name, description, category, image_url } = req.body;
        if (!name)
            return res.status(400).json({ success: false, message: "Service name is required" });
        const { rows } = await db_1.default.query(`INSERT INTO services (name, description, category, image_url, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *`, [name, description || null, category || null, image_url || null]);
        res.json({ success: true, message: "Service added successfully", service: rows[0] });
    }
    catch (err) {
        console.error("Error adding service:", err);
        res.status(500).json({ success: false, message: "Failed to add service" });
    }
});
// UPDATE service
router.put("/services/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, image_url } = req.body;
        const { rows } = await db_1.default.query(`UPDATE services SET name = $1, description = $2, category = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *`, [name, description || null, category || null, image_url || null, id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, message: "Service not found" });
        res.json({ success: true, message: "Service updated", service: rows[0] });
    }
    catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ success: false, message: "Failed to update service" });
    }
});
// DELETE service
router.delete("/services/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db_1.default.query(`DELETE FROM services WHERE id = $1`, [id]);
        if (rowCount === 0)
            return res.status(404).json({ success: false, message: "Service not found" });
        res.json({ success: true, message: "Service deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting service:", err);
        res.status(500).json({ success: false, message: "Failed to delete service" });
    }
});
/**
 * ===========================
 *  SEARCH
 * ===========================
 */
router.get("/search", auth_1.authenticate, async (req, res) => {
    try {
        const { type, q } = req.query;
        if (!type || !q)
            return res.status(400).json({ success: false, message: "Missing search parameters" });
        let query = "";
        switch (type) {
            case "customers":
                query = `SELECT id, name AS name, email, phone FROM customers WHERE full_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1`;
                break;
            case "vendors":
                // vendor display columns: company_name/contact_name/phone/email/city/status
                query = `SELECT id, company_name, contact_name, phone, email, status FROM vendors WHERE company_name ILIKE $1 OR contact_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1`;
                break;
            case "services":
                query = `SELECT id, name, description FROM services WHERE name ILIKE $1 OR description ILIKE $1`;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid search type" });
        }
        const result = await db_1.default.query(query, [`%${q}%`]);
        res.json({ success: true, data: result.rows });
    }
    catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ success: false, message: "Search failed" });
    }
});
exports.default = router;
