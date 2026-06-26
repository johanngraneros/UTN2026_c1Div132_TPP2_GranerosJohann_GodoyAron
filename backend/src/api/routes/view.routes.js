/*========================
    Rutas de vistas
========================*/

import { Router } from "express";
import { join, __dirname } from "../utils/index.js";
import { createProductView, deleteProductView, getProductView, indexView, updateProductView } from "../controllers/view.controllers.js";

const router = Router();

////////////////////
// Vista principal
router.get("/index", indexView);


////////////////////
// Vista obtener producto
router.get("/consultar", getProductView);


////////////////////
// Vista crear producto
router.get("/crear", createProductView);


////////////////////
// Vista modificar producto
router.get("/modificar", updateProductView);


////////////////////
// Vista eliminar producto
router.get("/eliminar", deleteProductView);

export default router;