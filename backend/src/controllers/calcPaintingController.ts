import { Request, Response } from "express";

export const calculatePaintingCost = async (req: Request, res: Response) => {
  try {
    const {
      carpetArea,
      doorCount = 0,
      windowCount = 0,
      ceilingRequired = false,
      paintRate,   // price_per_sqft from selected paint type
    } = req.body;

    if (!carpetArea || !paintRate) {
      return res.status(400).json({
        success: false,
        message: "carpetArea and paintRate are required",
      });
    }

    const carpet = parseFloat(carpetArea);

    // Standard areas
    const DOOR_AREA = 6.5 * 2.5; // 16.25 sqft
    const WINDOW_AREA = 2 * 4;   // 8 sqft

    // Formula
    let paintableArea = carpet * 3.5; // wall multiplier

    paintableArea -= Number(doorCount) * DOOR_AREA;
    paintableArea -= Number(windowCount) * WINDOW_AREA;

    // Add ceiling area
    if (ceilingRequired) {
      paintableArea += carpet; // ceiling = carpet area
    }

    // Painting additions
    paintableArea += Number(doorCount) * 16.25; 
    paintableArea += Number(windowCount) * 8;

    // Total cost
    const totalCost = paintableArea * paintRate;

    return res.json({
      success: true,
      paintableArea: paintableArea.toFixed(2),
      totalCost: totalCost.toFixed(2),
    });

  } catch (error: any) {
    console.error("Painting calculation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
