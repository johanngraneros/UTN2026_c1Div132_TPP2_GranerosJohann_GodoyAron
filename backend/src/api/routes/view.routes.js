/*========================
    Rutas de vistas
========================*/

import { Router } from "express";
import { join, __dirname } from "../utils/index.js";
import { createProductView, createUserView, deleteProductView, getProductView, indexView, updateProductView, carritoView } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

// Con el middleware requireLogin redirigimos a login para proteger la vista

////////////////////
// Vista principal
router.get("/index", requireLogin, indexView); 


////////////////////
// Vista obtener producto
router.get("/consultar", requireLogin, getProductView);


////////////////////
// Vista crear producto
router.get("/crear", requireLogin, createProductView);

////////////////////
// Vista crear usuario admin
router.get("/crear-usuario", requireLogin, createUserView);


////////////////////
// Vista modificar producto
router.get("/modificar", requireLogin, updateProductView);


////////////////////
// Vista eliminar producto
router.get("/eliminar", requireLogin, deleteProductView);

router.get("/carrito", requireLogin, carritoView);

export default router;