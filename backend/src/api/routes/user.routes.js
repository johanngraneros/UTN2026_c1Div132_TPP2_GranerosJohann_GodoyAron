/*========================
    Rutas de usuario
========================*/

import { Router } from "express";
import { createAdminUser } from "../controllers/user.controllers.js";
const router = Router();

// POST product
router.post("/", createAdminUser);


// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;