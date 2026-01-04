import { Request, Response } from "express";

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

    /* ---------- VALIDATION ---------- */
    const carpet = Number(carpetArea);
    const rate = Number(paintRate);

    if (isNaN(carpet) || carpet <= 0 || isNaN(rate) || rate <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid carpetArea and paintRate are required",
      });
    }

    /* ---------- STANDARD SIZES ---------- */
    const DOOR_AREA = 6.5 * 2.5; // 16.25 sqft
    const WINDOW_AREA = 2 * 4;   // 8 sqft

    let paintableArea = 0;

    /* ---------- SURFACE CALCULATION ---------- */
    if (surface === "Wall") {
      // Base wall area
      paintableArea = carpet * 3.5;

      // Remove openings
      paintableArea -= Number(doorCount) * DOOR_AREA;
      paintableArea -= Number(windowCount) * WINDOW_AREA;

      // Add ceiling if selected
      if (ceilingRequired) {
        paintableArea += carpet;
      }

      // Add doors/windows painting separately
      paintableArea += Number(doorCount) * DOOR_AREA;
      paintableArea += Number(windowCount) * WINDOW_AREA;
    }

    if (surface === "Ceiling") {
      // Ceiling only
      paintableArea = carpet;
    }

    /* ---------- SAFETY ---------- */
    if (paintableArea < 0) paintableArea = 0;

    /* ---------- COATS ---------- */
    paintableArea *= Number(coatCount);

    /* ---------- COST ---------- */
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
