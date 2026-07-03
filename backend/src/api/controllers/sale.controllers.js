import SaleModels from "../models/sale.models.js";

export const createSale = async (req, res) => {
    try {
        const { nombre_usuario, precio_total, productos } = req.body;

        if (!nombre_usuario || !precio_total || !productos || productos.length === 0) {
            return res.status(400).json({
                message: "Faltan datos para registrar la venta"
            });
        }

        const sale = await SaleModels.createSale(
            nombre_usuario,
            precio_total,
            productos
        );

        res.status(201).json({
            message: "Venta registrada correctamente",
            payload: sale
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al registrar la venta"
        });
    }
};