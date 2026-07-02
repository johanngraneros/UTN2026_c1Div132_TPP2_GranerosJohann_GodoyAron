import express from "express";
import { createSale } from "../controllers/sale.controllers.js";

const router = express.Router();

router.post("/", createSale);

export default router;