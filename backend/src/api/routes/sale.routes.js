import express from "express";
import { createSale } from "../controllers/sale.controllers.js";
import { validateSale } from "../middlewares/middlewares.js";

const router = express.Router();

router.post("/", validateSale, createSale);

export default router;