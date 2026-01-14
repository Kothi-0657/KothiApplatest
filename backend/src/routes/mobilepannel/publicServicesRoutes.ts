// backend/src/routes/publicServicesRoutes.ts
import express from "express";
import { listServices, getService } from "../../controllers/mobilepannel/publicServiceController";

const router = express.Router();

// Public (no auth)
router.get("/", listServices);
router.get("/:id", getService);

export default router;
