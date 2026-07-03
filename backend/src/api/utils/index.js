// Aca vamos a gestionar la logica para trabajar con archivos y rutas de proyecto

// Importamos los modulos para trabajar con rutas
import { fileURLToPath } from "url"; // Convierte una URL de archivo file: a una ruta del sistema de archivos
import { dirname, join } from "path"; // Dirname devuelve el directorio padre de una ruta y join une segmentos de ruta

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url); 
/* Proporcionamos la URL absoluta del modulo actual, con fileURLToPath convertimos esta URL a una ruta del sistema
    file:///ruta/al/archivo.js      ->      /ruta/al/archivo.js    
*/

// Obtenemos el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); // Salimos de las carpetas utils, api y src
/*
dirname(__filename): Obtiene el directorio del archivo actual
join("../../../") Retrocede tres niveles en la estructura de directorios

*/

export {
    __dirname,
    join
}

/*
Con estas dos nuevas variables, creadas a mano __dirname y filename (En Node.js las teniamos a disposicion con commonjs)
Gracias a estas variables podremos:

    1. Trabajar con rutas absolutas
    2. Resolver correctamente rutas de archivos estativos
    3. Construir rutas para enviar HTML, CSS< imgenes, etc
    4. Evitar errores como "Cannot find module" o rutas rotas en produccion

*/