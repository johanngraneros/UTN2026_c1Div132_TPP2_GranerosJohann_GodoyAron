function obtenerCarrito() 
{
    // Buscamos en LocalStorage si existe algo guardado con la clave "carrito"
    let carritoGuardado = localStorage.getItem("carrito");

    // Si existe carrito guardado, lo convertimos de texto JSON a array de objetos
    if (carritoGuardado) 
    {
        return JSON.parse(carritoGuardado);
    }

    // Si no existe carrito, devolvemos un array vacio
    return [];
}

function guardarCarrito(carrito) 
{
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

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

function cargarProductosCarrito() 
{
    let tabla = document.getElementById("tabla-carrito");
    let valorFinal = document.getElementById("valor-final");

    let carrito = obtenerCarrito();
    let total = 0;

    tabla.innerHTML = `
        <tr class="fila-header-carrito">
            <td class="celda-header-tabla-carrito">Nombre del producto</td>
            <td class="celda-header-tabla-carrito">Cantidad</td>
            <td class="celda-header-tabla-carrito">Precio unitario</td>
            <td class="celda-header-tabla-carrito">Acciones</td>
        </tr>
    `;

    if (carrito.length === 0) 
    {
        valorFinal.textContent = "El valor final a pagar es de: $0";
        actualizarContadorCarrito();
        return;
    }

    carrito.forEach((producto) => 
    {
        if (producto.cantidad >= 1) 
        {
            let precioUnitario = Number(String(producto.precio).replace("$", ""));

            total = total + (precioUnitario * producto.cantidad);

            tabla.innerHTML += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${precioUnitario}</td>
                    <td>
                        <button class="btn-restar-cantidad" data-id="${producto.id}">-</button>
                        <button class="btn-sumar-cantidad" data-id="${producto.id}">+</button>
                    </td>
                </tr>
            `;
        }
    });

    valorFinal.textContent = "El valor final a pagar es de: $" + total;

    document.querySelectorAll(".btn-sumar-cantidad").forEach((boton) => 
    {
        boton.addEventListener("click", () => 
        {
            sumarCantidad(Number(boton.dataset.id));
        });
    });

    document.querySelectorAll(".btn-restar-cantidad").forEach((boton) => 
    {
        boton.addEventListener("click", () => 
        {
            restarCantidad(Number(boton.dataset.id));
        });
    });

    actualizarContadorCarrito();
}

function limpiarCarrito() 
{
    localStorage.removeItem("carrito");

    alert("Carrito limpiado correctamente");

    cargarProductosCarrito();
}

function sumarCantidad(idProducto) 
{
    let carrito = obtenerCarrito();

    let productoEncontrado = carrito.find(producto => producto.id === idProducto);

    if (productoEncontrado) 
    {
        productoEncontrado.cantidad = productoEncontrado.cantidad + 1;
    }

    guardarCarrito(carrito);
    cargarProductosCarrito();
}

function restarCantidad(idProducto) 
{
    let carrito = obtenerCarrito();

    let productoEncontrado = carrito.find(producto => producto.id === idProducto);

    if (productoEncontrado) 
    {
        productoEncontrado.cantidad = productoEncontrado.cantidad - 1;
    }

    carrito = carrito.filter(producto => producto.cantidad > 0);

    guardarCarrito(carrito);
    cargarProductosCarrito();
}

async function finalizarCompra() 
{
    let carrito = obtenerCarrito();

    if (carrito.length === 0) 
    {
        alert("El carrito esta vacio");
        return;
    }

    let nombreUsuario = sessionStorage.getItem("nombreUsuario");

    if (!nombreUsuario) 
    {
        nombreUsuario = prompt("Ingresa tu nombre para finalizar la compra");

        if (!nombreUsuario) 
        {
            alert("Necesitas ingresar un nombre para continuar");
            return;
        }

        sessionStorage.setItem("nombreUsuario", nombreUsuario);
    }

    let total = 0;

    carrito.forEach((producto) => 
    {
        let precioUnitario = Number(String(producto.precio).replace("$", ""));
        total = total + (precioUnitario * producto.cantidad);
    });

    let productos = carrito.map((producto) => 
    {
        return {
            id_producto: producto.id,
            cantidad: producto.cantidad
        };
    });

    let venta = {
        nombre_usuario: nombreUsuario,
        precio_total: total,
        productos: productos
    };

    try 
    {
        let response = await fetch("http://localhost:3000/api/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(venta)
        });

        let data = await response.json();

        if (!response.ok) 
        {
            alert(data.message || "Error al registrar la venta");
            return;
        }

        sessionStorage.setItem("ticket", JSON.stringify({
            id: data.payload.id,
            nombre_usuario: nombreUsuario,
            precio_total: total,
            productos: carrito
        }));

        localStorage.removeItem("carrito");

        alert("Compra realizada correctamente");

        window.location.href = "../ticket.html";
    } 
    catch (error) 
    {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}

window.addEventListener("DOMContentLoaded", () =>
{
    cargarProductosCarrito();
    actualizarContadorCarrito();

    document.querySelector(".btn-limpiar-carrito").addEventListener("click", limpiarCarrito);
    document.querySelector(".btn-finalizar-compra").addEventListener("click", finalizarCompra);
});
