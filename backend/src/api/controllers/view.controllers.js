/*================================
    Controladores de vistas
================================*/

import ProductModels from "../models/product.models.js";
import { join, __dirname } from "../utils/index.js";


////////////////////
// Vista principal
export const indexView = async (req, res) => {
    try {

        const [rows] = await ProductModels.selectAllProductsAdmin();

        res.render("index", {
            title: "Dashboard",
            about: "Nuestros productos",
            productsArray: rows
        });

    } catch (error) {
        console.log("Error obteniendo informacion", error.message);

        res.status(500).json({
            message: "Error interno obteniendo la informacion"
        });

    }
}


////////////////////
// Vista obtener producto
export const getProductView = (req, res) => {
    res.render("get", {
        title: "Consultar",
        about: "Consultar producto por id: "
    });
}


////////////////////
// Vista crear producto
export const createProductView = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear producto"
    });
}


////////////////////
// Vista actualizar producto
export const updateProductView = (req, res) => {
    res.render("put", {
        title: "Modificar",
        about: "Consultar producto por id: "
    });
}


////////////////////
// Vista eliminar producto
export const deleteProductView = (req, res) => {
    res.render("delete", {
        title: "Eliminar",
        about: "Consultar producto por id: "
    });
}



