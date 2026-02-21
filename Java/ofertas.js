document.addEventListener("DOMContentLoaded", function () {

    let carrito = [];
    let contador = document.querySelector(".cart-count");
    let iconoCarrito = document.querySelector(".cart-icon");

    let botones = document.querySelectorAll(".btn-agregar");

    console.log("Botones encontrados:", botones.length);

    botones.forEach(function (boton) {

        boton.onclick = function () {

            console.log("Botón clickeado");

            let producto = boton.closest(".miniatura");

            let nombre = producto.querySelector("h3").textContent;
            let precio = producto.querySelector("span").textContent;

            carrito.push({ nombre, precio });

            contador.textContent = carrito.length;

            alert(nombre + " agregado al carrito 🛒");

        };

    });

    iconoCarrito.onclick = function () {

        if (carrito.length === 0) {
            alert("Tu carrito está vacío 🛒");
            return;
        }

        let mensaje = "🛒 Productos en tu carrito:\n\n";

        carrito.forEach(function (item, index) {
            mensaje += (index + 1) + ". " + item.nombre + " - " + item.precio + "\n";
        });

        alert(mensaje);
    };

});

let inputBusqueda = document.getElementById("buscador");

inputBusqueda.addEventListener("keyup", function() {

    let filtro = inputBusqueda.value.toLowerCase();
    let productos = document.querySelectorAll(".miniatura");

    productos.forEach(producto => {
        let texto = producto.querySelector("h3").textContent.toLowerCase();

        if(texto.includes(filtro)) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });

});