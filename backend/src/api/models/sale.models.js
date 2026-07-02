/*================================
    Modelos de ventas (Sequelize)
================================*/

import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Sale = sequelize.define(
    "Sale",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        precio_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        tableName: "ventas",
        timestamps: false,
        freezeTableName: true
    }
);

const SaleProduct = sequelize.define(
    "SaleProduct",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_venta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "ventas_productos",
        timestamps: false,
        freezeTableName: true
    }
);

const createSale = async (nombre_usuario, precio_total, productos) => {  
    const sale = await Sale.create({ //insertamos fila en ventas
        nombre_usuario, 
        precio_total
    });

    const detalles = productos.map((producto) => ({ //arma todos los registros para ventas_productos
        id_venta: sale.id,  
        id_producto: producto.id_producto,
        cantidad: producto.cantidad
    }));

    await SaleProduct.bulkCreate(detalles); //inserta todos los productos de la venta juntos

    return {
        id: sale.id, //id nuevo de la venta 
        nombre_usuario: sale.nombre_usuario,
        fecha: sale.fecha,
        precio_total: sale.precio_total,
        productos
    };
};

export default {
    createSale
}; 