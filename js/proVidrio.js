const canvasPadre = document.getElementById("canvasPadre");
const ctx = canvasPadre.getContext("2d");

const HOJA_ANCHO = 330; // cm
const HOJA_ALTO = 214; // cm
const ESCALA = 2; // Escala para visualización

let vidrios = []; // Array para almacenar los vidrios
let vidrioSeleccionado = null; // Vidrio seleccionado para mover, modificar o eliminar
let offsetX = 0; // Desplazamiento en X al mover un vidrio
let offsetY = 0; // Desplazamiento en Y al mover un vidrio

// Dibujar el canvas principal (plancha de vidrio)
function dibujarCanvasPadre() {
    ctx.clearRect(0, 0, canvasPadre.width, canvasPadre.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, HOJA_ANCHO * ESCALA, HOJA_ALTO * ESCALA);
}

// Agregar un vidrio al canvas
function agregarVidrio() {
    const ancho = parseFloat(document.getElementById("ancho").value);
    const alto = parseFloat(document.getElementById("alto").value);

    if (ancho && alto) {
        const vidrio = {
            id: vidrios.length + 1,
            ancho: ancho,
            alto: alto,
            x: 0,
            y: 0
        };
        vidrios.push(vidrio);
        actualizarInputsVidrios();
        dibujarVidriosYResiduo();
    } else {
        alert("Por favor, ingresa valores válidos para ancho y alto.");
    }
}

// Actualizar los inputs dinámicos para cada vidrio
function actualizarInputsVidrios() {
    const contenedorInputs = document.getElementById("vidrio-inputs");
    contenedorInputs.innerHTML = ""; // Limpiar inputs anteriores

    vidrios.forEach((vidrio, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h4>Vidrio ${vidrio.id}</h4>
            <label for="ancho-${vidrio.id}">Ancho (cm):</label>
            <input type="number" id="ancho-${vidrio.id}" value="${vidrio.ancho}" step="0.01" min="1" required>
            <label for="alto-${vidrio.id}">Alto (cm):</label>
            <input type="number" id="alto-${vidrio.id}" value="${vidrio.alto}" step="0.01" min="1" required>
        `;
        contenedorInputs.appendChild(div);

        // Agregar evento para actualizar el vidrio al cambiar los inputs
        const inputAncho = document.getElementById(`ancho-${vidrio.id}`);
        const inputAlto = document.getElementById(`alto-${vidrio.id}`);

        inputAncho.addEventListener("change", () => {
            vidrio.ancho = parseFloat(inputAncho.value);
            dibujarVidriosYResiduo();
        });

        inputAlto.addEventListener("change", () => {
            vidrio.alto = parseFloat(inputAlto.value);
            dibujarVidriosYResiduo();
        });
    });
}

// Dibujar todos los vidrios y el residuo en el canvas
function dibujarVidriosYResiduo() {
    dibujarCanvasPadre();

    // Dibujar los vidrios
    vidrios.forEach(vidrio => {
        ctx.fillStyle = "#ADD8E6";
        ctx.fillRect(vidrio.x * ESCALA, vidrio.y * ESCALA, vidrio.ancho * ESCALA, vidrio.alto * ESCALA);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(vidrio.x * ESCALA, vidrio.y * ESCALA, vidrio.ancho * ESCALA, vidrio.alto * ESCALA);

        // Mostrar las dimensiones del vidrio
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        const texto = `V${vidrio.id}: ${vidrio.ancho.toFixed(2)}x${vidrio.alto.toFixed(2)}`;
        const anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(
            texto,
            vidrio.x * ESCALA + (vidrio.ancho * ESCALA) / 2 - anchoTexto / 2,
            vidrio.y * ESCALA + (vidrio.alto * ESCALA) / 2 + 6
        );
    });

    // Dibujar el residuo (área no ocupada)
    const areasResiduo = calcularAreasResiduo();
    areasResiduo.forEach(area => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Blanco semitransparente
        ctx.fillRect(area.x * ESCALA, area.y * ESCALA, area.ancho * ESCALA, area.alto * ESCALA);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x * ESCALA, area.y * ESCALA, area.ancho * ESCALA, area.alto * ESCALA);

        // Mostrar las dimensiones del residuo
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        const texto = `${area.ancho.toFixed(2)}x${area.alto.toFixed(2)}`;
        const anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(
            texto,
            area.x * ESCALA + (area.ancho * ESCALA) / 2 - anchoTexto / 2,
            area.y * ESCALA + (area.alto * ESCALA) / 2 + 6
        );
    });
}

// Calcular las áreas de residuo
function calcularAreasResiduo() {
    const areasResiduo = [];
    const areaTotal = { x: 0, y: 0, ancho: HOJA_ANCHO, alto: HOJA_ALTO };

    // Calcular el área ocupada por los vidrios
    const areaOcupada = vidrios.map(vidrio => ({
        x: vidrio.x,
        y: vidrio.y,
        ancho: vidrio.ancho,
        alto: vidrio.alto
    }));

    // Calcular el área de residuo
    areasResiduo.push(areaTotal);
    areaOcupada.forEach(vidrio => {
        const nuevasAreas = [];
        areasResiduo.forEach(area => {
            const interseccion = {
                x: Math.max(area.x, vidrio.x),
                y: Math.max(area.y, vidrio.y),
                ancho: Math.min(area.x + area.ancho, vidrio.x + vidrio.ancho) - Math.max(area.x, vidrio.x),
                alto: Math.min(area.y + area.alto, vidrio.y + vidrio.alto) - Math.max(area.y, vidrio.y)
            };

            if (interseccion.ancho > 0 && interseccion.alto > 0) {
                // Dividir el área de residuo en 4 partes (arriba, abajo, izquierda, derecha)
                if (interseccion.y > area.y) {
                    nuevasAreas.push({
                        x: area.x,
                        y: area.y,
                        ancho: area.ancho,
                        alto: interseccion.y - area.y
                    });
                }
                if (interseccion.y + interseccion.alto < area.y + area.alto) {
                    nuevasAreas.push({
                        x: area.x,
                        y: interseccion.y + interseccion.alto,
                        ancho: area.ancho,
                        alto: area.y + area.alto - (interseccion.y + interseccion.alto)
                    });
                }
                if (interseccion.x > area.x) {
                    nuevasAreas.push({
                        x: area.x,
                        y: interseccion.y,
                        ancho: interseccion.x - area.x,
                        alto: interseccion.alto
                    });
                }
                if (interseccion.x + interseccion.ancho < area.x + area.ancho) {
                    nuevasAreas.push({
                        x: interseccion.x + interseccion.ancho,
                        y: interseccion.y,
                        ancho: area.x + area.ancho - (interseccion.x + interseccion.ancho),
                        alto: interseccion.alto
                    });
                }
            } else {
                nuevasAreas.push(area);
            }
        });
        areasResiduo.length = 0;
        areasResiduo.push(...nuevasAreas);
    });

    return areasResiduo;
}

// Seleccionar un vidrio
canvasPadre.addEventListener("mousedown", (e) => {
    const rect = canvasPadre.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / ESCALA;
    const mouseY = (e.clientY - rect.top) / ESCALA;

    // Verificar si se hizo clic en un vidrio
    vidrioSeleccionado = vidrios.find(vidrio =>
        mouseX >= vidrio.x &&
        mouseX <= vidrio.x + vidrio.ancho &&
        mouseY >= vidrio.y &&
        mouseY <= vidrio.y + vidrio.alto
    );

    if (vidrioSeleccionado) {
        // Habilitar botones de modificar y eliminar
        document.getElementById("btnModificar").disabled = false;
        document.getElementById("btnEliminar").disabled = false;

        // Calcular el desplazamiento al hacer clic
        offsetX = mouseX - vidrioSeleccionado.x;
        offsetY = mouseY - vidrioSeleccionado.y;
    } else {
        // Deshabilitar botones si no se selecciona un vidrio
        document.getElementById("btnModificar").disabled = true;
        document.getElementById("btnEliminar").disabled = true;
    }
});

// Mover un vidrio
canvasPadre.addEventListener("mousemove", (e) => {
    if (vidrioSeleccionado) {
        const rect = canvasPadre.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / ESCALA;
        const mouseY = (e.clientY - rect.top) / ESCALA;

        // Mover el vidrio
        vidrioSeleccionado.x = mouseX - offsetX;
        vidrioSeleccionado.y = mouseY - offsetY;

        // Limitar el movimiento dentro del canvas
        vidrioSeleccionado.x = Math.max(0, Math.min(HOJA_ANCHO - vidrioSeleccionado.ancho, vidrioSeleccionado.x));
        vidrioSeleccionado.y = Math.max(0, Math.min(HOJA_ALTO - vidrioSeleccionado.alto, vidrioSeleccionado.y));

        dibujarVidriosYResiduo();
    }
});

// Soltar un vidrio
canvasPadre.addEventListener("mouseup", () => {
    vidrioSeleccionado = null;
});

// Modificar un vidrio
function modificarVidrio() {
    if (vidrioSeleccionado) {
        const nuevoAncho = parseFloat(prompt("Nuevo ancho (cm):", vidrioSeleccionado.ancho));
        const nuevoAlto = parseFloat(prompt("Nuevo alto (cm):", vidrioSeleccionado.alto));

        if (nuevoAncho && nuevoAlto) {
            vidrioSeleccionado.ancho = nuevoAncho;
            vidrioSeleccionado.alto = nuevoAlto;
            actualizarInputsVidrios();
            dibujarVidriosYResiduo();
        } else {
            alert("Por favor, ingresa valores válidos para ancho y alto.");
        }
    }
}

// Eliminar un vidrio
function eliminarVidrio() {
    if (!vidrioSeleccionado || !vidrioSeleccionado.id) {
        alert("Ningún vidrio seleccionado.");
        return;
    }

    console.log("Vidrio seleccionado antes de eliminar:", vidrioSeleccionado);

    if (confirm("¿Estás seguro de eliminar este vidrio?")) {
        // Filtrar el vidrio seleccionado
        vidrios = vidrios.filter(vidrio => vidrio.id !== vidrioSeleccionado.id);
        
        console.log("Vidrios restantes después de eliminar:", vidrios);

        // Restablecer la selección
        vidrioSeleccionado = null;

        // Actualizar la UI
        actualizarInputsVidrios();
        dibujarVidriosYResiduo();

        // Deshabilitar botones si existen
        const btnModificar = document.getElementById("btnModificar");
        const btnEliminar = document.getElementById("btnEliminar");

        if (btnModificar) btnModificar.disabled = true;
        if (btnEliminar) btnEliminar.disabled = true;
    }
}


// Inicializar el canvas
dibujarCanvasPadre();