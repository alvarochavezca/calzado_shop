document.addEventListener("DOMContentLoaded", function () {
    // --- VARIABLES PRINCIPALES ---
    let carrito = []; // Arreglo que almacenará los productos seleccionados
    let contador = document.querySelector(".cart-count"); // El círculo con el número sobre el carrito
    let iconoCarrito = document.querySelector(".cart-icon"); // El botón del carrito en el header
    let botones = document.querySelectorAll(".btn-agregar"); // Todos los botones de "Comprar/Agregar"
    let productoTemporal = null; // Variable para guardar datos del producto antes de confirmar la talla

    // --- ELIMINAR PRODUCTOS (Delegación de eventos) ---
    // Escucha clics en la lista de productos del modal para detectar el botón de eliminar
    document.getElementById("listaProductos").addEventListener("click", function(e){
        let boton = e.target.closest(".btn-eliminar");
        if(boton){
            let index = boton.getAttribute("data-index"); // Obtiene la posición del item
            carrito.splice(index, 1); // Lo borra del arreglo
            actualizarContador(); // Actualiza el número en la burbuja
            iconoCarrito.onclick(); // Refresca visualmente la lista en el modal
        }
    });

    // --- FUNCIÓN: ABRIR MODAL PRINCIPAL ---
    // Se usa tanto para mostrar el carrito como para mensajes rápidos de confirmación
    function abrirModal(contenido, esMensajeSimple = false) {
        const modal = document.getElementById("miModalCarrito");
        const lista = document.getElementById("listaProductos");
        const btnWsp = document.getElementById("btnWhatsapp");

        lista.innerHTML = contenido; // Inserta el HTML (lista o mensaje)
        modal.classList.add("modal-active"); // Muestra el modal

        // Si es solo un aviso de "Producto añadido", oculta el botón de WhatsApp
        if (esMensajeSimple) {
            btnWsp.style.display = "none";
        } else {
            btnWsp.style.display = "block";
            configurarEnlaceWhatsapp(); // Prepara el link con los productos actuales
        }
    }

    // --- FUNCIÓN: CONFIGURAR WHATSAPP ---
    // Crea el link personalizado con el listado de productos y tallas
    function configurarEnlaceWhatsapp() {
        const btnWsp = document.getElementById("btnWhatsapp");
        const telefono = "51944211021";
        let textoWsp = "¡Hola! Quisiera solicitar estos productos de Calzado.Shop:\n\n";
        
        carrito.forEach((item) => {
            // Estructura cada línea del mensaje de WhatsApp
            textoWsp += `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla}) [${item.precio} c/u]\n`;
        });
        
        // Codifica el texto para que sea válido en una URL
        btnWsp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(textoWsp)}`;
    }

    // --- 1. ABRIR SELECTOR DE TALLAS ---
    // Se activa al hacer clic en el botón de un producto en la tienda
    botones.forEach(function (boton) {
        boton.onclick = function () {
            let productoDiv = boton.closest(".miniatura");
            
            // Extrae la información del HTML del producto
            productoTemporal = {
                nombre: productoDiv.querySelector("h3").textContent,
                precio: productoDiv.querySelector("span").textContent,
                imagen: productoDiv.querySelector("img").src,
                talla: null // Se llenará en el siguiente paso
            };

            // Carga los datos en el modal de tallas
            document.getElementById("modalImg").src = productoTemporal.imagen;
            document.getElementById("modalNombre").textContent = productoTemporal.nombre;
            document.getElementById("modalPrecio").textContent = productoTemporal.precio;
            
            // Limpia selecciones de tallas anteriores
            document.querySelectorAll(".btn-talla").forEach(b => b.classList.remove("active"));
            
            // Muestra el modal de selección de talla
            document.getElementById("modalProducto").classList.add("modal-active");
        };
    });

    // --- 2. LÓGICA PARA SELECCIONAR UNA TALLA ---
    // Gestiona el clic en los botones de números (tallas)
    document.querySelectorAll(".btn-talla").forEach(boton => {
        boton.addEventListener("click", function() {
            // Quita la clase activa de todos y se la pone al clicado
            document.querySelectorAll(".btn-talla").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            // Guarda la talla seleccionada en el objeto temporal
            productoTemporal.talla = this.textContent;
        });
    });

    // --- 3. CONFIRMAR SELECCIÓN E IR AL CARRITO ---
    // Se activa al darle al botón "Agregar al carrito" dentro del modal de tallas
    document.getElementById("confirmarAgregar").onclick = function() {
        if (!productoTemporal.talla) {
            alert("Por favor, selecciona una talla primero.");
            return;
        }

        // Verifica si el producto con esa misma talla ya está en el carrito
        let existente = carrito.find(item => item.nombre === productoTemporal.nombre && item.talla === productoTemporal.talla);

        if (existente) {
            existente.cantidad += 1; // Si existe, solo suma 1 a la cantidad
        } else {
            carrito.push({ ...productoTemporal, cantidad: 1 }); // Si no, lo agrega como nuevo
        }

        actualizarContador();
        cerrarModalTalla(); // Cierra el selector de tallas
        
        // Muestra un mensaje temporal de éxito
        abrirModal(`<p style="color:#25d366">✅ <b>${productoTemporal.nombre}</b> (Talla ${productoTemporal.talla}) añadido</p>`, true);
        setTimeout(cerrarModal, 1200); // Se cierra solo después de 1.2 segundos
    };

    // --- VER EL CONTENIDO DEL CARRITO ---
    // Se activa al hacer clic en el icono de la bolsa/carrito del menú
    iconoCarrito.onclick = function () {
        if (carrito.length === 0) {
            abrirModal("<p>Tu carrito está vacío 🛒</p>", true);
            return;
        }

        // Construye el HTML de la lista de productos comprados
        let listaHTML = '<div class="carrito-listado">';
        carrito.forEach(function (item, index) {
            listaHTML += `
                <div class="item-carrito">
                    <img src="${item.imagen}" class="img-mini">
                    <div class="info-item">
                        <p class="nom">${item.nombre}</p>
                        <p class="det">${item.precio} | Talla: ${item.talla} | Cant: ${item.cantidad}</p>
                    </div>
                    <button class="btn-eliminar" data-index="${index}">🗑</button>
                </div>`;
        });
        listaHTML += "</div>";

        abrirModal(listaHTML);
    };

    // --- FUNCIÓN: ACTUALIZAR CONTADOR ---
    // Calcula la suma total de productos (considerando cantidades)
    function actualizarContador() {
        let totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
    }
});

// --- FUNCIONES GLOBALES DE CIERRE ---
// Se definen fuera porque pueden ser llamadas desde el HTML (onclick)
function cerrarModalTalla() {
    document.getElementById("modalProducto").classList.remove("modal-active");
}

function cerrarModal() {
    document.getElementById("miModalCarrito").classList.remove("modal-active");
}

// --- LÓGICA DEL BUSCADOR ---
// Filtra las miniaturas de productos según lo que el usuario escribe
let inputBusqueda = document.getElementById("buscador");
if(inputBusqueda) {
    inputBusqueda.addEventListener("keyup", function() {
        let filtro = inputBusqueda.value.toLowerCase();
        let productos = document.querySelectorAll(".miniatura");

        productos.forEach(producto => {
            let texto = producto.querySelector("h3").textContent.toLowerCase();
            // Si el nombre incluye el texto de búsqueda, lo muestra; si no, lo oculta
            producto.style.display = texto.includes(filtro) ? "" : "none";
        });
    });
}