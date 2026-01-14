import { Request, Response } from "express";
import pool from "../../config/db";

/* ---------- GET ALL ---------- */
export const getPaintingRates = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM painting_rates ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch rates" });
  }
};

/* ---------- CREATE ---------- */
export const createPaintingRate = async (req: Request, res: Response) => {
  const { paint_brand, base_type, subject_area, rate } = req.body;

  if (!paint_brand || !base_type || !subject_area || !rate) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO painting_rates
       (paint_brand, base_type, subject_area, rate)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [paint_brand, base_type, subject_area, rate]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

/* ---------- UPDATE ---------- */
export const updatePaintingRate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paint_brand, base_type, subject_area, rate } = req.body;

  try {
    const result = await pool.query(
      `UPDATE painting_rates
       SET paint_brand=$1,
           base_type=$2,
           subject_area=$3,
           rate=$4,
           updated_at=NOW()
       WHERE id=$5
       RETURNING *`,
      [paint_brand, base_type, subject_area, rate, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/* ---------- DELETE ---------- */
export const deletePaintingRate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM painting_rates WHERE id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
