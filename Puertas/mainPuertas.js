// mainPuertas.js
import ClassPuerta from './ClassPuerta.js';

document.addEventListener("DOMContentLoaded", () => {

    // Llamada al botón para crear una nueva puerta
    document.querySelector(".crearPuerta").addEventListener("click", function () {
        let idPuerta = Date.now();
        let anchoPuerta = document.querySelector(".anchoPuerta").value;
        let altoPuerta = document.querySelector(".altoPuerta").value;
        const puerta = new ClassPuerta(anchoPuerta, altoPuerta);

        let row = document.createElement("tr");
        row.innerHTML = `
       <td>${idPuerta}</td>
       <td>${anchoPuerta}</td>
       <td>${altoPuerta}</td>
       `;

        //console.log(arrayPuertas);
        // Seleccionar el contenedor .puerta
        const mostrarPuerta = document.querySelector(".puerta tbody");
        // Iterar sobre el array de infoPuerta

        mostrarPuerta.appendChild(row);
    });

    document.querySelector(".puerta tbody").addEventListener("click", function (event) {
        let fila = event.target.closest("tr"); // Encuentra el <tr> más cercano
        if (!fila) return; // Evita errores si el click no es sobre un <tr>
        let celdas = fila.querySelectorAll("td"); // Obtiene todos los <td> de la fila
        let valor = document.querySelector(".anchoPuerta").value=celdas[0].textContent; //
        console.log(valor); //

        console.log(celdas[0].textContent);
    });

});

