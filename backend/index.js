/////////////////////
// Importaciones
import express from "express";
const app = express();
import environments from "./src/api/config/environments.js";
import { authRoutes, productRoutes, viewRoutes, userRoutes, saleRoutes } from "./src/api/routes/index.js";
import cors from "cors";
import { loggerURL, middlewareSimpatico } from "./src/api/middlewares/middlewares.js";
import { join, __dirname } from "./src/api/utils/index.js"; // Importamos la configuracion para trabajar con rutas de /utils
import session from "express-session";
import { connectDatabase } from "./src/api/database/sequelize.js";


/////////////////////
// Config

// Estraemos con el destructuring las variables port y session_key
const { port, session_key } = environments;
const PORT = port;

/////////////////////
// Middlewares
app.use(cors()); // Middleware basico para permitir todas las solicitudes

// Middleware para parsear JSON en las solicitudes POST y PUT con el envio fetch
app.use(express.json()); // sin esto, recibe como undefined

// Middleware para parsear informacion enviada de forma nativa con <form>
app.use(express.urlencoded({
    extended: true
}));

app.use(loggerURL);

app.use(middlewareSimpatico);

app.use(express.static(join(__dirname, "src/public"))); // Middleware para servir archivos estaticos
// Gracias a esta configuracion, ya puedo acceder a http://localhost:3000/css/styles.css -> y obtener el archivo css que se encuentra en la ruta "src/public/css/styles.css"

// Configuramos EJS como motor de plantillas
app.set("view engine", "ejs"); // Motor de vistas
app.set("views", join(__dirname, "src/views")); // Desde la raiz del servidor apuntamos a / + /src + /views


app.use(session({
    secret: session_key, // Firma las cookies para evitar manipulacion (debe ser una contraseña segura)
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));

/////////////////////
// Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

//////////
// Rutas
app.use("/api/products", productRoutes); // Rutas de producto
app.use("/dashboard", viewRoutes) // Rutas de vista
app.use("/login", authRoutes); // Rutas de autenticacion
app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes); //Rutas de ventas POST http://localhost:3000/api/sales

await connectDatabase();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
