document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tabla-calculos").getElementsByTagName('tbody')[0];
    const btnAgregarFila = document.getElementById("agregar-fila");
    const btnCalcularTodo = document.getElementById("calcular-todo");
    
    // Función para agregar una nueva fila
    btnAgregarFila.addEventListener("click", function () {
        let fila = tabla.insertRow();
        fila.innerHTML = `
            <td><input type="number" step="0.01" class="ancho" placeholder="Ancho" /></td>
            <td><input type="number" step="0.01" class="alto" placeholder="Alto" /></td>
            <td class="area">0 m²</td>
            <td class="riel">0 m</td>
            <td class="jamba">0 m</td>
            <td class="vertical">0 m</td>
            <td class="horizontal">0 m</td>
            <td class="mallaAncho">0 m</td>
            <td class="mallaAlto">0 m</td>
            <td class="vidrioAncho">0 m</td>
            <td class="vidrioAlto">0 m</td>
            <td class="seguros">0 u</td>
            <td class="ruedas">0 u</td>
            <td class="esquineros">0 u</td>
            <td class="felpa">0 m</td>
            <td class="tornillosMedia">0 u</td>
            <td class="tornillosDosPulgadas">0 u</td>
            <td class="vinil">0 m</td>
            <td class="vinilPiola">0 m</td>
            <td>
                <button class="calcular">Calcular</button>
                <button class="limpiar">Limpiar</button>
                <button class="eliminar">eliminar</button>
            </td>
        `;
    });

    // Función para realizar los cálculos en una fila
    function calcularFila(fila) {
        let ancho = parseFloat(fila.querySelector(".ancho").value);
        let alto = parseFloat(fila.querySelector(".alto").value);

        if (isNaN(ancho) || isNaN(alto) || ancho <= 0 || alto <= 0) {
            alert("Por favor ingrese valores válidos para ancho y alto.");
            return;
        }

        // Cálculos
        let area = (ancho * alto).toFixed(3);
        let riel = ancho.toFixed(3);
        let jamba = (alto - 0.009).toFixed(3);
        let vertical = (alto - 0.028).toFixed(3);
        let horizontal = ((ancho - 0.108) / 2).toFixed(3);
        let mallaAncho = (((ancho - 0.108) / 2) + 0.030).toFixed(3);
        let mallaAlto = (alto - 0.030).toFixed(3);
        let vidrioAncho = (((ancho - 0.108) / 2) + 0.013).toFixed(3);
        let vidrioAlto = (alto -(0.028+0.067)).toFixed(3);
        let seguros = 1;
        let ruedas = 4;
        let esquineros = 8;
        let felpa = 0.5;
        let tornillosMedia = 10;
        let tornillosDosPulgadas = 8+5;
        let vinil = (2*(ancho + alto)).toFixed(3);
        
        // Actualizar las celdas con los resultados
        fila.querySelector(".area").textContent = area + " m²";
        fila.querySelector(".riel").textContent = riel + " m";
        fila.querySelector(".jamba").textContent = jamba + " m";
        fila.querySelector(".vertical").textContent = vertical + " m";
        fila.querySelector(".horizontal").textContent = horizontal + " m";
        fila.querySelector(".mallaAncho").textContent = mallaAncho + " m";
        fila.querySelector(".mallaAlto").textContent = mallaAlto + " m";
        fila.querySelector(".vidrioAncho").textContent = vidrioAncho + " m";
        fila.querySelector(".vidrioAlto").textContent = vidrioAlto + " m";
        fila.querySelector(".seguros").textContent = seguros + " u";
        fila.querySelector(".ruedas").textContent = ruedas + " u";
        fila.querySelector(".felpa").textContent = felpa + " m";
        fila.querySelector(".tornillosMedia").textContent = tornillosMedia + " m";
        fila.querySelector(".tornillosDosPulgadas").textContent = tornillosDosPulgadas + " u";
        fila.querySelector(".esquineros").textContent = esquineros + "u";
        fila.querySelector(".vinil").textContent = vinil + " m";
        // Actualizar los totales
        actualizarTotales();
    }


    // Función para calcular todas las filas a la vez
    btnCalcularTodo.addEventListener("click", function () {
        let filas = tabla.rows;
        for (let fila of filas) {
            // No calcular en la fila de totales
            if (fila.id !== 'totales') {
                calcularFila(fila);
            }
        }
    });

    // Función para actualizar los totales
    function actualizarTotales() {
        let filas = tabla.rows;
        let totalArea = 0;
        let totalRiel = 0;
        let totalJamba = 0;
        let totalVertical = 0;
        let totalHorizontal = 0;
        let totalMallaAncho = 0;
        let totalMallaAlto = 0;
        let totalVidrioAncho = 0;
        let totalVidrioAlto = 0;
        let totalSeguros = 0;
        let totalRuedas = 0;

        // Sumar los valores de cada columna
        for (let fila of filas) {
            if (fila.id !== 'totales') {
                let area = parseFloat(fila.querySelector(".area").textContent.replace(' m²', ''));
                let riel = parseFloat(fila.querySelector(".riel").textContent.replace(' m', ''));
                let jamba = parseFloat(fila.querySelector(".jamba").textContent.replace(' m', ''));
                let vertical = parseFloat(fila.querySelector(".vertical").textContent.replace(' m', ''));
                let horizontal = parseFloat(fila.querySelector(".horizontal").textContent.replace(' m', ''));
                let mallaAncho = parseFloat(fila.querySelector(".mallaAncho").textContent.replace(' m', ''));
                let mallaAlto = parseFloat(fila.querySelector(".mallaAlto").textContent.replace(' m', ''));
                let vidrioAncho = parseFloat(fila.querySelector(".vidrioAncho").textContent.replace(' m', ''));
                let vidrioAlto = parseFloat(fila.querySelector(".vidrioAlto").textContent.replace(' m' , "0"));
                let seguros = parseInt(fila.querySelector(".seguros").textContent.replace(' u' , "0"));
                let ruedas = parseInt(fila.querySelector(".ruedas").textContent.replace(' u' , "0"));
                totalArea += isNaN(area) ? 0 : area;
                totalRiel += isNaN(riel) ? 0 : riel;
                totalJamba += isNaN(jamba) ? 0 : jamba;
                totalVertical += isNaN(vertical) ? 0 : vertical;
                totalHorizontal += isNaN(horizontal) ? 0 : horizontal;
                totalMallaAncho += isNaN(mallaAncho) ? 0 : mallaAncho;
                totalMallaAlto += isNaN(mallaAlto) ? 0 : mallaAlto;
                totalVidrioAncho += isNaN(vidrioAncho) ? 0 : vidrioAncho;
                totalVidrioAlto += isNaN(vidrioAlto) ? 0 : vidrioAlto;
                totalSeguros += isNaN(seguros) ? 0 : seguros/10;
                totalRuedas += isNaN(ruedas) ? 0 : ruedas/10
            }
        }

        // Actualizar los totales en la tabla
        document.getElementById("total-area").textContent = totalArea.toFixed(3) + " m²";
        document.getElementById("total-riel").textContent = totalRiel.toFixed(3) + " m";
        document.getElementById("total-jamba").textContent = totalJamba.toFixed(3) + " m";
        document.getElementById("total-vertical").textContent = totalVertical.toFixed(3) + " m";
        document.getElementById("total-horizontal").textContent = totalHorizontal.toFixed(3) + " m";
        document.getElementById("total-mallaAncho").textContent = totalMallaAncho.toFixed(3) + " m";
        document.getElementById("total-mallaAlto").textContent = totalMallaAlto.toFixed(3) + " m";
        document.getElementById("total-vidrioAncho").textContent = totalVidrioAncho.toFixed(3) + " m"; 
        document.getElementById("total-vidrioAlto").textContent = totalVidrioAlto.toFixed(3) + " m";
        document.getElementById("total-seguros").textContent = totalSeguros + " u";
        document.getElementById("total-ruedas").textContent = totalRuedas + " u";
    }

    // Event listener para calcular en cada fila
    tabla.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("calcular")) {
            let fila = e.target.closest("tr");
            calcularFila(fila);
        } 
        if (e.target && e.target.classList.contains("eliminar")) {
            alert("Eliminar");
            let fila = e.target.closest("tr");
            tabla.deleteRow(fila.rowIndex - 1); // Eliminar la fila actual
            actualizarTotales();
        }
    });

    
});
