const contenedorProductos = document.getElementById("contenedor-productos");

const postProductForm = document.getElementById("postProduct-form");

postProductForm.addEventListener("submit", async event => {
        event.preventDefault();

        // Obtenemos la data del formulario
        const formData = new FormData(event.target);

        // Parseamos el objeto FormData a un objeto JS normal para enviarlo en el body con JSON.stringify()
        const data = Object.fromEntries(formData.entries());
            console.log(data); // 

        try {
            const response = await fetch("http://localhost:3000/api/products/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

                alert(result.message);
                console.log(result.message);

            } catch (error) {
                console.error("Error al enviar los datos: ", error);
            }


    })  