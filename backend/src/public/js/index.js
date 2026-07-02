// URL de la API desde donde vamos a obtener los productos
const URL_PRODUCTOS = "http://localhost:3000/api/products";

// Contenedores del HTML donde vamos a mostrar los productos
const listadoCajas = document.querySelector("#listado-cajas");
const listadoSkins = document.querySelector("#listado-skins");


//--- Funcion que obtiene el carrito del LocalStorage, lo parsea a un array y lo retorna ---//
function obtenerCarrito() 
{
    // Buscamos en LocalStorage si existe algo guardado con "carrito"
    let carritoGuardado = localStorage.getItem("carrito");

    // Si existe un carrito guardado, lo convertimos de texto JSON a array/objeto de JavaScript
    if (carritoGuardado) 
    {
        return JSON.parse(carritoGuardado);
    }

    // Si no existe nada guardado, devolvemos un array vacío
    return [];
}


//--- Funcion que guarda el carrito recibido al LocalStorage, previamente transformado a string ---//
function guardarCarrito(carrito) 
{
    // Convertimos el array carrito a texto JSON y lo guardamos en LocalStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


//--- Funcion para sumar un producto al carrito ---//
function sumarAlCarrito(producto) 
{
    // Obtenemos el carrito actual desde LocalStorage
    let carrito = obtenerCarrito();

    // Buscamos si el producto ya existe en el carrito comparando por ID
    let productoEncontrado = carrito.find(item => item.id === producto.id);

    // Si el producto ya estaba en el carrito, aumentamos cantidad en 1
    if (productoEncontrado) 
    {
        productoEncontrado.cantidad = productoEncontrado.cantidad + 1;
    } 
    else 
    {
        // Si el producto no estaba en el carrito, lo agregamos al array
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion,
            imagen: producto.imagen,
            categoria: producto.categoria,
            cantidad: 1
        });
    }

    // Guardamos el carrito actualizado en LocalStorage
    guardarCarrito(carrito);

    // Mostramos un alert para avisar que se agrego un producto
    alert(producto.nombre + " fue agregado al carrito");

    console.log(carrito);
}


//--- Funcion para restar un producto del carrito ---//
function restarDelCarrito(producto) 
{
    // Obtenemos el carrito actual desde LocalStorage
    let carrito = obtenerCarrito();

    // Si el carrito esta vacio, avisamos y cortamos con return
    if (carrito.length === 0) 
    {
        alert("No hay ningún producto guardado en el carrito");
        return;
    }

    // Buscamos si el producto existe dentro del carrito comparando por ID
    let productoEncontrado = carrito.find(item => item.id === producto.id);

    // Si el producto no existe en el carrito, mando un alert
    if (!productoEncontrado) 
    {
        alert("No hay más " + producto.nombre + " en el carrito");
        return;
    }

    // Si existe, le restamos 1 a la cantidad
    productoEncontrado.cantidad = productoEncontrado.cantidad - 1;

    // Filtramos el carrito para eliminar productos que quedaron en 0
    carrito = carrito.filter(item => item.cantidad > 0);

    // Guardamos el carrito actualizado en LocalStorage
    guardarCarrito(carrito);

    // Muestro mensaje que se elimino un producto
    alert("Un/una " + producto.nombre + " fue eliminado del carrito");

    console.log(carrito);
}


//--- Funcion que obtiene los productos desde la API ---//
async function obtenerProductos() 
{
    try 
    {
        // Hacemos una peticion GET a la API
        const response = await fetch(URL_PRODUCTOS);

        // Convertimos la respuesta a JSON
        const data = await response.json();

        // Tomamos el array de productos que viene dentro de payload
        const productos = data.payload;

        console.log(productos);

        // Mandamos los productos a renderizar en el HTML
        renderizarProductos(productos);
    } 
    catch (error) 
    {
        console.error("Error al obtener productos:", error);
    }
}


//--- Funcion que renderiza/muestra los productos en pantalla ---//
function renderizarProductos(productos) 
{
    // Limpiamos los listados antes de cargar productos
    listadoCajas.innerHTML = "";
    listadoSkins.innerHTML = "";

    // Recorremos el array de productos recibido desde la API
    productos.forEach(producto => 
    {
        // Creamos un li por cada producto
        const li = document.createElement("li");

        // Agregamos una clase distinta segun la categoria del producto
        if (producto.categoria === "cajas") 
        {
            li.classList.add("li-cajas");
        }

        if (producto.categoria === "skins") 
        {
            li.classList.add("li-skins");
        }

        // Armamos el contenido HTML de cada producto
        li.innerHTML = `
            <img class="img-producto" src="${armarRutaImagen(producto.imagen)}" alt="${producto.nombre}">
            
            <div>
                <h3 class="nombre-producto">${producto.nombre}</h3>
                <p class="precio-producto">$${producto.precio}</p>
                <p class="descripcion-producto">${producto.descripcion}</p>
            </div>

            <button class="btn-sumar-a-carrito">+</button>
            <button class="btn-restar-a-carrito">-</button>
        `;

        // Buscamos los botones dentro del li creado
        const btnSumar = li.querySelector(".btn-sumar-a-carrito");
        const btnRestar = li.querySelector(".btn-restar-a-carrito");

        // Asociamos el evento click al boton "+"
        btnSumar.addEventListener("click", () => 
        {
            sumarAlCarrito(producto);
        });

        // Asociamos el evento click al boton "-"
        btnRestar.addEventListener("click", () => 
        {
            restarDelCarrito(producto);
        });

        // Segun la categoria, agregamos el producto en el listado correspondiente
        if (producto.categoria === "cajas") 
        {
            listadoCajas.appendChild(li);
        }

        if (producto.categoria === "skins") 
        {
            listadoSkins.appendChild(li);
        }
    });
}


//--- Funcion para armar la ruta correcta de la imagen ---//
function armarRutaImagen(imagen) 
{
    // Si la imagen ya viene con una URL completa, la devolvemos tal cual
    if (imagen.startsWith("http")) 
    {
        return imagen;
    }

    // Si la imagen viene como ruta local del backend, le agregamos el localhost
    return "http://localhost:3000" + imagen;
}


//--- Ejecutamos la carga de productos cuando se abre la pagina ---//
obtenerProductos();