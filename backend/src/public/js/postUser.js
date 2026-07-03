//nuevo codigo
const contenedorUsuario = document.getElementById("contenedor-usuario");
const postUserForm = document.getElementById("postUser-form");

//agrego funcion nueva
function mostrarMensajeUsuario(tipo, mensaje) {
    contenedorUsuario.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}
////////////////////
//Enviando usuario
//descomento este bloque de codigo
//cambio el mostrarMensaje a mostrarMensajeUsuario
postUserForm.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // Obtenemos la data del formulario
    const formData = new FormData(event.target);

    // Convertimos nuestro objeto formdata en un objeto literal de JavaScript
    const data = Object.fromEntries(formData.entries());
    console.table(data);

    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    try {
        
        const response = await fetch("http://localhost:3000/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        });

        console.log(response);
        const result = await response.json();

        if (!response.ok) {
            mostrarMensajeUsuario("error", result.message);
            return;
        }

        // Mostramos el mensaje de exito y reseteamos el form
        const infoUser = `${result.message} con id ${result.userId}`
        mostrarMensajeUsuario("exito", infoUser)
        console.log(infoUser);

        event.target.reset();

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
    }

});