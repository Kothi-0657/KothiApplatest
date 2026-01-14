import { Request, Response } from "express";
import pool from "../../config/db";

/** GET ALL VENDORS */
export const getAllVendors = async (_req: Request, res: Response) => {
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
    const result = await pool.query(q);
    return res.json({ success: true, vendors: result.rows });
  } catch (err: any) {
    console.error("getAllVendors error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
};

/** GET VENDOR BY ID */
export const getVendorById = async (req: Request, res: Response) => {
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
    const result = await pool.query(q, [req.params.id]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.json({ success: true, vendor: result.rows[0] });
  } catch (err: any) {
    console.error("getVendorById error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vendor" });
  }
};

/** ADD VENDOR */
export const addVendor = async (req: Request, res: Response) => {
  try {
    const { company_name, contact_name, phone, email, gstin, address, services_offered, metadata } =
      req.body;

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

    const result = await pool.query(q, vals);
    return res.status(201).json({ success: true, vendor: result.rows[0] });
  } catch (err: any) {
    console.error("addVendor error:", err);
    return res.status(500).json({ success: false, message: "Failed to add vendor" });
  }
};

/** UPDATE VENDOR */
export const updateVendor = async (req: Request, res: Response) => {
  try {
    const {
      company_name,
      contact_name,
      phone,
      email,
      gstin,
      address,
      services_offered,
      rating,
      status,
      metadata,
    } = req.body;

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

    const result = await pool.query(q, vals);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.json({ success: true, vendor: result.rows[0] });
  } catch (err: any) {
    console.error("updateVendor error:", err);
    return res.status(500).json({ success: false, message: "Failed to update vendor" });
  }
};

/** DELETE VENDOR */
export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM vendors WHERE id = $1`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.json({ success: true, message: "Vendor deleted" });
  } catch (err: any) {
    console.error("deleteVendor error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete vendor" });
  }
};
