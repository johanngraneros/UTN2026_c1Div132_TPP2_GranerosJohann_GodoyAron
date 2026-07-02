const contenedorProductos = document.getElementById("contenedor-productos");
const postProductForm = document.getElementById("postProduct-form");
const postUserForm = document.getElementById("postUser-form");

// Optimizacion 1: Validamos previamente los datos en el cliente
function validarFormulario(data) {
    const errores = [];

    if (!data.nombre || data.nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.precio || isNaN(data.precio) || Number(data.precio) < 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!data.categoria) {
        errores.push("Debe seleccionarse una categoria");
    }
    if (!data.descripcion) {
        errores.push("Debe haber una descripcion");
    }

    return errores;
}


// Optimizacion 2: Mensaje de exito o error al crear el producto
// TO DO, le pasamos el errores.length
function mostrarMensaje(tipo, mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

//////////////////////
// Enviando usuario
// postUserForm.addEventListener("submit", async event => {
//     event.preventDefault(); // Evitamos el envio por defecto del formulario

//     // Obtenemos la data del formulario
//     const formData = new FormData(event.target);

//     // Convertimos nuestro objeto formdata en un objeto literal de JavaScript
//     const data = Object.fromEntries(formData.entries());
//     console.table(data);

//     const jsonData = JSON.stringify(data);
//     console.log(jsonData);

//     try {
        
//         const response = await fetch("http://localhost:3000/api/users/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: jsonData
//         });

//         console.log(response);
//         const result = await response.json();

//         if (!response.ok) {
//             mostrarMensaje("error", result.message);
//             return;
//         }

//         // Mostramos el mensaje de exito y reseteamos el form
//         const infoUser = `${result.message} con id ${result.userId}`
//         mostrarMensaje("exito", infoUser)
//         console.log(infoUser);

//         event.target.reset();

//     } catch (error) {
//         console.error("Error al enviar los datos: ", error);
//     }

// });

//////////////////////
// Enviando producto
postProductForm.addEventListener("submit", async event => {
    
    event.preventDefault();
    
    const formularioAlta = event.target;

    // Obtenemos la data del formulario
    const formData = new FormData(formularioAlta);

    // Parseamos el objeto FormData a un objeto JS normal para enviarlo en el body con JSON.stringify()
    const data = Object.fromEntries(formData.entries());
    
    console.log(data); 
    
    // Optimizacion 3: Parseamos price antes de enviarlo, FormData devuelve todo como strings y el back espera que price sea numero
    data.precio = Number(data.precio);


    // Hacemos la llamada a la funcion para validar datos del formulario
    const errores = validarFormulario(data);
    if (errores.length > 0) {
        // TO DO, enviarle errores.length
        mostrarMensaje("error", errores);
        return; 
    }

    try {
        // Aca guardamos la respuesta cruda del servidor que es la que nos proporciona el fetch una vez que la promesa devolvio Fulfilled
        const response = await fetch("http://localhost:3000/api/products/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);
        /*
        body: (...)
        bodyUsed: true
        headers: Headers {}
        ok: true
        redirected: false
        status: 201
        statusText: "Created"
        type: "cors"
        url: "http://localhost:3000/api/products/"
        */

        const result = await response.json();

        // Optimizacion 4: Manejamos respuesta no ok del servidor
        if (!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }

       
        const infoProducto = `${result.message} con id ${result.productId}`
        mostrarMensaje("exito", infoProducto)
        console.log(infoProducto);

        formularioAlta.reset();

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
    }
});

