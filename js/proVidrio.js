
"use strict";

// =====================================================
// PRO VIDRIOS - MULTIPLES PLANCHAS
// Medida estándar: 330 x 214 cm
// =====================================================

const HOJA_ANCHO = 330;
const HOJA_ALTO = 214;
const ESCALA = 2;
const TOLERANCIA = 0.001;

const canvas = document.getElementById("canvasPadre");
const ctx = canvas.getContext("2d");

let planchas = [];
let planchaActivaId = 1;
let vidrioSeleccionado = null;
let arrastrando = false;
let offsetX = 0;
let offsetY = 0;
let siguienteId = 1;
let siguientePlanchaId = 1;

// =====================================================
// CREAR PLANCHA
// =====================================================

function crearPlancha() {
    const plancha = {
        id: siguientePlanchaId++,
        nombre: `Plancha ${siguientePlanchaId - 1}`,
        vidrios: []
    };

    planchas.push(plancha);
    planchaActivaId = plancha.id;
    vidrioSeleccionado = null;

    actualizarInterfaz();
    return plancha;
}

function obtenerPlanchaActiva() {
    return planchas.find(p => p.id === planchaActivaId);
}

function cambiarPlancha(id) {
    planchaActivaId = Number(id);
    vidrioSeleccionado = null;
    arrastrando = false;
    actualizarInterfaz();
}

// =====================================================
// DIMENSIONES SEGUN ROTACION
// =====================================================

function anchoReal(v) {
    return (v.rotation === 90 || v.rotation === 270)
        ? v.alto
        : v.ancho;
}

function altoReal(v) {
    return (v.rotation === 90 || v.rotation === 270)
        ? v.ancho
        : v.alto;
}

// =====================================================
// OBTENER TODOS LOS VIDRIOS DEL TRABAJO
// =====================================================

function obtenerTodosLosVidrios() {
    return planchas.flatMap(p => p.vidrios);
}

function contarNumeroVidrio(numero) {
    return obtenerTodosLosVidrios().filter(
        v => v.numero === numero
    ).length;
}

// =====================================================
// DIBUJAR PLANCHA
// =====================================================

function dibujarCanvasPadre() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(
        0,
        0,
        HOJA_ANCHO * ESCALA,
        HOJA_ALTO * ESCALA
    );

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        0,
        0,
        HOJA_ANCHO * ESCALA,
        HOJA_ALTO * ESCALA
    );

    ctx.fillStyle = "#64748b";
    ctx.font = "11px Arial";
    ctx.fillText(`${HOJA_ANCHO} cm`, 8, 14);

    ctx.save();
    ctx.translate(12, canvas.height - 8);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${HOJA_ALTO} cm`, 0, 0);
    ctx.restore();
}

// =====================================================
// CALCULAR ESPACIOS SOBRANTES
// =====================================================

function calcularAreasResiduo() {
    const plancha = obtenerPlanchaActiva();

    if (!plancha) return [];

    let areas = [{
        x: 0,
        y: 0,
        ancho: HOJA_ANCHO,
        alto: HOJA_ALTO
    }];

    plancha.vidrios.forEach(v => {
        const pieza = {
            x: v.x,
            y: v.y,
            ancho: anchoReal(v),
            alto: altoReal(v)
        };

        const nuevasAreas = [];

        areas.forEach(area => {
            const izquierda = Math.max(area.x, pieza.x);
            const arriba = Math.max(area.y, pieza.y);

            const derecha = Math.min(
                area.x + area.ancho,
                pieza.x + pieza.ancho
            );

            const abajo = Math.min(
                area.y + area.alto,
                pieza.y + pieza.alto
            );

            const anchoInterseccion = derecha - izquierda;
            const altoInterseccion = abajo - arriba;

            if (
                anchoInterseccion <= TOLERANCIA ||
                altoInterseccion <= TOLERANCIA
            ) {
                nuevasAreas.push(area);
                return;
            }

            // Sobrante superior
            if (arriba - area.y > TOLERANCIA) {
                nuevasAreas.push({
                    x: area.x,
                    y: area.y,
                    ancho: area.ancho,
                    alto: arriba - area.y
                });
            }

            // Sobrante inferior
            if (area.y + area.alto - abajo > TOLERANCIA) {
                nuevasAreas.push({
                    x: area.x,
                    y: abajo,
                    ancho: area.ancho,
                    alto: area.y + area.alto - abajo
                });
            }

            // Sobrante izquierdo
            if (izquierda - area.x > TOLERANCIA) {
                nuevasAreas.push({
                    x: area.x,
                    y: arriba,
                    ancho: izquierda - area.x,
                    alto: altoInterseccion
                });
            }

            // Sobrante derecho
            if (area.x + area.ancho - derecha > TOLERANCIA) {
                nuevasAreas.push({
                    x: derecha,
                    y: arriba,
                    ancho: area.x + area.ancho - derecha,
                    alto: altoInterseccion
                });
            }
        });

        areas = nuevasAreas;
    });

    return areas.filter(a =>
        a.ancho > TOLERANCIA &&
        a.alto > TOLERANCIA
    );
}

// =====================================================
// DIBUJAR SOBRANTES Y VIDRIOS
// =====================================================

function dibujarVidriosYResiduo() {
    dibujarCanvasPadre();

    const plancha = obtenerPlanchaActiva();
    if (!plancha) return;

    const areasResiduo = calcularAreasResiduo();

    // Dibujar espacios libres
    areasResiduo.forEach((area, indice) => {
        ctx.fillStyle = indice % 2 === 0
            ? "rgba(34, 197, 94, 0.16)"
            : "rgba(16, 185, 129, 0.12)";

        ctx.fillRect(
            area.x * ESCALA,
            area.y * ESCALA,
            area.ancho * ESCALA,
            area.alto * ESCALA
        );

        ctx.strokeStyle = "#16a34a";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);

        ctx.strokeRect(
            area.x * ESCALA,
            area.y * ESCALA,
            area.ancho * ESCALA,
            area.alto * ESCALA
        );

        ctx.setLineDash([]);

        if (
            area.ancho * ESCALA >= 45 &&
            area.alto * ESCALA >= 22
        ) {
            ctx.save();
            ctx.fillStyle = "#166534";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                `${area.ancho.toFixed(1)} × ${area.alto.toFixed(1)}`,
                (area.x + area.ancho / 2) * ESCALA,
                (area.y + area.alto / 2) * ESCALA,
                area.ancho * ESCALA - 4
            );

            ctx.restore();
        }
    });

    // Dibujar vidrios
    plancha.vidrios.forEach(v => {
        const ancho = anchoReal(v);
        const alto = altoReal(v);

        ctx.fillStyle = v === vidrioSeleccionado
            ? "#93c5fd"
            : "#ADD8E6";

        ctx.fillRect(
            v.x * ESCALA,
            v.y * ESCALA,
            ancho * ESCALA,
            alto * ESCALA
        );

        ctx.strokeStyle = v === vidrioSeleccionado
            ? "#1d4ed8"
            : "#172033";

        ctx.lineWidth = v === vidrioSeleccionado ? 3 : 1.5;

        ctx.strokeRect(
            v.x * ESCALA,
            v.y * ESCALA,
            ancho * ESCALA,
            alto * ESCALA
        );

        ctx.save();
        ctx.fillStyle = "#102033";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 11px Arial";

        ctx.fillText(
            `N° ${v.numero}`,
            (v.x + ancho / 2) * ESCALA,
            (v.y + alto / 2) * ESCALA - 7
        );

        ctx.font = "10px Arial";
        ctx.fillText(
            `${ancho.toFixed(1)} × ${alto.toFixed(1)}`,
            (v.x + ancho / 2) * ESCALA,
            (v.y + alto / 2) * ESCALA + 7,
            Math.max(10, ancho * ESCALA - 4)
        );

        if (v.rotation) {
            ctx.font = "9px Arial";
            ctx.fillText(
                `${v.rotation}°`,
                (v.x + ancho / 2) * ESCALA,
                (v.y + alto / 2) * ESCALA + 20
            );
        }

        ctx.restore();
    });

    actualizarResumen(areasResiduo);
}

// =====================================================
// VALIDAR POSICION
// =====================================================

function posicionValida(v, x, y) {
    const ancho = anchoReal(v);
    const alto = altoReal(v);
    const plancha = obtenerPlanchaActiva();

    if (!plancha) return false;

    if (
        x < 0 ||
        y < 0 ||
        x + ancho > HOJA_ANCHO + TOLERANCIA ||
        y + alto > HOJA_ALTO + TOLERANCIA
    ) {
        return false;
    }

    return !plancha.vidrios.some(otro => {
        if (otro.id === v.id) return false;

        const otroAncho = anchoReal(otro);
        const otroAlto = altoReal(otro);

        return (
            x < otro.x + otroAncho - TOLERANCIA &&
            x + ancho > otro.x + TOLERANCIA &&
            y < otro.y + otroAlto - TOLERANCIA &&
            y + alto > otro.y + TOLERANCIA
        );
    });
}

// =====================================================
// BUSCAR HUECO EN LA PLANCHA ACTIVA
// =====================================================

function buscarHueco(ancho, alto) {
    const areas = calcularAreasResiduo().sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });

    for (const area of areas) {
        if (
            ancho <= area.ancho + TOLERANCIA &&
            alto <= area.alto + TOLERANCIA
        ) {
            return {
                x: area.x,
                y: area.y,
                rotation: 0
            };
        }

        if (
            alto <= area.ancho + TOLERANCIA &&
            ancho <= area.alto + TOLERANCIA
        ) {
            return {
                x: area.x,
                y: area.y,
                rotation: 90
            };
        }
    }

    return null;
}

// =====================================================
// AGREGAR VIDRIO CON NUMERO MANUAL
// =====================================================

function agregarVidrio() {
    const numeroInput = document.getElementById("numeroVidrio");
    const anchoInput = document.getElementById("ancho");
    const altoInput = document.getElementById("alto");

    const numero = numeroInput.value.trim();
    const ancho = parseFloat(anchoInput.value);
    const alto = parseFloat(altoInput.value);

    if (!numero) {
        alert("Ingrese el número del vidrio.");
        numeroInput.focus();
        return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(numero)) {
        alert("Use números, letras o guiones en el identificador.");
        numeroInput.focus();
        return;
    }

    if (contarNumeroVidrio(numero) >= 2) {
        alert(
            `El número ${numero} ya tiene dos vidrios registrados. ` +
            "No se permite una tercera pieza con el mismo número."
        );
        return;
    }

    if (
        !Number.isFinite(ancho) ||
        !Number.isFinite(alto) ||
        ancho <= 0 ||
        alto <= 0
    ) {
        alert("Ingrese medidas válidas para el vidrio.");
        return;
    }

    if (
        (ancho > HOJA_ANCHO || alto > HOJA_ALTO) &&
        (alto > HOJA_ANCHO || ancho > HOJA_ALTO)
    ) {
        alert("El vidrio no cabe en una plancha estándar, ni girándolo.");
        return;
    }

    const posicion = buscarHueco(ancho, alto);

    if (!posicion) {
        alert(
            "No hay espacio disponible en esta plancha. " +
            "Agregue otra plancha para continuar."
        );
        return;
    }

    const vidrio = {
        id: siguienteId++,
        numero,
        ancho,
        alto,
        x: posicion.x,
        y: posicion.y,
        rotation: posicion.rotation
    };

    obtenerPlanchaActiva().vidrios.push(vidrio);

    numeroInput.value = "";
    anchoInput.value = "";
    altoInput.value = "";

    seleccionarVidrio(vidrio);
    actualizarInterfaz();
}

// =====================================================
// SELECCIONAR VIDRIO
// =====================================================

function seleccionarVidrio(v) {
    vidrioSeleccionado = v;

    document.getElementById("btnModificar").disabled = !v;
    document.getElementById("btnEliminar").disabled = !v;

    actualizarListaVidrios();
    dibujarVidriosYResiduo();
}

// =====================================================
// MODIFICAR VIDRIO
// =====================================================

function modificarVidrio() {
    if (!vidrioSeleccionado) return;

    const nuevoAncho = parseFloat(
        prompt("Nuevo ancho (cm):", vidrioSeleccionado.ancho)
    );

    if (!Number.isFinite(nuevoAncho) || nuevoAncho <= 0) return;

    const nuevoAlto = parseFloat(
        prompt("Nuevo alto (cm):", vidrioSeleccionado.alto)
    );

    if (!Number.isFinite(nuevoAlto) || nuevoAlto <= 0) return;

    const anterior = {
        ancho: vidrioSeleccionado.ancho,
        alto: vidrioSeleccionado.alto
    };

    vidrioSeleccionado.ancho = nuevoAncho;
    vidrioSeleccionado.alto = nuevoAlto;

    if (!posicionValida(
        vidrioSeleccionado,
        vidrioSeleccionado.x,
        vidrioSeleccionado.y
    )) {
        vidrioSeleccionado.ancho = anterior.ancho;
        vidrioSeleccionado.alto = anterior.alto;

        alert("Las nuevas dimensiones no caben en la posición actual.");
        dibujarVidriosYResiduo();
        return;
    }

    actualizarInterfaz();
}

// =====================================================
// ROTAR VIDRIO
// =====================================================

function rotarVidrio(grados) {
    if (!vidrioSeleccionado) return;

    const anterior = vidrioSeleccionado.rotation || 0;

    vidrioSeleccionado.rotation =
        (anterior + grados) % 360;

    if (!posicionValida(
        vidrioSeleccionado,
        vidrioSeleccionado.x,
        vidrioSeleccionado.y
    )) {
        vidrioSeleccionado.rotation = anterior;
        alert("La pieza no cabe en esa orientación.");
        return;
    }

    actualizarInterfaz();
}

// =====================================================
// ELIMINAR VIDRIO
// =====================================================

function eliminarVidrio() {
    if (!vidrioSeleccionado) return;

    const plancha = planchas.find(p =>
        p.vidrios.some(v => v.id === vidrioSeleccionado.id)
    );

    if (!plancha) return;

    plancha.vidrios = plancha.vidrios.filter(
        v => v.id !== vidrioSeleccionado.id
    );

    vidrioSeleccionado = null;

    document.getElementById("btnModificar").disabled = true;
    document.getElementById("btnEliminar").disabled = true;

    actualizarInterfaz();
}

// =====================================================
// LISTA DE VIDRIOS DE LA PLANCHA ACTIVA
// =====================================================

function actualizarListaVidrios() {
    const contenedor = document.getElementById("vidrio-inputs");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const plancha = obtenerPlanchaActiva();
    if (!plancha) return;

    plancha.vidrios.forEach(v => {
        const elemento = document.createElement("div");
        elemento.className = "vidrio-item";

        if (v === vidrioSeleccionado) {
            elemento.classList.add("seleccionado");
        }

        elemento.innerHTML = `
            <div class="vidrio-info">
                <strong>Vidrio N° ${v.numero}</strong>
                <span>${anchoReal(v).toFixed(1)} × ${altoReal(v).toFixed(1)} cm</span>
                <small>Rotación: ${v.rotation || 0}°</small>
            </div>
            <div class="vidrio-acciones">
                <button type="button" class="btn-rotar-90">90°</button>
                <button type="button" class="btn-rotar-180">180°</button>
            </div>
        `;

        elemento.addEventListener("click", () => seleccionarVidrio(v));

        elemento.querySelector(".btn-rotar-90")
            .addEventListener("click", event => {
                event.stopPropagation();
                seleccionarVidrio(v);
                rotarVidrio(90);
            });

        elemento.querySelector(".btn-rotar-180")
            .addEventListener("click", event => {
                event.stopPropagation();
                seleccionarVidrio(v);
                rotarVidrio(180);
            });

        contenedor.appendChild(elemento);
    });
}

// =====================================================
// RESUMEN DE LA PLANCHA ACTIVA
// =====================================================

function actualizarResumen(areasResiduo = calcularAreasResiduo()) {
    const plancha = obtenerPlanchaActiva();
    if (!plancha) return;

    const areaTotal = HOJA_ANCHO * HOJA_ALTO;

    const areaUsada = plancha.vidrios.reduce(
        (suma, v) => suma + v.ancho * v.alto,
        0
    );

    const areaLibre = areasResiduo.reduce(
        (suma, a) => suma + a.ancho * a.alto,
        0
    );

    const porcentaje = areaUsada / areaTotal * 100;

    let resumen = document.getElementById("resumenVidrio");

    if (!resumen) {
        resumen = document.createElement("div");
        resumen.id = "resumenVidrio";
        resumen.className = "resumen-vidrio";
        document.querySelector(".canvas-container").appendChild(resumen);
    }

    resumen.innerHTML = `
        <strong>${plancha.nombre}</strong>
        <br>
        Piezas: ${plancha.vidrios.length}
        <br>
        Área ocupada: ${areaUsada.toFixed(2)} cm²
        <br>
        Área libre: ${areaLibre.toFixed(2)} cm²
        <br>
        Sobrantes: ${areasResiduo.length}
        <br>
        Aprovechamiento: ${porcentaje.toFixed(2)}%
    `;

    let lista = document.getElementById("listaSobrantes");

    if (!lista) {
        lista = document.createElement("div");
        lista.id = "listaSobrantes";
        lista.className = "lista-sobrantes";
        document.querySelector(".canvas-container").appendChild(lista);
    }

    lista.innerHTML = areasResiduo.length
        ? `
            <strong>Medidas de los sobrantes</strong>
            <ul>
                ${areasResiduo.map((a, i) => `
                    <li>
                        Sobrante ${i + 1}:
                        ${a.ancho.toFixed(1)} × ${a.alto.toFixed(1)} cm
                    </li>
                `).join("")}
            </ul>
        `
        : "<strong>No hay sobrantes disponibles.</strong>";
}

// =====================================================
// CONTROLES DE PLANCHAS
// =====================================================

function crearControlesPlanchas() {
    const contenedor = document.querySelector(".canvas-container");

    if (!document.getElementById("controlesPlanchas")) {
        const controles = document.createElement("div");
        controles.id = "controlesPlanchas";
        controles.className = "controles-planchas";

        controles.innerHTML = `
            <div class="cabecera-planchas">
                <strong>Planchas de vidrio</strong>
                <button type="button" id="btnAgregarPlancha">
                    + Agregar plancha
                </button>
            </div>
            <div id="pestanasPlanchas" class="pestanas-planchas"></div>
        `;

        contenedor.insertBefore(controles, canvas);

        document.getElementById("btnAgregarPlancha")
            .addEventListener("click", crearPlancha);
    }
}

function actualizarPestanasPlanchas() {
    const pestanas = document.getElementById("pestanasPlanchas");
    if (!pestanas) return;

    pestanas.innerHTML = "";

    planchas.forEach(p => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "pestana-plancha";

        if (p.id === planchaActivaId) {
            boton.classList.add("activa");
        }

        boton.textContent = `${p.nombre} (${p.vidrios.length})`;

        boton.addEventListener("click", () => cambiarPlancha(p.id));

        pestanas.appendChild(boton);
    });
}

// =====================================================
// RESUMEN GENERAL DEL TRABAJO Y PAREJAS
// =====================================================

function actualizarResumenGeneral() {
    let contenedor = document.getElementById("resumenGeneral");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "resumenGeneral";
        contenedor.className = "resumen-general";

        document.querySelector(".form-container")
            .appendChild(contenedor);
    }

    const todos = obtenerTodosLosVidrios();

    const numeros = [...new Set(todos.map(v => v.numero))];

    const parejas = numeros.filter(n => contarNumeroVidrio(n) === 2);
    const individuales = numeros.filter(n => contarNumeroVidrio(n) === 1);

    contenedor.innerHTML = `
        <strong>Resumen del trabajo</strong>
        <br>
        Planchas: ${planchas.length}
        <br>
        Total de vidrios: ${todos.length}
        <br>
        Conjuntos de dos piezas: ${parejas.length}
        <br>
        Números individuales: ${individuales.length}
    `;
}

// =====================================================
// ACTUALIZAR TODA LA INTERFAZ
// =====================================================

function actualizarInterfaz() {
    actualizarPestanasPlanchas();
    actualizarListaVidrios();
    dibujarVidriosYResiduo();
    actualizarResumenGeneral();
}

// =====================================================
// EVENTOS DEL CANVAS: ARRASTRAR
// =====================================================

function obtenerPosicionCanvas(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) *
            (canvas.width / rect.width) / ESCALA,

        y: (event.clientY - rect.top) *
            (canvas.height / rect.height) / ESCALA
    };
}

canvas.addEventListener("pointerdown", event => {
    const posicion = obtenerPosicionCanvas(event);
    const plancha = obtenerPlanchaActiva();

    if (!plancha) return;

    const encontrado = [...plancha.vidrios].reverse().find(v => {
        return (
            posicion.x >= v.x &&
            posicion.x <= v.x + anchoReal(v) &&
            posicion.y >= v.y &&
            posicion.y <= v.y + altoReal(v)
        );
    });

    if (!encontrado) {
        seleccionarVidrio(null);
        return;
    }

    seleccionarVidrio(encontrado);

    arrastrando = true;
    offsetX = posicion.x - encontrado.x;
    offsetY = posicion.y - encontrado.y;

    canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", event => {
    if (!arrastrando || !vidrioSeleccionado) return;

    const posicion = obtenerPosicionCanvas(event);

    const nuevoX = Math.max(
        0,
        Math.min(
            posicion.x - offsetX,
            HOJA_ANCHO - anchoReal(vidrioSeleccionado)
        )
    );

    const nuevoY = Math.max(
        0,
        Math.min(
            posicion.y - offsetY,
            HOJA_ALTO - altoReal(vidrioSeleccionado)
        )
    );

    if (posicionValida(vidrioSeleccionado, nuevoX, nuevoY)) {
        vidrioSeleccionado.x = nuevoX;
        vidrioSeleccionado.y = nuevoY;
        dibujarVidriosYResiduo();
    }
});

function terminarArrastre() {
    arrastrando = false;
    actualizarListaVidrios();
}

canvas.addEventListener("pointerup", terminarArrastre);
canvas.addEventListener("pointercancel", terminarArrastre);
canvas.addEventListener("lostpointercapture", terminarArrastre);

// =====================================================
// INICIALIZAR APLICACION
// =====================================================

function inicializarProVidrios() {
    canvas.width = HOJA_ANCHO * ESCALA;
    canvas.height = HOJA_ALTO * ESCALA;

    // Crear el campo de número manual.
    const form = document.querySelector(".form-container");
    const botonAgregar = form.querySelector(
        'button[onclick="agregarVidrio()"]'
    );

    if (!document.getElementById("campoNumeroVidrio")) {
        const grupo = document.createElement("div");
        grupo.id = "campoNumeroVidrio";
        grupo.className = "campo-numero-vidrio";

        grupo.innerHTML = `
            <label for="numeroVidrio">Número de vidrio:</label>
            <input
                type="text"
                id="numeroVidrio"
                placeholder="Ejemplo: 01"
                maxlength="20"
                autocomplete="off"
            >
            <small>Se permite registrar hasta dos piezas por número.</small>
        `;

        form.insertBefore(grupo, form.querySelector("label[for='ancho']"));
    }

    crearControlesPlanchas();

    document.getElementById("btnModificar").disabled = true;
    document.getElementById("btnEliminar").disabled = true;

    crearPlancha();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarProVidrios);
} else {
    inicializarProVidrios();
}
