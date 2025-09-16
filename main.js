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
        let area = ((ancho * alto) / 10000).toFixed(2);
        let riel = ancho.toFixed(2);
        let jamba = (alto - 0.9).toFixed(2);
        let vertical = (alto - 2.8).toFixed(2);
        let horizontal = ((ancho - 10.8) / 2).toFixed(2);
        let mallaAncho = (((ancho - 10.8) / 2) + 3.0).toFixed(2);
        let mallaAlto = (alto - 3.0).toFixed(3);
        let vidrioAncho = (((ancho - 10.8) / 2) + 1.3).toFixed(2);
        let vidrioAlto = (alto - (2.8 + 6.7)).toFixed(2);
        let seguros = 1;
        let ruedas = 4;
        let esquineros = 8;
        let felpa = (50).toFixed(2);
        let tornillosMedia = 10;
        let tornillosDosPulgadas = 8 + 5;
        let vinil = ((4 * (ancho + alto))).toFixed(2);
        let vinilPiola = ((2 * (ancho + alto))).toFixed(2);
        let tacoFish = 10;

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
        fila.querySelector(".tacoFish").textContent = tacoFish + " u";
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
        let totalPiola = 0;
        let totalTacos = 0;

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
                let vidrioAlto = parseFloat(fila.querySelector(".vidrioAlto").textContent.replace(' cm', "0"));
                let seguros = parseInt(fila.querySelector(".seguros").textContent.replace(' u', "0"));
                let ruedas = parseInt(fila.querySelector(".ruedas").textContent.replace(' u', "0"));
                let esquineros = parseInt(fila.querySelector(".esquineros").textContent.replace(' u', "0"));
                let felpa = parseFloat(fila.querySelector(".felpa").textContent.replace(' cm', "0"));
                let tornillosMedia = parseInt(fila.querySelector(".tornillosMedia").textContent.replace(' u', "0"));
                let tornillosDosPulgadas = parseInt(fila.querySelector(".tornillosDosPulgadas").textContent.replace(' u', "0"));
                let vinil = parseFloat(fila.querySelector(".vinil").textContent.replace(' cm', "0"));
                let vinilPiola = parseFloat(fila.querySelector(".vinilPiola").textContent.replace(' cm', "0"));
                let tacoFish = parseInt(fila.querySelector(".tacoFish").textContent.replace(' u', "0"));
                totalArea += isNaN(area) ? 0 : area;
                totalRiel += isNaN(riel) ? 0 : riel * 2;
                totalJamba += isNaN(jamba) ? 0 : jamba * 2;
                totalVertical += isNaN(vertical) ? 0 : vertical * 4;
                console.log(totalVertical);
                totalHorizontal += isNaN(horizontal) ? 0 : horizontal * 4;
                totalMallaAncho += isNaN(mallaAncho) ? 0 : mallaAncho * 2;
                totalMallaAlto += isNaN(mallaAlto) ? 0 : mallaAlto * 2;
                totalVidrioAncho += isNaN(vidrioAncho) ? 0 : vidrioAncho;
                totalVidrioAlto += isNaN(vidrioAlto) ? 0 : vidrioAlto;
                totalSeguros += isNaN(seguros) ? 0 : seguros / 10;
                totalRuedas += isNaN(ruedas) ? 0 : ruedas / 10;
                totalEsquineros += isNaN(esquineros) ? 0 : esquineros / 10;
                totalFelpa += isNaN(felpa) ? 0 : felpa;
                totalTornillosMedia += isNaN(tornillosMedia) ? 0 : tornillosMedia / 10;
                totalTornillosDosPulgadas += isNaN(tornillosDosPulgadas) ? 0 : tornillosDosPulgadas / 10;
                totalVinil += isNaN(vinil) ? 0 : vinil;
                totalPiola += isNaN(vinilPiola) ? 0 : vinilPiola;
                totalTacos += isNaN(tacoFish) ? 0 : tacoFish/10;
                console.log(totalArea);
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
        document.getElementById("total-piola").textContent = totalPiola.toFixed(2) + " cm";
        document.getElementById("total-tacosFish").textContent = totalTacos + " u";
        ///////////////////////////////////////////////////////////////////////////
        //FACTURA -------------------------------------------------------------
        ///////////////////////////////////////////////////////////////////////////
        //RIEL----------------------------------------------------------------
        let precioRiel = (document.getElementById("precio_riel").textContent)*(Math.floor(totalRiel / 640));
        let precioRielRetazo = (document.getElementById("precio_riel_r").textContent)*(((totalRiel / 640) - (Math.floor(totalRiel / 640))));
        document.getElementById("riel_l").textContent = Math.floor(totalRiel / 640);
        document.getElementById("riel_r").textContent = ((totalRiel / 640) - (Math.floor(totalRiel / 640))) * 640 + "cm";
        document.getElementById("riel_t").textContent =  precioRiel;// PRECIO RIEL
        document.getElementById("riel_rt").textContent = precioRielRetazo; //PRECIO RIEL RETAZO
        //JAMBA---------------------------------------------------------------
        let precio_jamba = (document.getElementById("precio_jamba").textContent)*(Math.floor(totalJamba / 640));
        let precio_jamba_r = (document.getElementById("precio_jamba_r").textContent)*(((totalJamba / 640) - (Math.floor(totalJamba / 640))));
        document.getElementById("jamba_l").textContent = Math.floor(totalJamba / 640);
        document.getElementById("jamba_r").textContent = ((totalJamba / 640) - (Math.floor(totalJamba / 640))) * 640 + "cm";
        document.getElementById("jamba_t").textContent =  precio_jamba; //PRECIO JAMBA
        document.getElementById("jamba_rt").textContent =  precio_jamba_r; //PRECIO JAMBA RETAZO
        //VERTICAL-------------------------------------------------------------
        let precio_vertical = (document.getElementById("precio_vertical").textContent)*(Math.floor(totalVertical/640));
        let precio_vertical_r = (document.getElementById("precio_vertical_r").textContent)*(((totalVertical / 640) - (Math.floor(totalVertical / 640))));
        document.getElementById("vertical_l").textContent = Math.floor(totalVertical / 640);
        document.getElementById("vertical_r").textContent = ((totalVertical / 640) - (Math.floor(totalVertical / 640))) * 640 + "cm";
        document.getElementById("vertical_t").textContent = precio_vertical;
        document.getElementById("vertical_rt").textContent = precio_vertical_r; 
        //HOROZONTAL-----------------------------------------------------------------
        let precio_horizontal = (document.getElementById("precio_horizontal").textContent)*(Math.floor(totalHorizontal/640));
        let precio_horizontal_r = (document.getElementById("precio_horizontal_r").textContent)*(((totalHorizontal / 640) - (Math.floor(totalHorizontal / 640))));
        document.getElementById("horizontal_l").textContent = Math.floor(totalHorizontal / 640);
        document.getElementById("horizontal_r").textContent = ((totalHorizontal / 640) - (Math.floor(totalHorizontal / 640))) * 640 + "cm";
        document.getElementById("horizontal_t").textContent = precio_horizontal;
        document.getElementById("horizontal_rt").textContent = precio_horizontal_r;
        //MALLA CORREDIZA--------------------------------------------------------------
        let precio_malla_corrediza = (document.getElementById("precio_malla_corrediza").textContent)*(Math.floor((totalMallaAncho + totalMallaAlto) / 640));
        let precio_malla_corrediza_r = (document.getElementById("precio_malla_corrediza_r").textContent)*(((totalMallaAncho + totalMallaAlto) / 640) - (Math.floor((totalMallaAncho + totalMallaAlto) / 640)));
        document.getElementById("malla_corrediza_l").textContent = Math.floor((totalMallaAncho + totalMallaAlto) / 640);////CONTINUAR
        document.getElementById("malla_corrediza_r").textContent = (((totalMallaAncho + totalMallaAlto) / 640) - (Math.floor((totalMallaAncho + totalMallaAlto) / 640))) * 640 + "cm";
        document.getElementById("malla_corrediza_t").textContent = precio_malla_corrediza;
        document.getElementById("malla_corrediza_rt").textContent = precio_malla_corrediza_r;
        //SEGUROS PUSH------------------------------------------------------------------------
        let precio_seguros = (document.getElementById("precio_seguro_unidad").textContent)*totalSeguros;
        document.getElementById("seguro_cantidad_t").textContent = totalSeguros;
        document.getElementById("precio_seguro_t").textContent = precio_seguros;
        //RUEDAS VENTANA---------------------------------------------------------------------
        let precio_ruedas = (document.getElementById("precio_rueda_unidad").textContent)*totalRuedas;
        document.getElementById("rueda_cantidad_t").textContent = totalRuedas;
        document.getElementById("precio_rueda_t").textContent = precio_ruedas;
        //ESQUINEROS-------------------------------------------------------------------
        let precio_esquineros = (document.getElementById("precio_esquinero_unidad").textContent)*totalEsquineros;
        document.getElementById("esquinero_cantidad_t").textContent = totalEsquineros;
        document.getElementById("precio_esquinero_t").textContent = precio_esquineros;
        //FELPA--------------------------------------------------------------------------
        let precio_felpa =(document.getElementById("precio_felpa_cm").textContent)*totalFelpa;
        document.getElementById("felpa_cantidad_t").textContent = totalFelpa;
        document.getElementById("precio_felpa_t").textContent = precio_felpa;
        //TORNILLOS 8*1/2------------------------------------------------------------------
        let precio_tornillos_media = (document.getElementById("precio_tornillos_media").textContent)*totalTornillosMedia;
        document.getElementById("tornillos_media_t").textContent = totalTornillosMedia;
        document.getElementById("precio_tornillo_media_t").textContent = precio_tornillos_media;
        //TORNILLOS 8*2----------------------------------------------------------------
        let precio_tornillos = (document.getElementById("precio_tornillo").textContent)*totalTornillosDosPulgadas;
        document.getElementById("tornillos_cantidad_t").textContent = totalTornillosDosPulgadas;
        document.getElementById("precio_tornillo_t").textContent = precio_tornillos;
        //VINIL------------------------------------------------------------------------------
        let precio_vinil = (document.getElementById("precio_vinil".textContent))*((totalVinil / 100) / 20)
        document.getElementById("vinil_cantidad_t").textContent = ((totalVinil / 100) / 20) + "kg";
        document.getElementById("precio_vinil_t").textContent = precio_vinil;
        //PIOLA------------------------------------------------------------------------------
        let precio_piola = (document.getElementById("precio_piola").textContent)*((totalPiola / 100) / 20);
        document.getElementById("piola_cantidad_t").textContent = ((totalPiola / 100) / 20) + "kg";
        document.getElementById("precio_piola_t").textContent = precio_piola;
        //TACOS FISH------------------------------------------------------------------------ 
        let precio_tacos = (document.getElementById("precio_tacos").textContent)*(totalTacos /10)
        document.getElementById("tacos_cantidad_t").textContent = (totalTacos /10);
        document.getElementById("precio_tacos_t").textContent = precio_tacos;  
        //SUBTOTAL---------------------------------------------------------------------------
        document.getElementById("subtotal").textContent = (precioRiel+precioRielRetazo+precio_jamba+precio_jamba_r+precio_vertical+precio_vertical_r+precio_horizontal+precio_horizontal_r+precio_malla_corrediza+precio_malla_corrediza_r+precio_felpa+precio_piola+precio_ruedas+precio_seguros+precio_tacos+precio_tornillos+precio_tornillos_media+precio_vinil);
        
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