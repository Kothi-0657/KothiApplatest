import { Router } from "express";
import {
  getPaintingRates,
  calculatePaintingCost,
} from "../controllers/calcPaintingController";

const router = Router();

/* Paint type dropdown */
router.get("/persqft", getPaintingRates);

/* Cost calculation */
router.post("/calculate", calculatePaintingCost);

export default router;
