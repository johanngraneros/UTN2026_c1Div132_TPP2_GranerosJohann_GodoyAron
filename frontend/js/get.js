const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
     
getProductForm.addEventListener("submit", async event => {
        event.preventDefault(); // Evitamos el envio por defecto del formulario

        // Creo un objeto nativo FormData a partir del formulario del evento
        const formData = new FormData(event.target);
        console.log(formData); // FormData { idProd → "1" }

        // Transformo mi objeto nativo FormData en un objeto normal JS
        const data = Object.fromEntries(formData.entries());
        console.log(data); // Object { idProd: "1" }

        const idProd = data.idProd; // 1

        try {
            const response = await fetch(`http://localhost:3000/api/products/${idProd}`);

            const data = await response.json();

            console.log(data.payload[0]); 

            const producto = data.payload[0];

            const htmlProducto = `
                    <ul>
                        <li class="lista-producto">
                            <img src="${producto.image}" alt="${producto.name}">
                            <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
                        </li>
                    </ul>
                `;

            contenedorProductos.innerHTML = htmlProducto;

        } catch (error) {
                console.error("Error al obtener productos: ", error);
            }
    });