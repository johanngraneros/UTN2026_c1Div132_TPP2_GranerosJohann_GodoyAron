function obtenerTicket() 
{
    const ticketGuardado = sessionStorage.getItem("ticket");

    if (!ticketGuardado) 
    {
        return null;
    }

    return JSON.parse(ticketGuardado);
}

function convertirPrecio(precio) 
{
    return Number(String(precio).replace("$", ""));
}

function mostrarTicket() 
{
    const ticket = obtenerTicket();

    if (!ticket) 
    {
        alert("No hay ticket para mostrar");
        window.location.href = "./index.html";
        return;
    }

    const nombre = document.getElementById("ticket-nombre");
    const fecha = document.getElementById("ticket-fecha");
    const tabla = document.getElementById("tabla-ticket");
    const total = document.getElementById("ticket-total");

    const fechaActual = new Date();

    nombre.textContent = `Cliente: ${ticket.nombre_usuario}`;
    fecha.textContent = `Fecha: ${fechaActual.toLocaleString()}`;

    ticket.productos.forEach((producto) => 
    {
        const precioUnitario = convertirPrecio(producto.precio);
        const subtotal = precioUnitario * producto.cantidad;

        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${precioUnitario}</td>
                <td>$${subtotal}</td>
            </tr>
        `;
    });

    total.textContent = `Total: $${ticket.precio_total}`;
}

function imprimirTicket() 
{
    const ticket = obtenerTicket();

    if (!ticket) 
    {
        alert("No hay ticket para imprimir");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 30;

    doc.setFontSize(24);
    doc.text("Ticket de compra", 40, y);

    y += 15;

    doc.setFontSize(12);
    doc.text(`Cliente: ${ticket.nombre_usuario}`, 20, y);

    y += 10;

    const fecha = new Date();
    doc.text(`Fecha: ${fecha.toLocaleString()}`, 20, y);

    y += 15;

    doc.setFontSize(14);
    doc.text("Productos:", 20, y);

    y += 10;

    doc.setFontSize(11);

    ticket.productos.forEach((producto) => 
    {
        const precioUnitario = convertirPrecio(producto.precio);
        const subtotal = precioUnitario * producto.cantidad;

        doc.text(
            `${producto.nombre} - Cant: ${producto.cantidad} - $${precioUnitario} - Subtotal: $${subtotal}`,
            20,
            y
        );

        y += 10;
    });

    y += 10;

    doc.setFontSize(16);
    doc.text(`Total: $${ticket.precio_total}`, 20, y);

    const nombreTicket = `pedido-${ticket.nombre_usuario}-${fecha.toISOString()}.pdf`;

    doc.save(nombreTicket);
}

window.addEventListener("DOMContentLoaded", () => 
{
    mostrarTicket();

    document
        .getElementById("btn-descargar-pdf")
        .addEventListener("click", imprimirTicket);
});