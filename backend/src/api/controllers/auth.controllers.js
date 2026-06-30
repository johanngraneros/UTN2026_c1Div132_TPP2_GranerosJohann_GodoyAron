/*====================================
    Controladores de autenticacion
====================================*/

import connection from "../database/db.js";;

/////////////////
// Vista Login
export const loginView = async (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introduci tus credenciales"
    });
}


/////////////////////////////////
// Procesamos los datos del login del <form>
export const processLoginInfo = async (req, res) => {

    try {
        // Recibimos los datos de los campos email y password
        // Estos datos, gracias al middleware de parseo de urlencoded ya entran a este endpoint como objetos JS
        const { email, password } = req.body;

        // Evitamos una consulta innecesaria
        if(!email || !password) {
            return res.render("login");            
        }


        // TO DO, mandar error a la vista del login

        // TO DO, Crearemos el modelo de usuarios
        const sql = "SELECT * FROM users where email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);


        // TO DO, mensaje de error si no existe el usuario admin

        // Guardamos el usuario que recibimos en la variable rows
        // id, name, email, password

        const user = rows[0];
        console.table(user);

        // Una vez que recibimos a nuestro usuario admin, vamos a creada una sesion
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        // Ya con la nueva sesion creada, redirigimos al dashboard
        res.redirect("/dashboard/index");


    } catch (error) {
        console.log(error);
    }
}

///////////////////////
// Cerramos la sesion
export const destroyLogin = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log("Error al destruir la sesion: ", error);

            return res.status(500).json({
                message: "Error al cerrar la sesion"
            });
        }

        res.redirect("/login"); // Destruida la sesion exitosamente, redirigimoa al login
    })
}