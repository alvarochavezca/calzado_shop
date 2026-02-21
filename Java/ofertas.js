document.addEventListener("DOMContentLoaded", function () {
    let carrito = [];
    let contador = document.querySelector(".cart-count");
    let iconoCarrito = document.querySelector(".cart-icon");
    let botones = document.querySelectorAll(".btn-agregar");

    function abrirModal(contenido, esMensajeSimple = false) {
        const modal = document.getElementById("miModalCarrito");
        const lista = document.getElementById("listaProductos");
        const btnWsp = document.getElementById("btnWhatsapp");

        lista.innerHTML = contenido;
        modal.classList.add("modal-active"); // Usamos clase para mejor control

        if (esMensajeSimple) {
            btnWsp.style.display = "none";
        } else {
            btnWsp.style.display = "block";
            configurarEnlaceWhatsapp();
        }
    }

    function configurarEnlaceWhatsapp() {
        const btnWsp = document.getElementById("btnWhatsapp");
        const telefono = "51918374192";
        let textoWsp = "¡Hola! Quisiera solicitar estos productos de Calzado.Shop:\n\n";
        
        carrito.forEach((item) => {
            textoWsp += `- ${item.cantidad}x ${item.nombre} (${item.precio} c/u)\n`;
        });
        
        btnWsp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(textoWsp)}`;
    }

    botones.forEach(function (boton) {
        boton.onclick = function () {
            let productoDiv = boton.closest(".miniatura");
            let nombre = productoDiv.querySelector("h3").textContent;
            let precio = productoDiv.querySelector("span").textContent;
            let imagenSrc = productoDiv.querySelector("img").src;

            let productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, imagen: imagenSrc, cantidad: 1 });
            }

            let totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
            contador.textContent = totalItems;

            // Mostrar aviso rápido y cerrar solo
            abrirModal(`<p style="color:#25d366">✅ <b>${nombre}</b> añadido al pedido</p>`, true);
            setTimeout(cerrarModal, 1200);
        };
    });

    iconoCarrito.onclick = function () {
        if (carrito.length === 0) {
            abrirModal("<p>Tu carrito está vacío 🛒</p>", true);
            return;
        }

        let listaHTML = '<div class="carrito-listado">';
        carrito.forEach(function (item) {
            listaHTML += `
                <div class="item-carrito">
                    <img src="${item.imagen}" class="img-mini">
                    <div class="info-item">
                        <p class="nom">${item.nombre}</p>
                        <p class="det">${item.precio} x ${item.cantidad}</p>
                    </div>
                </div>`;
        });
        listaHTML += "</div>";

        abrirModal(listaHTML);
    };
});

function cerrarModal() {
    document.getElementById("miModalCarrito").classList.remove("modal-active");
}


let inputBusqueda = document.getElementById("buscador");

inputBusqueda.addEventListener("keyup", function() {
    let filtro = inputBusqueda.value.toLowerCase();
    let productos = document.querySelectorAll(".miniatura");

    productos.forEach(producto => {
        let texto = producto.querySelector("h3").textContent.toLowerCase();

        if(texto.includes(filtro)) {
            // En lugar de 'block', usamos '' para que regrese a su estado natural en el CSS
            producto.style.display = ""; 
        } else {
            producto.style.display = "none";
        }
    });
});

document.getElementById("btnBuscar").addEventListener("click", function() {
    // Esto dispara la lógica de búsqueda manualmente
    inputBusqueda.dispatchEvent(new Event('keyup'));
});

