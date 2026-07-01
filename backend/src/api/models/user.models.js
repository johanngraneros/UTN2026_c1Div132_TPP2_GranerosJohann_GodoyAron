/*================================
    Modelos de usuario
================================*/

import connection from "../database/db.js";


/////////////////////////////////
// Crear producto
const insertAdminUser = (name, email, password) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    // Optimizacion 3: Devolvemos la respuesta en un rows para devolver info util como el id asignado al nuevo producto
    return connection.query(sql, [name, email, password]);
}

export default {
    insertAdminUser
}