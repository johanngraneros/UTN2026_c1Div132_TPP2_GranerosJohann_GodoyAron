/*========================
    Archivo de barril
========================*/
// Centralizamos en este archivo "de barril" todas las rutas y las exportamos con un nombre
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"

// Archivo de barril que contiene todas las rutas
export {
    productRoutes,
    viewRoutes,
    authRoutes,
    userRoutes
}