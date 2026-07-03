const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const urlBase = "http://localhost:3000/api/products";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); //Evitamos el envio por defecto HTML del formulario

    // Optimizacion 1: Para extraer solamente un valor, como el id en nuestro miniformulario, podemos saltarnos el FormData + Object.fromEntries
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Nos aseguramos de que se haya enviado un id valido
    if (!idProd) {
        mostrarError("Ingresá un id válido");
        return;
    }
    
    try {
        // Optimizacion 3: Guardamos en una variable aparte la URL base para no hardcodearla aca
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        // Procesamos los datos que devuelve el servidor
        const datos = await response.json();
        console.log(datos);

        // Optimizacion 4: Mostramos por pantalla el error (400 o 500) que nos devuelve el servidor
        if (!response.ok) {
            mostrarError(data.message);
            return;
        }

        const producto = datos.payload[0];

        console.log(producto); 

        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al obtener el producto");

        mostrarError("Id no encontrado")
    }
});

function renderizarProducto(producto) {
    let htmlProducto = `
    <ul>
        <li class="lista-producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
            <input type="button" id="deleteProduct-button" value="Eliminar Producto">
        </li>
    </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;

    const deleteProductButton = document.getElementById("deleteProduct-button");

    deleteProductButton.addEventListener("click", event => {
        event.stopPropagation();

        const confirmacion = confirm("Querés eliminar este producto?");

        if(!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            eliminarProducto(producto.id);
        }
    });
}

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}

function mostrarExito(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-exito">${mensaje}</p>
    `;
}


// Funcion para realizar una operacion delete
async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        // Optimizacion 6: Manejamos un error no ok
        if (!response.ok) {
            mostrarError(result.message);
            return;
        }

        // Optimizacion 7: En lugar de un alert bloqueante, mostramos un mensaje de exito, similar el mensaje de error
        console.log(result.message);

        // Gracias a mostrarExito, ya no hace falta limpiar la pantalla porque ya reemplazamos el producto por un mensaje en verde
        mostrarExito(result.message);
        // Limpiamos visualmente el producto que eliminamos de la pantalla
        // contenedorProductos.innerHTML = "";

    } catch (error) {
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar un producto");
    }
}
