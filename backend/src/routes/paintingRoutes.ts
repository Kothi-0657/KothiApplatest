import express from "express";
import { getPaintTypes } from "../controllers/paintingController";
import { calculatePaintingCost } from "../controllers/calcPaintingController";

const router = express.Router();

router.get("/persqft", getPaintTypes);
router.post("/calculate", calculatePaintingCost);

export default router;
