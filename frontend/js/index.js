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

function crearProducto(cardProducto) 
{
    // Creamos un objeto producto tomando los datos desde la card recibida
    let producto = {
        // Buscamos dentro de la card
        nombre: cardProducto.querySelector(".nombre-producto").textContent,

        precio: cardProducto.querySelector(".precio-producto").textContent,

        descripcion: cardProducto.querySelector(".descripcion-producto").textContent,

        imagen: cardProducto.querySelector(".img-producto").src,

        // Todo producto nuevo empieza con cantidad 1
        cantidad: 1
    };

    // Devolvemos el objeto producto ya armado
    return producto;
}

function sumarAlCarrito(cardProducto) 
{
    // Creamos el producto a partir de la card que llego por param
    let producto = crearProducto(cardProducto);

    // Obtenemos el carrito actual desde LocalStorage
    let carrito = obtenerCarrito();

    // Buscamos si el producto ya existe en el carrito comparando por nombre
    let productoEncontrado = carrito.find(item => item.nombre === producto.nombre);

    // Si el producto ya estaba en el carrito, aumentamos cantidad en 1
    if (productoEncontrado) 
    {
        productoEncontrado.cantidad = productoEncontrado.cantidad + 1;
    } 
    else 
    {
        // Si el producto no estaba en el carrito, lo agregamos al array
        carrito.push(producto);
    }

    // Mostramos un alert para avisar que se agrego un producto
    alert(producto.nombre + " fue agregado al carrito");

    console.log(carrito);

    // Guardamos el carrito actualizado en LocalStorage
    guardarCarrito(carrito);
}

function restarDelCarrito(cardProducto) 
{
    // Creamos el producto a partir de la card que llego por el param
    let producto = crearProducto(cardProducto);

    // Obtenemos el carrito actual desde LocalStorage
    let carrito = obtenerCarrito();

    // Si el carrito esta vacio, avisamos y cortamos con return
    if (carrito.length === 0) 
    {
        alert("No hay ningún producto guardado en el carrito");
        return;
    }

    // Buscamos si el producto existe dentro del carrito
    let productoEncontrado = carrito.find(item => item.nombre === producto.nombre);

    // Si el producto no existe en el carrito, mando un alert
    if (!productoEncontrado) 
    {
        alert("No hay más " + producto.nombre + " en el carrito");
        return;
    }

    productoEncontrado.cantidad = productoEncontrado.cantidad - 1;

    // Muestro mensaje que se elimino un producto
    alert("Un/una: " + producto.nombre + " fue eliminado del carrito");

    // Filtramos el carrito para eliminar productos que quedaron 0
    carrito = carrito.filter(item => item.cantidad > 0);

    console.log(carrito);

    // Guardamos el carrito actualizado en LocalStorage
    guardarCarrito(carrito);
}

//--- [EVENTOS] Asociacion del evento "click" a los botones "+" y "-" con la funcion manejadora del evento ---//
window.addEventListener("DOMContentLoaded", () => 
{ 
    const botonesSumar = document.querySelectorAll(".btn-sumar-a-carrito");

    const botonesRestar = document.querySelectorAll(".btn-restar-a-carrito");

    // Buscamos todas las cards de productos: hamburguesas, bebidas y tragos
    const cardsProductos = document.querySelectorAll(".li-cajas, .li-skins");

    // Recorremos todos los botones "+".
    // El index indica la posición del botón dentro de la lista.
    botonesSumar.forEach((btn, index) => 
    {
        // Cuando se hace click en un boton "+", se suma al carrito la card de la misma posicion
        btn.addEventListener("click", () => sumarAlCarrito(cardsProductos[index]));
    });

    // Recorremos todos los botones "-".
    // El index indica la posicion del botón dentro de la lista.
    botonesRestar.forEach((btn, index) => 
    {
        // Cuando se hace click en un boton "-", se resta del carrito la card de la misma posicion
        btn.addEventListener("click", () => restarDelCarrito(cardsProductos[index]));
    });
});