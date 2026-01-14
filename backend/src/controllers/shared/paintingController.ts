import { Request, Response } from "express";
import pool from "../../config/db";

export const getPaintTypes = async (req: Request, res: Response) => {
  try {
    const { surface, mode } = req.query;

    if (!surface || !mode) {
      return res.status(400).json({
        success: false,
        message: "surface and mode are required parameters",
      });
    }

    // Query DB
    const query = `
      SELECT id, paint_type, base, subject_area, rate
      FROM painting_rates
      WHERE subject_area = $1
        AND base = $2
      ORDER BY rate ASC
    `;

    const values = [surface, mode];

    const result = await pool.query(query, values);

    return res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error: any) {
    console.error("Error fetching paint types:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
