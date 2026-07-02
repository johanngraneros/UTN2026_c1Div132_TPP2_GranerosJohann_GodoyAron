/*================================
    Modelos de producto
================================*/

import connection from "../database/db.js";


/////////////////////////////////
// Traer todos los productos
const selectAllProducts = () => {
  
    const sql = "SELECT id, nombre, precio, imagen, categoria, descripcion FROM productos";
    return connection.query(sql);
}



/////////////////////////////////
// Traer producto por id
const selectProductById = (id) => {
    const sql = "SELECT id, nombre, precio, imagen, categoria FROM productos where productos.id = ?";
    return connection.query(sql, [id]);
}



/////////////////////////////////
// Crear producto
const insertNewProduct = (nombre, imagen, categoria, precio  ) => {
    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio ) VALUES (?, ?, ?, ?)";
    
    return connection.query(sql, [nombre, imagen, categoria, precio ]);
}



/////////////////////////////////
// Modificar producto
const updateProduct = (nombre, imagen, precio, categoria, id) => {
    const sql = "UPDATE productos SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?";
    
    // Guardamos el resultado de la conexion que nos bridara info para la optimziacion
    return connection.query(sql, [nombre, imagen, precio, categoria, id]);
}



/////////////////////////////////
// Eliminar producto
const deleteProduct = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";

    return connection.query(sql, [id]);
}


export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}