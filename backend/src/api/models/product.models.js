/*================================
    Modelos de producto
================================*/

import connection from "../database/db.js";


/////////////////////////////////
// Traer todos los productos
const selectAllProducts = () => {
    // Optimizacion 3: Sacamos * para evitar traer columnas innecesarias -> Mas eficiente en memoria y peticion de red. Ademas separamos la sentencia en una variable
    const sql = "SELECT id, nombre, precio, imagen FROM productos";
    return connection.query(sql);
}



/////////////////////////////////
// Traer producto por id
const selectProductById = (id) => {
    // Optimizacion 4: Guardamos la consulta sql en una variable y la optimizamos pidiendo solo los campos requereidos
    const sql = "SELECT id, nombre, precio, imagen FROM productos where products.id = ?";
    return connection.query(sql, [id]);
}



/////////////////////////////////
// Crear producto
const insertNewProduct = (nombre, imagen, categoria, precio  ) => {
    const sql = "INSERT INTO products (nombre, imagen, categoria, precio ) VALUES (?, ?, ?, ?)";
    
    // Optimizacion 3: Devolvemos la respuesta en un rows para devolver info util como el id asignado al nuevo producto
    return connection.query(sql, [nombre, imagen, categoria, precio ]);
}



/////////////////////////////////
// Modificar producto
const updateProduct = (nombre, imagen, precio, categoria, id) => {
    const sql = "UPDATE products SET name = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?";
    
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