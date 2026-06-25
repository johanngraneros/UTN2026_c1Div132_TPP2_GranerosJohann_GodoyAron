const contenedorProductos = document.getElementById("contenedor-productos");
        const getProductForm = document.getElementById("getProduct-form");

    getProductForm.addEventListener("submit", async event => {
        event.preventDefault(); //Evitamos el envio por defecto HTML del formulario

        // Extraemos el id del producto
        const idProd = event.target.idProd.value.trim();
            
        try {
            // Vamos a hacer el fetch a una URL personalizada
            const response = await fetch(`http://localhost:3000/api/products/${idProd}`);
            console.log(response);

            // Procesamos los datos que devuelve el servidor
            const datos = await response.json();
            console.log(datos);

            const producto = datos.payload[0];

            console.log(producto); 

            renderizarProducto(producto);

            } catch (error) {
                console.error("Error al obtener el producto");
            }
        });

function renderizarProducto(producto) {
    let htmlProducto = `
        <ul>
            <li class="lista-producto">
                <img src="http://localhost:3000${producto.imagen}" alt="${producto.nombre}">
                <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
                <input type="button" id="deleteProduct-button" value="Eliminar Producto">
            </li>
        </ul>
        `;
    contenedorProductos.innerHTML = htmlProducto;

    const deleteProductButton = document.getElementById("deleteProduct-button");

    deleteProductButton.addEventListener("click", event => {event.stopPropagation();

    const confirmacion = confirm("Querés eliminar este producto?");

    if(!confirmacion) {
        alert("Eliminacion cancelada");
    } else {
        eliminarProducto(producto.id);
            }
        });
    }

// Funcion para realizar una operacion delete
async function eliminarProducto(id) {

    // Hacemos una petición HTTP al backend.
    // Como usamos method: "DELETE", Express va a buscar una ruta app.delete()
    // que coincida con esta URL: /api/products/:id

    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                        method: "DELETE"
        }); 
        
        // Convertimos la respuesta del backend a JSON.
        // El backend nos devuelve algo como:
        // { message: "Producto con id 3 eliminado exitosamente" }
        const result = await response.json();

        alert(result.message);
        console.log(result.message);

        // Limpiamos visualmente el producto que eliminamos de la pantalla
        contenedorProductos.innerHTML = "";

        } catch (error) {
            // Si falla el fetch, el servidor o la conexión, mostramos el error
            console.error("Error en la solicitud DELETE: ", error);
            alert("Ocurrio un error al eliminar un producto");
                }                           
    }           