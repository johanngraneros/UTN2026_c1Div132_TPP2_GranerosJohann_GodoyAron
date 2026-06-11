/////////////////////
// Importaciones
import express from "express";
const app = express();
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";

/////////////////////
// Config
const PORT = environments.port;

/////////////////////
// Middlewares
app.use(cors()); // Middleware basico para permitir todas las solicitudes

app.use(express.static("public"));  // Permite que el navegador acceda a los archivos de la carpeta public
// Ejemplo: public/imagenes/revolutionCase.png se accede como /imagenes/revolutionCase.png

// Middleware logger para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
app.use((req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
});

// Middleware para parsear JSON en las solcitudes POST y PUT

app.use(express.json()); // sin esto, recibe como undefined

/////////////////////
// Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

// GET all products
app.get("/api/products", async (req, res) => {
    // const sql = "SELECT * FROM products";
    // aca traere la conexion para tirarle sentencias
    const [rows, fields] = await connection.query("SELECT * FROM productos");

    // console.log(rows);

    res.status(200).json({
        payload: rows
    });
});

// GET by id
app.get("/api/products/:id", async (req, res) => {
    //OBJETIVO A REALIZAR : hay que hacer un try catch x si no hay producto con ese id

    const id = req.params.id; // Obtendo el valor que paso por la URL

    const [rows] = await connection.query("SELECT * FROM productos where productos.id = ?", [id]); // " ? = placeholder"

    // console.log(rows);

    res.status(200).json({  
        payload: rows // Enviamos dentro de payload el listado de productos obtenido desde MySQL
    });
});

// POST

app.post("/api/products", async (req, res)=>{
   
    console.log(req.body);

    const { name, image, category, price } = req.body;

    console.log(name);

    if (!nombre, !precio){
        res.status(400).json({
            mensaje : "nombre y precio faltantes"
        })
    }

    const sqlInsert = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (? , ? , ? , ?)";

    await connection.query(sql, [nombre, imagen, categoria, precio]);

    res.status(200).json({
        message: "Producto creado con exito"
    });
        
    });

// UPDATE product
app.put("/api/products", async (req, res) => {
    const { id, name, image, price, category } = req.body;

    const sql = "UPDATE productos SET nombre = ?, imagen = ?, precio = ?, categoria = ?, WHERE id = ?";

    await connection.query(sql, [nombre, imagen, precio, categoria, id]);

    return res.status(200).json({
        message: "Producto actualizado correctamente"
    });
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
    const id = req.params.id;

    await connection.query("DELETE FROM productos WHERE id = ?", [id]);

    res.status(200).json({
        message: `Producto con id ${id} eliminado exitosamente`
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});