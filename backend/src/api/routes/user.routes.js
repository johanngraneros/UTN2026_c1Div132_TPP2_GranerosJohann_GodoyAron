/*========================
    Rutas de usuario
========================*/

import { Router } from "express";
import { createAdminUser } from "../controllers/user.controllers.js";
import { requireLoginApi } from "../middlewares/middlewares.js";
const router = Router();

// POST product
router.post("/", requireLoginApi, createAdminUser); 


// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;