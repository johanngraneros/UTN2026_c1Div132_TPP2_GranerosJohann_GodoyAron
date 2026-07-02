/*========================
    Middlewares
========================*/

// Middleware logger (de aplicacion) para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
const loggerURL = (req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
};

/* 
// Middleware para parsear JSON en las solcitudes POST y PUT
app.use(express.json()); // sin esto, recibe como undefined

Para un eventual envio nativo de datos con HTML <form>
app.use(
    express.urlencoded({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 5000,
        type: "application/x-www-form-urlencoded",
    })
);*/


// Middleware de ruta (se aplica en ciertos endpoints)
const validateId = (req, res, next) => {
    const id = Number(req.params.id); // Transformo el id a un numbero

    // Si no es un entero o es 0 o inferior, devuelvo una respuesta 400 (Bad Request)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El id debe ser un numero entero positivo"
        });
    }

    // Incorporo el id a la req
    req.id = id;

    next(); // Damos paso al siguiente middleware o a procesar la respuesta
}


// Middleware de ruta para validar los campos de un formulario POST
const categoriasValidas = ["cajas", "skins"];
const validateProduct = (req, res, next) => {

    // Recogemos los datos del body
    const { nombre, precio, categoria } = req.body;

    // Array vacio de errores
    const errores = [];

    // Validamos si se recibieron todos del body
    if (!nombre || !categoria || !precio) {
        errores.push("Datos invalidos, asegurate de incluir todas las categorias");
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if(!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    };

    // Detectamos si existe algun error en la lista y lo devolvemos en un 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos", errores
        });
    }

    next();
}

// Middleware de aplicacion (se ejecuta en todas las peticiones de la aplicacion)
const middlewareSimpatico = (req, res, next) => {
    console.log("Holis! Soy un middleware que te desea un buen dia por cada peticion");

    // Sin next() nunca damos paso a la response y por tanto la peticion HTTP nunca terminó
    next();
}


// Middleware de ruta (se ejecuta en ciertas rutas)
const middlewareBostero = (req, res, next) => {
    // Este middleware va a hinchar por mi cada vez que creo un producto
    console.log("Producto creado");
    next();
}


// Middleware simple de proteccion de rutas
const requireLogin = (req, res, next) => {

    // Un login exitoso crea una sesion -> comprobar si existe esa sesion

    // Si no existe sesion redirigimos a la pantalla de login
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}


export {
    loggerURL,
    validateId,
    validateProduct,
    middlewareSimpatico,
    middlewareBostero,
    requireLogin
}