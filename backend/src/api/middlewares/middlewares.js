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
const validateProduct = (req, res, next) => { //Antes de crear productos uso un middleware de validación. Valido campos requeridos, cat permitida y precio mayor a cero. Si hay errores, paro todo y mando status 400.”

    // Recogemos los datos del body
    const { nombre, descripcion, imagen, precio, categoria } = req.body;

    // Array vacio de errores
    const errores = [];

    // Validamos si se recibieron todos del body
    if (!nombre || !descripcion || !imagen ||  precio == null || precio === "" || !categoria ) {
        errores.push("Todos los campos del producto son requeridos");
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

     if (typeof descripcion !== "string" || descripcion.trim().length < 5) {
        errores.push("La descripcion debe tener al menos 5 caracteres");
    }

    if (typeof imagen !== "string" || imagen.trim().length < 5) {
        errores.push("La imagen debe ser una URL o ruta valida");
    }

    if (Number(precio) <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    }

    // Detectamos si existe algun error en la lista y lo devolvemos en un 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos", errores
        });
    }

    req.body.precio = Number(precio);

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

const requireLoginApi = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "No autorizado. Tenes que iniciar sesion"
        });
    }

    next();
};

const validateSale = (req, res, next) => { 

    //Validamos que venga el nombre del comprador, que total sea mayor a cero y que productos tenga al menos un elemento. desp recorro los productos con un for y valido que cada uno tenga id y cantidad.

    const { nombre_usuario, precio_total, productos } = req.body;

    const errores = [];

    if (!nombre_usuario || typeof nombre_usuario !== "string" || nombre_usuario.trim().length < 2) {
        errores.push("El nombre de usuario es requerido");
    }

    if (precio_total === undefined || precio_total === null || precio_total === "" || Number(precio_total) <= 0) {
        errores.push("El precio total debe ser mayor a 0");
    }

    if (!productos || productos.length === 0) {
        errores.push("La venta debe tener al menos un producto");
    } else {
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];

            if (!producto.id_producto || Number(producto.id_producto) <= 0) {
                errores.push("Cada producto debe tener un id_producto valido");
            }

            if (!producto.cantidad || Number(producto.cantidad) <= 0) {
                errores.push("Cada producto debe tener una cantidad mayor a 0");
            }
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos para registrar la venta",
            errores
        });
    }

    req.body.precio_total = Number(precio_total);

    next();
};


export {
    loggerURL,
    validateId,
    validateProduct,
    validateSale,
    middlewareSimpatico,
    middlewareBostero,
    requireLogin,
    requireLoginApi
}