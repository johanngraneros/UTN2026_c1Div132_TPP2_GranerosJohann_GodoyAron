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

    let nombreValido = true;

    for (let i = 0; i < nombreUsuario.length; i++) 
    {
        const caracter = nombreUsuario[i].toLowerCase();

        const esLetra = caracter >= "a" && caracter <= "z";
        const esEspacio = caracter === " ";

        if (!esLetra && !esEspacio) 
        {
            nombreValido = false;
        }
    }

    if (!nombreValido) 
    {
        alert("El nombre solo puede contener letras y espacios");
        return;
    }

    sessionStorage.setItem("nombreUsuario", nombreUsuario);

    window.location.href = "./productos.html";
});