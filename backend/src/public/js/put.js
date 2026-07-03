const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const contenedorForm = document.getElementById("contenedor-form");
const urlBase = "http://localhost:3000/api/products";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); //Evitamos el envio por defecto HTML del formulario

    // Optimizacion 1: Para extraer solamente un valor, como el id en nuestro miniformulario, podemos saltarnos el FormData + Object.fromEntries
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Nos aseguramos de que se haya enviado un id valido
    if (!idProd) {
        mostrarMensaje("error", "Ingresá un id válido");
        return;
    }

    contenedorProductos.innerHTML = "";
    contenedorForm.innerHTML = "";
    
    try {
        // Optimizacion 3: Guardamos en una variable aparte la URL base para no hardcodearla aca
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        // Procesamos los datos que devuelve el servidor
        const datos = await response.json();
        console.log(datos);

        // Optimizacion 4: Mostramos por pantalla el error (400 o 500) que nos devuelve el servidor
        if (!response.ok) {
            mostrarMensaje("error", datos.message);
            return;
        }

        const producto = datos.payload[0];

        console.log(producto); 

        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al obtener el producto", error);

        // Optimizacion 5: Mostramos errores de red (en el try catch del fetch no capturamos errores 400 o 500)
        mostrarMensaje("error", "Error de conexion con el servidor")
    }
});

function renderizarProducto(producto) {
    let htmlProducto = `
    <ul>
        <li class="lista-producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
            <input type="button" id="updateProduct-button" value="Actualizar Producto">
        </li>
    </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;

    const updateProductButton = document.getElementById("updateProduct-button");

    updateProductButton.addEventListener("click", event => {
        event.stopPropagation();

        const confirmacion = confirm("Querés actualizar este producto?");

        if(!confirmacion) {
            alert("Actualizacion cancelada");
        } else {
            formularioPutProducto(event, producto);
        }
    });
}

function mostrarMensaje(tipo, mensaje) {
    contenedorForm.innerHTML = "";
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

// Funcion para realizar una operacion delete
async function formularioPutProducto(event, producto) {
    event.stopPropagation(); // Evitamos la propagacion de eventos
    console.table(producto); // Comprobamos por consola que el producto llega correctamente

    // Reciclamos el formulario de crear producto
    const htmlForm = `
    <hr>
    <form id="updateProduct-form" class="form-alta">

    <input type="hidden" name="id" value="${producto.id}">

    <label for="nombreProd">Nombre</label>
    <input type="text" name="nombre" id="nombreProd" value="${producto.nombre}" required>

    <label for="descripcionProd">Descripcion</label>
    <input type="text" name="descripcion" id="descripcionProd" value="${producto.descripcion}" required>

    <label for="imagenProd">Imagen</label>
    <input type="text" name="imagen" id="imagenProd" value="${producto.imagen}" required>

    <label for="categoriaProd">Categoria</label>
    <select name="categoria" id="categoriaProd" required>
         <option value="cajas" ${producto.categoria === "cajas" ? "selected" : ""}>cajas</option>
        <option value="skins" ${producto.categoria === "skins" ? "selected" : ""}>skins</option>
    </select>

    <label for="precioProd">Precio</label>
    <input type="number" name="precio" id="precioProd" value="${producto.precio}" required>

        <!-- Aca podemos hacer la baja logica que pide el TP -->
        <label for="activeProd">Activo</label>
        <select name="active" id="activeProd">
            <option value="1">activo</option>
            <option value="0">inactivo</option>
        </select>
        
        <div>
            <input type="submit" value="Actualizar producto">
        </div>
    </form>
    `;

    contenedorForm.innerHTML = htmlForm;

    // Selecciono el formulario de actualizacion
    const updateProductForm = document.getElementById("updateProduct-form");

    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

// Enviamos los datos del formulario al servidor
async function actualizarProducto(event) {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    console.log(event.target); // Nos muestra por consola el formulario de actualizacion
    // <form id="updateProduct-form" class="form-alta">

    // Recojo los datos del formulario (del evento) en un objeto nativo FormData
    const formData = new FormData(event.target);
    console.log(formData);
    
    // Transformamos el objeto FormData en un objeto JS, porque queremos parsear estos datos a JSON.stringify()
    const data = Object.fromEntries(formData.entries());
    data.precio = Number(data.precio);
    data.id = Number(data.id);
    console.log(data);
    

    console.log(JSON.stringify(data)); // Esto es lo que le vamos a enviar a nuestro endpoint -> que posteriormente parseara este JSON con el middleware app.use(express.json())
   

    try {
        const response = await fetch("http://localhost:3000/api/products/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);
        const result = await response.json();

        // Optimizacion 6: Filtramos respuesta no ok
        if(!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }


        mostrarMensaje("exito", result.message);


    } catch (error) {
        console.error(error);

        mostrarMensaje("error", error)
    }

}
