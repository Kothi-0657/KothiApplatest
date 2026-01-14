import { Router } from "express";
import {
  getPaintingRates,
  createPaintingRate,
  updatePaintingRate,
  deletePaintingRate,
} from "../../controllers/adminpannel/paintingRatesController";

const router = Router();

router.get("/", getPaintingRates);
router.post("/", createPaintingRate);
router.put("/:id", updatePaintingRate);
router.delete("/:id", deletePaintingRate);

export default router;
