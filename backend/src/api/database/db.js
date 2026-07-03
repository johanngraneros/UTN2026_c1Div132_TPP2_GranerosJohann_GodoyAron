// Importamos el modulo mysql2 en modo promesas, para poder hacer peticiones asincronas a la BBDD -> Haremos consultas usando async/await
import mysql2 from "mysql2/promise";

// Importamos la informacion de la conexion a la BBDD
import environments from "../config/environments.js";

// Extraemos solo el objeto database
const { database } = environments;

// Creamos la conexion a la BBDD (un pool de conexiones)
const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;

