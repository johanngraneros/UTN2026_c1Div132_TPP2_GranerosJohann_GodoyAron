/*========================
    Archivo de barril
========================*/
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js"

// Eventualmente importaremos y unificaremos en este archivo "de barril" todas las rutas para centralizarlas y exportalas con un onmbre
// import userRoutes from "./user.routes.js"

// Archivo de barril que contiene todas las rutas
export {
    productRoutes,
    viewRoutes,
    authRoutes
    // userRoutes
}