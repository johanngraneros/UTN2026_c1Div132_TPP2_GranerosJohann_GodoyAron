// URL de la API desde donde vamos a obtener los productos
const URL_PRODUCTOS = "http://localhost:3000/api/products";

// Contenedores del HTML donde vamos a mostrar los productos
const listadoCajas = document.querySelector("#listado-cajas");
const listadoSkins = document.querySelector("#listado-skins");
const nombreUsuario = sessionStorage.getItem("nombreUsuario");

if (!nombreUsuario) {
    window.location.href = "index.html";
}

// Array donde guardamos todos los productos para poder buscarlos
let productosGlobales = [];

//--- Funcion que obtiene el carrito del LocalStorage, lo parsea a un array y lo retorna ---//
function obtenerCarrito() 
{
    let carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) 
    {
        return JSON.parse(carritoGuardado);
    }

    return [];
}


//--- Funcion que guarda el carrito recibido al LocalStorage, previamente transformado a string ---//
function guardarCarrito(carrito) 
{
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


//--- Funcion que actualiza el numero que aparece en el icono del carrito ---//
function actualizarContadorCarrito() 
{
    let contador = document.getElementById("contador-carrito");

    if (!contador) 
    {
        return;
    }

    let carrito = obtenerCarrito();
    let cantidadTotal = 0;

    for (let i = 0; i < carrito.length; i++) 
    {
        cantidadTotal = cantidadTotal + carrito[i].cantidad;
    }

    contador.textContent = cantidadTotal;
}

//--- Funcion para sumar un producto al carrito ---//
function sumarAlCarrito(producto) 
{
    let carrito = obtenerCarrito();

    let productoEncontrado = carrito.find(item => item.id === producto.id);

    if (productoEncontrado) 
    {
        productoEncontrado.cantidad = productoEncontrado.cantidad + 1;
    } 
    else 
    {
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

    guardarCarrito(carrito);
    actualizarContadorCarrito();

    alert(producto.nombre + " fue agregado al carrito");

    console.log(carrito);
}

//--- Funcion para restar un producto del carrito ---//
function restarDelCarrito(producto) 
{
    let carrito = obtenerCarrito();

    if (carrito.length === 0) 
    {
        alert("No hay ningun producto guardado en el carrito");
        return;
    }

    let productoEncontrado = carrito.find(item => item.id === producto.id);

    if (!productoEncontrado) 
    {
        alert("No hay mas " + producto.nombre + " en el carrito");
        return;
    }

    productoEncontrado.cantidad = productoEncontrado.cantidad - 1;

    carrito = carrito.filter(item => item.cantidad > 0);

    guardarCarrito(carrito);
    actualizarContadorCarrito();

    alert("Un/una " + producto.nombre + " fue eliminado del carrito");

    console.log(carrito);
}

//--- Funcion que obtiene los productos desde la API ---//
async function obtenerProductos() 
{
    try 
    {
        const response = await fetch(URL_PRODUCTOS);

        const data = await response.json();

        const productos = data.payload;

        productosGlobales = productos;

        console.log(productos);

        renderizarProductos(productosGlobales);

        actualizarContadorCarrito();
    } 
    catch (error) 
    {
        console.error("Error al obtener productos:", error);
    }
}


//--- Funcion para buscar productos por nombre ---//
function buscarProductos() 
{
    let inputBuscador = document.getElementById("input-buscador");

    if (!inputBuscador) 
    {
        return;
    }

    let textoBuscado = inputBuscador.value.toLowerCase();

    let productosFiltrados = productosGlobales.filter((producto) => 
    {
        let nombreProducto = producto.nombre.toLowerCase();

        return nombreProducto.indexOf(textoBuscado) !== -1;
    });

    renderizarProductos(productosFiltrados);
}


//--- Funcion que renderiza/muestra los productos en pantalla ---//
function renderizarProductos(productos) 
{
    listadoCajas.innerHTML = "";
    listadoSkins.innerHTML = "";

    productos.forEach(producto => 
    {
        const li = document.createElement("li");

        if (producto.categoria === "cajas") 
        {
            li.classList.add("li-cajas");
        }

        if (producto.categoria === "skins") 
        {
            li.classList.add("li-skins");
        }

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

        const btnSumar = li.querySelector(".btn-sumar-a-carrito");
        const btnRestar = li.querySelector(".btn-restar-a-carrito");

        btnSumar.addEventListener("click", () => 
        {
            sumarAlCarrito(producto);
        });

        btnRestar.addEventListener("click", () => 
        {
            restarDelCarrito(producto);
        });

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
    if (imagen.startsWith("http")) 
    {
        return imagen;
    }

    return "http://localhost:3000" + imagen;
}

//--- Configuramos el buscador ---//
function configurarBuscador() 
{
    let inputBuscador = document.getElementById("input-buscador");

    if (inputBuscador) 
    {
        inputBuscador.addEventListener("input", buscarProductos);
    }
}

//--- Ejecutamos la carga cuando se abre la pagina ---//
obtenerProductos();
configurarBuscador();