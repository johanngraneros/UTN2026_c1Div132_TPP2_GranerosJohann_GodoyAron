const formBienvenida = document.getElementById("form-bienvenida");

formBienvenida.addEventListener("submit", (event) => 
{
    event.preventDefault();

    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();

    if (!nombreUsuario) 
    {
        alert("Ingresa tu nombre para continuar");
        return;
    }

    sessionStorage.setItem("nombreUsuario", nombreUsuario);

    window.location.href = "./productos.html";
});