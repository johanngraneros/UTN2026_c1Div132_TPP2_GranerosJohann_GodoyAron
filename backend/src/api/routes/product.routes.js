/*========================
    Rutas de producto
========================*/

import { Router } from "express";
import { middlewareBostero, validateId, validateProduct, requireLoginApi} from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();


// GET all products
router.get("/", getAllProducts); //cliente necesita ver los productos, entonces no lo protegemos con requireLoginApi


// GET by id
router.get("/:id", validateId, getProductById); //cliente necesita ver los productos, entonces no lo protegemos con requireLoginApi


// POST product
router.post("/", requireLoginApi, middlewareBostero ,validateProduct, createProduct);


// UPDATE product
router.put("/", requireLoginApi, modifyProduct);


// DELETE product
router.delete("/:id", requireLoginApi, validateId, removeProduct);   


// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;