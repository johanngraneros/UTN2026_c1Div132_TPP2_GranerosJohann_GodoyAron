/*================================
    Controladores de producto
================================*/

import ProductModels from "../models/product.models.js";

//////////////////////
// Get all products
export const getAllProducts = async (req, res) => {

    // Optimizacion 1: Manejo de errores con try...catch
    try {

        const [rows, fields] = await ProductModels.selectAllProducts();

        // Optimizacion 4: En caso de no haber productos, devolvemos un 404
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        }
    
        res.status(200).json({
            payload: rows,
            total: rows.length // Optimizacion 5: Tambien enviamos el total de productos
        });

    } catch (error) {
        console.log("Error obteniendo los productos: ", error);

        // Optimizacion 2: Devolvemos un codigo de estado 500
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}

//////////////////////
// Get products by id
export const getProductById = async (req, res) => {

    // Optimizacion 1: Manejamos errores con try...catch
    try {
        // Optimizacion 2: Delegamos al middleware validateId recoger el valor y limpiarlo
        //const id = req.params.id; // Obtendo el valor que paso por la URL
    
        const [rows] = await ProductModels.selectProductById(req.id);
    
        // Optimizacion 5: Devolveremos un codigo de estado 404 (Not Found) si no existe ningun producto con ese id
        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontró producto con id ${req.id}`
            });
        }
    
        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log(`Error obteniendo producto con id ${req.id}`, error.message);

        // Optimizacion 3: Devolvemos un error 500
        res.status(500).json({
            message: `Error interno al obtener un producto con id ${req.id}`
        });
    }
}

//////////////////////
// Create new product
export const createProduct = async (req, res) => {

    // Optimizacion 1: Validamos los campos en el middleware validateProduct

    // Optimizacion 2: Manejamos los errores en un bloque try...catch

    try {
        // Gracias al middleware router.use(express.json()); recibo el JSON como objeto JS al que le puedo aplicar el siguiente destrucuring
        console.log(req.body);
    
        
        // Recogemos los datos limpios del body
        const { nombre, descripcion, imagen, categoria, precio } = req.body;

        const [rows] = await ProductModels.insertNewProduct(nombre, descripcion, imagen, categoria, precio);
    
        // Optimizacion 4: En lugar de 201, devolvemos un 201 "Created"
        res.status(201).json({
            message: "Producto creado con exito",
            productId: rows.insertId
        });

    } catch (error) {
        console.log(error);

        // Optimizacion 5: Devolvemos un codigo de estado 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

//////////////////////
// Modify product
export const modifyProduct = async (req, res) => {
    // Optimizacion 1: Manejo de errores con try...catch
    try {
        // Gracias al middleware router.use(express.json()); ahora en lugar de un JSON, nuestro endpoint recibe un objeto
        const { id, nombre, descripcion, imagen, precio, categoria } = req.body;

        // Optimizacion 2: Validamos que vengan los campos necesarios antes de tocar la BBDD
        if (!nombre || !descripcion || !imagen || !precio || !categoria ) {
            return res.status(400).json({
                message: "Todos los campos del formulario son requeridos"
            });
        }
    
       
        const [result] = await ProductModels.updateProduct(nombre, descripcion, imagen, precio, categoria, id);
        
        // Optimizacion 3: Verificamos si realmente se actualizo algo, guardando la respuesta de la BBDD
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No se actualizó ningún campo"
            })
        }
    
        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });


    } catch (error) {
        console.log(error);

        // Optimizacion 4: Devolvemos un codigo de estado 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

//////////////////////
// Delete product
export const removeProduct = async (req, res) => {

    // Optimizacion 1: Manejamos los errores en un bloque try catch
    try {
        // Optimizacion 2: Reaprovechamos el middleware de ruta validateId
        // const id = req.params.id;
    
        await ProductModels.deleteProduct(req.id);
    
        // OPCIONAL, la convencion REST habria que devolver para un DELETE exitoso, un codigo 204 No Content
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente`
        });

    } catch (error) {
        console.log(`Error en peticion DELETE`, error);

        // Optimizacion 3: Enviamos una respuesta 500 al cliente
        res.status(500).json({
            message : "Error interno del servidor"
        });
    }
}