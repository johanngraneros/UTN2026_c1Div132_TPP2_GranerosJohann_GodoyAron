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

function guardarCarrito(carrito) 
{
    localStorage.setItem("carrito", JSON.stringify(carrito));
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
            <td class="celda-header-tabla-carrito">Acciones</td>
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
                    <td>
                        <button class="btn btn-danger btn-restar-cantidad" data-id="${producto.id}">-</button>
                        <button class="btn btn-success btn-sumar-cantidad" data-id="${producto.id}">+</button>
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
            id_producto: producto.id, //id_producto: producto.id_producto
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
    document.querySelector(".btn-limpiar-carrito").addEventListener("click", limpiarCarrito);
    document.querySelector(".btn-finalizar-compra").addEventListener("click", finalizarCompra);
});

