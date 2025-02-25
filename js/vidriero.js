let canvasContainer = document.querySelector(".canvas-container");
let btnGenerar = document.querySelector(".vidrioVentana");
let vidriero = [];

const HOJA_ANCHO = 330; // cm
const HOJA_ALTO = 214; // cm
const SEPARACION_PLANCHAS = 30; // Separación entre planchas en píxeles

function dibujarCuadricula(ctx, canvas) {
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
}

function agruparEnTiras(vidrios) {
    const tiras = [];
    let tiraActual = { vidrios: [], ancho: 0, altura: 0 };

    for (const vidrio of vidrios) {
        if (tiraActual.altura + vidrio.alto <= HOJA_ALTO) {
            tiraActual.vidrios.push(vidrio);
            tiraActual.altura += vidrio.alto;
            tiraActual.ancho = Math.max(tiraActual.ancho, vidrio.ancho);
        } else {
            tiras.push(tiraActual);
            tiraActual = { vidrios: [vidrio], ancho: vidrio.ancho, altura: vidrio.alto };
        }
    }
    if (tiraActual.vidrios.length > 0) tiras.push(tiraActual);
    return tiras;
}

function agruparEnPlanchas(tiras) {
    const planchas = [];
    let planchaActual = { tiras: [], ancho: 0 };

    for (const tira of tiras) {
        if (planchaActual.ancho + tira.ancho <= HOJA_ANCHO) {
            planchaActual.tiras.push(tira);
            planchaActual.ancho += tira.ancho;
        } else {
            planchas.push(planchaActual);
            planchaActual = { tiras: [tira], ancho: tira.ancho };
        }
    }
    if (planchaActual.tiras.length > 0) planchas.push(planchaActual);
    return planchas;
}

function dibujarPlancha(plancha, planchaId) {
    const escala = 2; // Para mejor visualización
    const divPlancha = document.createElement("div");
    divPlancha.style.marginBottom = `${SEPARACION_PLANCHAS}px`; // Separación entre planchas
    canvasContainer.appendChild(divPlancha);

    const canvas = document.createElement("canvas");
    canvas.width = HOJA_ANCHO * escala;
    canvas.height = HOJA_ALTO * escala;
    divPlancha.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    dibujarCuadricula(ctx, canvas);

    let xOffset = 0;
    let sobranteTotalAncho = HOJA_ANCHO;
    let sobranteTotalAlto = 0;

    plancha.tiras.forEach(tira => {
        // Dibujar línea roja para delimitar la tira
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset, HOJA_ALTO * escala);
        ctx.stroke();

        let yOffset = 0;
        tira.vidrios.forEach(vidrio => {
            // Dibujar el vidrio
            ctx.fillStyle = "#ADD8E6";
            ctx.fillRect(xOffset, yOffset, vidrio.ancho * escala, vidrio.alto * escala);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(xOffset, yOffset, vidrio.ancho * escala, vidrio.alto * escala);

            // Dibujar texto con las dimensiones del vidrio (dos decimales)
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            const texto = `V${vidrio.numero}: ${vidrio.ancho.toFixed(2)}x${vidrio.alto.toFixed(2)}`;
            const anchoTexto = ctx.measureText(texto).width;
            ctx.fillText(texto, xOffset + 5, yOffset + 15);

            yOffset += vidrio.alto * escala;
        });

        // Calcular sobrante en altura para esta tira
        const sobranteAltoTira = HOJA_ALTO - tira.altura;
        sobranteTotalAlto += sobranteAltoTira;

        // Dibujar sobrante vertical si hay espacio sobrante en la tira
        if (yOffset < HOJA_ALTO * escala) {
            const sobranteAlto = HOJA_ALTO * escala - yOffset;
            ctx.fillStyle = "#555";
            ctx.fillRect(xOffset, yOffset, tira.ancho * escala, sobranteAlto);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(xOffset, yOffset, tira.ancho * escala, sobranteAlto);

            // Dibujar texto con las dimensiones del sobrante (dos decimales)
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            const txt = `${tira.ancho.toFixed(2)}x${(sobranteAlto / escala).toFixed(2)}`;
            const anchoTxt = ctx.measureText(txt).width;
            ctx.fillText(txt, xOffset + (tira.ancho * escala) / 2 - anchoTxt / 2, yOffset + sobranteAlto / 2);
        }

        xOffset += tira.ancho * escala;
        sobranteTotalAncho -= tira.ancho; // Actualizar sobrante total en ancho
    });

    // Dibujar sobrante en ancho si hay espacio sobrante en la plancha
    if (xOffset < HOJA_ANCHO * escala) {
        const sobranteAncho = HOJA_ANCHO * escala - xOffset;
        ctx.fillStyle = "#555";
        ctx.fillRect(xOffset, 0, sobranteAncho, HOJA_ALTO * escala);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xOffset, 0, sobranteAncho, HOJA_ALTO * escala);

        // Dibujar texto con las dimensiones del sobrante (dos decimales)
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        const txt = `${(sobranteAncho / escala).toFixed(2)}x${HOJA_ALTO.toFixed(2)}`;
        const anchoTxt = ctx.measureText(txt).width;
        ctx.fillText(txt, xOffset + sobranteAncho / 2 - anchoTxt / 2, (HOJA_ALTO * escala) / 2);
    }

    // Dibujar línea roja al final de la plancha
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xOffset, 0);
    ctx.lineTo(xOffset, HOJA_ALTO * escala);
    ctx.stroke();

    // Mostrar el sobrante total de la plancha
    const sobranteTotalTexto = `Sobrante total: ${sobranteTotalAncho.toFixed(2)} cm (ancho) x ${sobranteTotalAlto.toFixed(2)} cm (alto)`;
    const sobranteDiv = document.createElement("div");
    sobranteDiv.textContent = sobranteTotalTexto;
    sobranteDiv.style.fontFamily = "Arial, sans-serif";
    sobranteDiv.style.fontSize = "14px";
    sobranteDiv.style.marginTop = "10px";
    divPlancha.appendChild(sobranteDiv);
}

function generarDistribucion() {
    vidriero = [];

    // Leer los datos de la tabla y duplicar cada vidrio
    document.querySelectorAll("#tabla-calculos tr").forEach((fila, index) => {
        const ancho = fila.querySelector("td.vidrioAncho")?.textContent.trim();
        const alto = fila.querySelector("td.vidrioAlto")?.textContent.trim();

        if (ancho && alto) {
            const anchoCm = parseFloat(ancho.replace("m", "").trim()) * 100;
            const altoCm = parseFloat(alto.replace("m", "").trim()) * 100;

            // Agregar dos unidades de cada vidrio
            vidriero.push({
                numero: index + 1,
                ancho: anchoCm,
                alto: altoCm
            });
            vidriero.push({
                numero: index + 1,
                ancho: anchoCm,
                alto: altoCm
            });
        }
    });

    // Ordenar los vidrios por altura (de mayor a menor)
    vidriero.sort((a, b) => b.alto - a.alto);

    // Agrupar en tiras y planchas
    const tiras = agruparEnTiras(vidriero);
    const planchas = agruparEnPlanchas(tiras);

    // Limpiar el contenedor de canvases y dibujar las planchas
    canvasContainer.innerHTML = '';
    planchas.forEach((plancha, idx) => {
        dibujarPlancha(plancha, `plancha_${idx + 1}`);
    });

    // Generar el JSON de distribución
    generarJSONDistribucion();
}

function generarJSONDistribucion() {
    const distribucionJSON = JSON.stringify({ vidrios: vidriero }, null, 4);
    document.querySelector(".containerJSON").innerText = distribucionJSON;
}

btnGenerar.addEventListener("click", generarDistribucion);