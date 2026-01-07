import { Request, Response } from "express";
import pool from "../config/db"; // <-- your pg pool / db connector

/* =========================================================
   GET PAINT TYPES (for dropdown)
   URL: /api/painting/persqft
   ========================================================= */
export const getPaintingRates = async (req: Request, res: Response) => {
  try {
    const { subject_area, base_type } = req.query;

    if (!subject_area || !base_type) {
      return res.status(400).json({
        success: false,
        message: "subject_area and base_type are required",
      });
    }

    console.log("Paint list params:", subject_area, base_type);

    const result = await pool.query(
      `
      SELECT
        id,
        paint_brand,
        rate,
        subject_area,
        base_type
      FROM painting_rates
      WHERE LOWER(subject_area) = LOWER($1)
        AND LOWER(base_type) = LOWER($2)
        AND is_active = true
      ORDER BY rate ASC
      `,
      [subject_area, base_type]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Fetch paint rates error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   CALCULATE PAINTING COST
   URL: /api/painting/calculate
   ========================================================= */
export const calculatePaintingCost = async (req: Request, res: Response) => {
  try {
    const {
      carpetArea,
      doorCount = 0,
      windowCount = 0,
      ceilingRequired = false,
      coatCount = 1,
      surface = "Wall",
      paintRate,
    } = req.body;

    const carpet = Number(carpetArea);
    const rate = Number(paintRate);

    if (isNaN(carpet) || carpet <= 0 || isNaN(rate) || rate <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid carpetArea and paintRate are required",
      });
    }

    const DOOR_AREA = 6.5 * 2.5; // 16.25 sqft
    const WINDOW_AREA = 2 * 4;  // 8 sqft

    let paintableArea = 0;

    if (surface === "Wall") {
      paintableArea = carpet * 3.5;

      paintableArea -= Number(doorCount) * DOOR_AREA;
      paintableArea -= Number(windowCount) * WINDOW_AREA;

      if (ceilingRequired) {
        paintableArea += carpet;
      }
    }

    if (surface === "Ceiling") {
      paintableArea = carpet;
    }

    if (paintableArea < 0) paintableArea = 0;

    paintableArea *= Number(coatCount);

    const totalCost = paintableArea * rate;

    return res.json({
      success: true,
      paintableArea: paintableArea.toFixed(2),
      totalCost: totalCost.toFixed(2),
    });
  } catch (error) {
    console.error("Painting calculation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
