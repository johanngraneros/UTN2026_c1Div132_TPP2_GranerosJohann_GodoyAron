/*================================
    Modelos de producto (Sequelize)
================================*/

import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Product = sequelize.define(
    "Product",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoria: {
            type: DataTypes.ENUM("cajas", "skins"),
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        activo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    
    {
        tableName: "productos",
        timestamps: false,
        freezeTableName: true
    }
);

/////////////////////////////////
// Traer todos los productos
const selectAllProducts = async () => {
    //  'attributes' filtra las columnas. 'raw: true' devuelve JSON puro y plano en vez de una instancia pesada de Sequelize.
    const rows = await Product.findAll({
        where: { activo: 1 }, // si esta activo el producto traigo el resto
        attributes: ["id", "nombre","descripcion", "precio", "imagen", "categoria"],
        raw: true
    });

    return [rows, null];
};

/////////////////////////////////
// Traer todos los productos para admin osea si estan activo o no, no importa
const selectAllProductsAdmin = async () => {
    const rows = await Product.findAll({
        attributes: ["id", "nombre", "descripcion", "precio", "imagen", "categoria", "activo"],
        raw: true
    });

    return [rows, null];
};


/////////////////////////////////
// Traer producto por id
const selectProductById = async (id) => {
    // 'findByPk' (Find By Primary Key) es el método más rápido y directo para buscar por ID.
    const product = await Product.findByPk(id, {
        attributes: ["id", "nombre","descripcion", "precio", "imagen","categoria","activo"],
        raw: true
    });
console.log("Producto encontrado:", product);
    return [product ? [product] : []];
};


/////////////////////////////////
// Crear producto
const insertNewProduct = async (nombre, descripcion, imagen, categoria, precio) => {
    //'.create()' genera el INSERT y te devuelve automáticamente el objeto creado con su nuevo ID asignado.
    const createdProduct = await Product.create({
        nombre,
        descripcion,
        imagen,
        categoria,
        precio
    });
    console.log("Producto creado:", createdProduct);
    return [{ insertId: createdProduct.id }];
};


/////////////////////////////////
// Modificar producto
const updateProduct = async (nombre, descripcion, imagen, precio, categoria,  activo, id) => {
    //'.update()' recibe un objeto con los cambios y un objeto 'where' de condición.
    // Devuelve un array donde el primer elemento es la cantidad de filas afectadas.
    const [affectedRows] = await Product.update(
        { nombre, descripcion, imagen, precio, categoria, activo },
        { where: { id } }
    );

    console.log(`Producto con ID ${id} actualizado. Filas afectadas: ${affectedRows}`);

    return [{ affectedRows }];
};


/////////////////////////////////
// Eliminar producto
const deleteProduct = async (id) => {
    // // '.destroy()' elimina el registro y devuelve la cantidad de filas eliminadas (0 o 1).
    // const deletedRows = await Product.destroy({
    //     where: { id }
    // });
    const [updatedRows] = await Product.update( //baja logica, destructuramos el array [ ] 
     { activo: false },
     { where: { id } }
 );         
    console.log(`Producto con ID ${id} eliminado. Filas afectadas: ${deletedRows}`);

    return [{ affectedRows: deletedRows }];
};

const activateProduct = async (id) => {
    const [updatedRows] = await Product.update(
        { activo: 1 },
        { where: { id } }
    );

    console.log(`Producto con ID ${id} reactivado. Filas afectadas: ${updatedRows}`);

    return [{ affectedRows: updatedRows }];
};



export default {
    selectAllProducts,
    selectAllProductsAdmin,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct,
    activateProduct
};