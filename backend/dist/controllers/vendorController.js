"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.updateVendor = exports.addVendor = exports.getVendorById = exports.getAllVendors = void 0;
const db_1 = __importDefault(require("../config/db"));
/** GET ALL VENDORS */
const getAllVendors = async (_req, res) => {
    try {
        const q = `
      SELECT
        v.*,
        COALESCE(
          (
            SELECT jsonb_agg(json_build_object('id', s.id, 'name', s.name))
            FROM services s
            WHERE s.id = ANY(v.services_offered)
          ),
        '[]'::jsonb) AS services_offered_details
      FROM vendors v
      ORDER BY v.created_at DESC;
    `;
        const result = await db_1.default.query(q);
        return res.json({ success: true, vendors: result.rows });
    }
    catch (err) {
        console.error("getAllVendors error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch vendors" });
    }
};
exports.getAllVendors = getAllVendors;
/** GET VENDOR BY ID */
const getVendorById = async (req, res) => {
    try {
        const q = `
      SELECT
        v.*,
        COALESCE(
          (
            SELECT jsonb_agg(json_build_object('id', s.id, 'name', s.name))
            FROM services s
            WHERE s.id = ANY(v.services_offered)
          ),
        '[]'::jsonb) AS services_offered_details
      FROM vendors v
      WHERE v.id = $1
      LIMIT 1;
    `;
        const result = await db_1.default.query(q, [req.params.id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        return res.json({ success: true, vendor: result.rows[0] });
    }
    catch (err) {
        console.error("getVendorById error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch vendor" });
    }
};
exports.getVendorById = getVendorById;
/** ADD VENDOR */
const addVendor = async (req, res) => {
    try {
        const { company_name, contact_name, phone, email, gstin, address, services_offered, metadata } = req.body;
        if (!company_name)
            return res.status(400).json({ success: false, message: "company_name required" });
        const q = `
      INSERT INTO vendors (
        company_name, contact_name, phone, email, gstin,
        address, services_offered, metadata, created_at
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6::jsonb, $7::uuid[], $8::jsonb, NOW()
      )
      RETURNING *;
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
        const result = await db_1.default.query(q, vals);
        return res.status(201).json({ success: true, vendor: result.rows[0] });
    }
    catch (err) {
        console.error("addVendor error:", err);
        return res.status(500).json({ success: false, message: "Failed to add vendor" });
    }
};
exports.addVendor = addVendor;
/** UPDATE VENDOR */
const updateVendor = async (req, res) => {
    try {
        const { company_name, contact_name, phone, email, gstin, address, services_offered, rating, status, metadata, } = req.body;
        const { id } = req.params;
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
            id,
        ];
        const result = await db_1.default.query(q, vals);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        return res.json({ success: true, vendor: result.rows[0] });
    }
    catch (err) {
        console.error("updateVendor error:", err);
        return res.status(500).json({ success: false, message: "Failed to update vendor" });
    }
};
exports.updateVendor = updateVendor;
/** DELETE VENDOR */
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`DELETE FROM vendors WHERE id = $1`, [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        return res.json({ success: true, message: "Vendor deleted" });
    }
    catch (err) {
        console.error("deleteVendor error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete vendor" });
    }
};
exports.deleteVendor = deleteVendor;
