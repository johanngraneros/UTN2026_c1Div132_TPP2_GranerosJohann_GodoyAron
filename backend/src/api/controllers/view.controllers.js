/*================================
    Controladores de vistas
================================*/

import ProductModels from "../models/product.models.js";
import { join, __dirname } from "../utils/index.js";


////////////////////
// Vista principal
export const indexView = async (req, res) => {
    try {

        const [rows] = await ProductModels.selectAllProducts();

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
// Vista crear usuario
export const createUserView = (req, res) => {
    res.render("postUser", {
        title: "Crear usuario admin",
        about: "Crear usuario admin"
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

////////////////////
// Vista carrito
export const carritoView = (req, res) => {
    res.render("carrito", {
        title: "Carrito",
        about: "Mi carrito"
    });
};