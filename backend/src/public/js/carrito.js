function obtenerCarrito() 
{
    // Buscamos en LocalStorage si existe algo guardado con la clave "carrito"
    let carritoGuardado = localStorage.getItem("carrito");

    // Si existe carrito guardado, lo convertimos de texto JSON a array de objetos
    if (carritoGuardado) 
    {
        return JSON.parse(carritoGuardado);
    }
    // Si no existe carrito, devolvemos un array vacío
    return [];
}

function cargarProductosCarrito() 
{
    let tabla = document.getElementById("tabla-carrito");

    let valorFinal = document.getElementById("valor-final");

    // Obtenemos el carrito guardado en LocalStorage
    let carrito = obtenerCarrito();

    //acumulador para calcular el total final
    let total = 0;

    tabla.innerHTML = `
        <tr class="fila-header-carrito">
            <td class="celda-header-tabla-carrito">Nombre del producto</td>
            <td class="celda-header-tabla-carrito">Cantidad</td>
            <td class="celda-header-tabla-carrito">Precio unitario</td>
        </tr>
    `;

    // Si no hay productos en el carrito, mostramos total 0 y cortamos la función
    if (carrito.length === 0) 
    {
        valorFinal.textContent = "El valor final a pagar es de: $0";
        return;
    }

    // Recorremos cada producto guardado en el carrito
    carrito.forEach((producto) => 
    {
        if (producto.cantidad >= 1) 
        {
            /*
            El precio puede venir guardado como "$6000" o como 6000.
            Por eso lo convertimos a texto, le quitamos el signo "$"
            y después lo pasamos a numero.
            */
            let precioUnitario = Number(String(producto.precio).replace("$", ""));

            total = total + (precioUnitario * producto.cantidad);

            tabla.innerHTML += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${precioUnitario}</td>
                </tr>
            `;
        }
    });

    valorFinal.textContent = "El valor final a pagar es de: $" + total;
}

function limpiarCarrito() 
{
    // Borramos completamente el carrito del LocalStorage
    localStorage.removeItem("carrito");

    // Mostramos el mensaje pedido por la consigna
    alert("Carrito limpiado correctamente");

    // Volvemos a cargar la tabla
    cargarProductosCarrito();
}

window.addEventListener("DOMContentLoaded", () =>
{
    cargarProductosCarrito();
    document.querySelector(".btn-limpiar-carrito").addEventListener("click", limpiarCarrito);
});