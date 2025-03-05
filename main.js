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
            <td class="riel">0 cm</td>
            <td class="jamba">0 cm</td>
            <td class="vertical">0 cm</td>
            <td class="horizontal">0 cm</td>
            <td class="mallaAncho">0 cm</td>
            <td class="mallaAlto">0 cm</td>
            <td class="vidrioAncho">0 cm</td>
            <td class="vidrioAlto">0 cm</td>
            <td class="seguros">0 u</td>
            <td class="ruedas">0 u</td>
            <td class="esquineros">0 u</td>
            <td class="felpa">0 cm</td>
            <td class="tornillosMedia">0 u</td>
            <td class="tornillosDosPulgadas">0 u</td>
            <td class="vinil">0 cm</td>
            <td class="vinilPiola">0 cm</td>
            <td class="tacoFish">0 u</td>
            <td>
                <button class="btn btn-info calcular">Calcular</button>
                <br>
                <button class="btn btn-warning eliminar">eliminar</button>
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
        let area = ((ancho * alto)/10000).toFixed(2);
        let riel = ancho.toFixed(2);
        let jamba = (alto - 0.9).toFixed(2);
        let vertical = (alto - 2.8).toFixed(2);
        let horizontal = ((ancho - 10.8) / 2).toFixed(2);
        let mallaAncho = (((ancho - 10.8) / 2) + 3.0).toFixed(2);
        let mallaAlto = (alto - 3.0).toFixed(3);
        let vidrioAncho = (((ancho - 10.8) / 2) + 1.3).toFixed(2);
        let vidrioAlto = (alto -(2.8+6.7)).toFixed(2);
        let seguros = 1;
        let ruedas = 4;
        let esquineros = 8;
        let felpa = (50).toFixed(2);
        let tornillosMedia = 10;
        let tornillosDosPulgadas = 8+5;
        let vinil = ((4*(ancho + alto))).toFixed(2);
        let vinilPiola = ((2*(ancho + alto))).toFixed(2);
        
        
        // Actualizar las celdas con los resultados
        fila.querySelector(".area").textContent = area + " m²";
        fila.querySelector(".riel").textContent = riel + " cm";
        fila.querySelector(".jamba").textContent = jamba + " cm";
        fila.querySelector(".vertical").textContent = vertical + " cm";
        fila.querySelector(".horizontal").textContent = horizontal + " cm";
        fila.querySelector(".mallaAncho").textContent = mallaAncho + " cm";
        fila.querySelector(".mallaAlto").textContent = mallaAlto + " cm";
        fila.querySelector(".vidrioAncho").textContent = vidrioAncho + " cm";
        fila.querySelector(".vidrioAlto").textContent = vidrioAlto + " cm";
        fila.querySelector(".seguros").textContent = seguros + " u";
        fila.querySelector(".ruedas").textContent = ruedas + " u";
        fila.querySelector(".felpa").textContent = felpa + " cm";
        fila.querySelector(".tornillosMedia").textContent = tornillosMedia + " u";
        fila.querySelector(".tornillosDosPulgadas").textContent = tornillosDosPulgadas + " u";
        fila.querySelector(".esquineros").textContent = esquineros + " u";
        fila.querySelector(".vinil").textContent = vinil + " cm";
        fila.querySelector(".vinilPiola").textContent = vinilPiola + " cm";
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
        let totalEsquineros = 0;
        let totalFelpa = 0;
        let totalTornillosMedia = 0;
        let totalTornillosDosPulgadas = 0;
        let totalVinil = 0;
        /*let totalPiola = 0;
        let totalTacos = 0;
        */
        // Sumar los valores de cada columna
        for (let fila of filas) {
            if (fila.id !== 'totales') {
                let area = parseFloat(fila.querySelector(".area").textContent.replace(' m²', ''));
                let riel = parseFloat(fila.querySelector(".riel").textContent.replace(' cm', ''));
                let jamba = parseFloat(fila.querySelector(".jamba").textContent.replace(' cm', ''));
                let vertical = parseFloat(fila.querySelector(".vertical").textContent.replace(' cm', ''));
                let horizontal = parseFloat(fila.querySelector(".horizontal").textContent.replace(' cm', ''));
                let mallaAncho = parseFloat(fila.querySelector(".mallaAncho").textContent.replace(' cm', ''));
                let mallaAlto = parseFloat(fila.querySelector(".mallaAlto").textContent.replace(' cm', ''));
                let vidrioAncho = parseFloat(fila.querySelector(".vidrioAncho").textContent.replace(' cm', ''));
                let vidrioAlto = parseFloat(fila.querySelector(".vidrioAlto").textContent.replace(' cm' , "0"));
                let seguros = parseInt(fila.querySelector(".seguros").textContent.replace(' u' , "0"));
                let ruedas = parseInt(fila.querySelector(".ruedas").textContent.replace(' u' , "0"));
                let esquineros = parseInt(fila.querySelector(".esquineros").textContent.replace(' u' , "0"));
                let felpa = parseFloat(fila.querySelector(".felpa").textContent.replace(' cm' , "0"));
                let tornillosMedia = parseInt(fila.querySelector(".tornillosMedia").textContent.replace(' u' , "0"));
                let tornillosDosPulgadas = parseInt(fila.querySelector(".tornillosDosPulgadas").textContent.replace(' u' , "0"));
                let vinil = parseFloat(fila.querySelector(".vinil").textContent.replace(' cm' , "0"));
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
                totalRuedas += isNaN(ruedas) ? 0 : ruedas/10;
                totalEsquineros += isNaN(esquineros) ? 0 : esquineros/10;
                totalFelpa += isNaN(felpa) ? 0 : felpa;
                totalTornillosMedia += isNaN(tornillosMedia) ? 0 :tornillosMedia/10;
                totalTornillosDosPulgadas += isNaN(tornillosDosPulgadas) ? 0 :tornillosDosPulgadas/10;
                totalVinil += isNaN(vinil) ? 0 :vinil;
                
            }
        }

        // Actualizar los totales en la tabla
        document.getElementById("total-area").textContent = totalArea.toFixed(2) + " m²";
        document.getElementById("total-riel").textContent = totalRiel.toFixed(2) + " cm";
        document.getElementById("total-jamba").textContent = totalJamba.toFixed(2) + " cm";
        document.getElementById("total-vertical").textContent = totalVertical.toFixed(2) + " cm";
        document.getElementById("total-horizontal").textContent = totalHorizontal.toFixed(2) + " cm";
        document.getElementById("total-mallaAncho").textContent = totalMallaAncho.toFixed(2) + " cm";
        document.getElementById("total-mallaAlto").textContent = totalMallaAlto.toFixed(2) + " cm";
        document.getElementById("total-vidrioAncho").textContent = totalVidrioAncho.toFixed(2) + " cm"; 
        document.getElementById("total-vidrioAlto").textContent = totalVidrioAlto.toFixed(2) + " cm";
        document.getElementById("total-seguros").textContent = totalSeguros + " u";
        document.getElementById("total-ruedas").textContent = totalRuedas + " u";
        document.getElementById("total-esquineros").textContent = totalEsquineros + " u";
        document.getElementById("total-felpa").textContent = totalFelpa.toFixed(2) + " cm";
        document.getElementById("total-tornillosMedia").textContent = totalTornillosMedia + " u";
        document.getElementById("total-tornillosDosPulgadas").textContent = totalTornillosDosPulgadas + " u";
        document.getElementById("total-vinil").textContent = totalVinil.toFixed(2) + " cm";
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
