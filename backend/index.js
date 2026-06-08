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

// TO DO -> Middleware para parsear JSON en las solcitudes POST y PUT



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

    const id = req.params.id; // Obtendo el valor que paso por la URL

    const [rows] = await connection.query("SELECT * FROM products where productos.id = ?", [id]);

    // console.log(rows);

    res.status(200).json({  
        payload: rows // Enviamos dentro de payload el listado de productos obtenido desde MySQL
    });
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});