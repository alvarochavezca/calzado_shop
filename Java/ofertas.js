document.addEventListener("DOMContentLoaded", function () {
    let carrito = [];
    let contador = document.querySelector(".cart-count");
    let iconoCarrito = document.querySelector(".cart-icon");
    let botones = document.querySelectorAll(".btn-agregar");
    let productoTemporal = null; // Para guardar el producto mientras eliges talla

    // Función para abrir el modal principal (Carrito/Mensajes)
    function abrirModal(contenido, esMensajeSimple = false) {
        const modal = document.getElementById("miModalCarrito");
        const lista = document.getElementById("listaProductos");
        const btnWsp = document.getElementById("btnWhatsapp");

        lista.innerHTML = contenido;
        modal.classList.add("modal-active");

        if (esMensajeSimple) {
            btnWsp.style.display = "none";
        } else {
            btnWsp.style.display = "block";
            configurarEnlaceWhatsapp();
        }
    }

    // Configurar enlace de WhatsApp incluyendo la talla
    function configurarEnlaceWhatsapp() {
        const btnWsp = document.getElementById("btnWhatsapp");
        const telefono = "51918374192";
        let textoWsp = "¡Hola! Quisiera solicitar estos productos de Calzado.Shop:\n\n";
        
        carrito.forEach((item) => {
            // Agregamos la talla al mensaje de WhatsApp
            textoWsp += `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla}) [${item.precio} c/u]\n`;
        });
        
        btnWsp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(textoWsp)}`;
    }

    // 1. Al hacer clic en el botón de la zapatilla (Abrir Selector de Tallas)
    botones.forEach(function (boton) {
        boton.onclick = function () {
            let productoDiv = boton.closest(".miniatura");
            
            productoTemporal = {
                nombre: productoDiv.querySelector("h3").textContent,
                precio: productoDiv.querySelector("span").textContent,
                imagen: productoDiv.querySelector("img").src,
                talla: null
            };

            // Llenamos el modal de tallas
            document.getElementById("modalImg").src = productoTemporal.imagen;
            document.getElementById("modalNombre").textContent = productoTemporal.nombre;
            document.getElementById("modalPrecio").textContent = productoTemporal.precio;
            
            // Reset de botones de talla
            document.querySelectorAll(".btn-talla").forEach(b => b.classList.remove("active"));
            
            document.getElementById("modalProducto").classList.add("modal-active");
        };
    });

    // 2. Lógica para seleccionar una talla
    document.querySelectorAll(".btn-talla").forEach(boton => {
        boton.addEventListener("click", function() {
            document.querySelectorAll(".btn-talla").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            productoTemporal.talla = this.textContent;
        });
    });

    // 3. Confirmar Selección e ir al carrito
    document.getElementById("confirmarAgregar").onclick = function() {
        if (!productoTemporal.talla) {
            alert("Por favor, selecciona una talla primero.");
            return;
        }

        let existente = carrito.find(item => item.nombre === productoTemporal.nombre && item.talla === productoTemporal.talla);

        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({ ...productoTemporal, cantidad: 1 });
        }

        actualizarContador();
        cerrarModalTalla();
        
        abrirModal(`<p style="color:#25d366">✅ <b>${productoTemporal.nombre}</b> (Talla ${productoTemporal.talla}) añadido</p>`, true);
        setTimeout(cerrarModal, 1200);
    };

    // Ver el contenido del carrito
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
                        <p class="det">${item.precio} | Talla: ${item.talla} | Cant: ${item.cantidad}</p>
                    </div>
                </div>`;
        });
        listaHTML += "</div>";

        abrirModal(listaHTML);
    };

    function actualizarContador() {
        let totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
    }
});

// Funciones globales para los botones "Cerrar"
function cerrarModalTalla() {
    document.getElementById("modalProducto").classList.remove("modal-active");
}

function cerrarModal() {
    document.getElementById("miModalCarrito").classList.remove("modal-active");
}

// Lógica del buscador
let inputBusqueda = document.getElementById("buscador");
if(inputBusqueda) {
    inputBusqueda.addEventListener("keyup", function() {
        let filtro = inputBusqueda.value.toLowerCase();
        let productos = document.querySelectorAll(".miniatura");

        productos.forEach(producto => {
            let texto = producto.querySelector("h3").textContent.toLowerCase();
            producto.style.display = texto.includes(filtro) ? "" : "none";
        });
    });
}