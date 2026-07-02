const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const urlBase = "http://localhost:3000/api/products";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const idProd = event.target.idProd.value.trim();

    if (!idProd) {
        mostrarError("Ingresa un id valido");
        return;
    }

    contenedorProductos.innerHTML = "";

    try {
        const response = await fetch(`${urlBase}/${idProd}`);
        const data = await response.json();

        if (!response.ok) {
            mostrarError(data.message);
            return;
        }

        const producto = data.payload[0];

        const htmlProducto = `
            <ul>
                <li class="lista-producto">
                    <img src="${armarRutaImagen(producto.imagen)}" alt="${producto.nombre}">
                    <p>Id: ${producto.id}</p>
                    <p>Nombre: ${producto.nombre}</p>
                    <p>Descripcion: ${producto.descripcion}</p>
                    <p>Categoria: ${producto.categoria}</p>
                    <p><strong>Precio: $${producto.precio}</strong></p>
                </li>
            </ul>
        `;

        contenedorProductos.innerHTML = htmlProducto;

    } catch (error) {
        console.error("Error al obtener producto: ", error);
        mostrarError("Error de conexion con el servidor");
    }
});

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}

function armarRutaImagen(imagen)  //para que ande de las 2 formas las rutas de las imagens, desde mi carpeta o desde steam comunnity
{
    if (imagen.startsWith("http")) 
    {
        return imagen;
    }

    return "http://localhost:3000" + imagen;
}