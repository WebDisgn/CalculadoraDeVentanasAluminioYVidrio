let vidrios = []; // Array para almacenar los vidrios
let anchoCanvaPadre= 330;
let altoCanvaPadre=214;
class Vidrio {
    // Definimos los atributos de la clase
    id;
    ancho;
    alto;
//--------------------------------------------------------------------------------------------------------------------------
// Constructor para inicializar los atributos-------------------------------------------------------------------------------
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
        this.id = vidrios.length > 0 ? vidrios[vidrios.length - 1].id + 1 : 1; // Asignar id automáticamente
        this.canvas = null; // Este se usará para referirse al canvas creado
        this.acotacionHorizontal = null;
        this.acotacionVertical = null;
        this.sobranteHorizontal = null;
        this.sobranteVertical = null;
    }
//---------------------------------------------------------------------------------------------------------------------------
//Método para agregar un vidrio al array--------------------------------------------------------------------------------------
    agregarVidrio() {
        vidrios.push(this); // Agregar el vidrio al array
        this.mostrarVidrios(); // Mostrar vidrios actuales en consola
    }

    // Método para generar la fila en la tabla
    generarFila() {
        const tr = document.createElement('tr');
        tr.dataset.id = this.id; // Asignamos el id como un dato en el elemento tr

        tr.innerHTML = `
            <td>${this.id}</td>
            <td>${this.ancho}</td>
            <td>${this.alto}</td>
            <td>
                <button class="btnEliminar">Eliminar</button>
                <button class="btnModificar">Modificar</button>
            </td>
        `;

        // Agregar eventos después de que los elementos estén en el DOM
        const eliminarBtn = tr.querySelector('.btnEliminar');
        const modificarBtn = tr.querySelector('.btnModificar');
        eliminarBtn.addEventListener("click", () => {
            this.eliminarVidrio(tr);  // Elimina la fila de la tabla
            this.eliminarCanvas();  // Elimina el canvas asociado
        });

        // Llamamos al método de eliminar
        modificarBtn.addEventListener("click", () => this.modificarVidrio(tr)); // Llamamos al método de modificar

        return tr;
    }
//-------------------------------------------------------------------------------------------------------------------------------------------
// Método para insertar el vidrio en la tabla------------------------------------------------------------------------------------------------
    insertarEnTabla() {
        const tbody = document.querySelector("#vidrio tbody");  // Obtener el tbody de la tabla
        const fila = this.generarFila();  // Crear la fila usando el método generarFila
        tbody.appendChild(fila);  // Insertar la fila en la tabla
    }
//-----------------------------------------------------------------------------------------------------------------------------------------
//Método para eliminar el vidrio-----------------------------------------------------------------------------------------------------------
    eliminarVidrio(tr) {
        // Eliminar vidrio del array
        vidrios = vidrios.filter(vidrio => vidrio.id !== this.id);

        // Eliminar la fila correspondiente de la tabla
        tr.remove();
    }
//-----------------------------------------------------------------------------------------------------------------------------------------
// Método para modificar el vidrio---------------------------------------------------------------------------------------------------------
    modificarVidrio(tr) {
        // Podrías abrir un formulario de edición o modificar los datos directamente
        alert(`Modificar vidrio con ID: ${this.id}`);
        // Ejemplo: modificar los valores de ancho y alto
        this.ancho = prompt("Nuevo ancho", this.ancho);
        this.alto = prompt("Nuevo alto", this.alto);

        // Actualizar la fila en la tabla
        tr.children[1].textContent = this.ancho; // Actualizar ancho
        tr.children[2].textContent = this.alto; // Actualizar alto
    }
//-------------------------------------------------------------------------------------------------------------------------------------------
// Método para mostrar los vidrios en consola------------------------------------------------------------------------------------------------
    mostrarVidrios() {
        console.log("Lista de vidrios:", vidrios);
    }
//-------------------------------------------------------------------------------------------------------------------------------------------
//METODO PARA CREAR CANAVAS--------------------------------------------------------------------------------------------------------------------    
    crearCanvas() {
        // Crear el elemento canvas

        const canvas = document.createElement("canvas");
        canvas.id = `canvas-${this.id}`; // Asigna un ID único basado en el ID del vidrio
        canvas.width = this.ancho; // Establecer el ancho del canvas
        canvas.height = this.alto; // Establecer el alto del canvas

        // Agregar el canvas al DOM (puedes añadirlo en el body o en un div específico)
        document.querySelector("#canvas").appendChild(canvas);
       // document.body.appendChild(canvas);
        
        // Aquí puedes hacer algo con el canvas, como dibujar algo en él, etc.
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "lightblue"; // Cambiar color de fondo para visibilidad
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Dibujar un rectángulo con las dimensiones del canvas
        // Agregar texto con los datos del vidrio
        ctx.fillStyle = "black"; // Color del texto
        ctx.font = "16px Arial"; // Fuente y tamaño del texto
        ctx.textAlign = "center"; // Alinear el texto al centro
        ctx.fillText(`ID: ${this.id}`, canvas.width / 2, canvas.height / 3);
        ctx.fillText(`Ancho: ${this.ancho}px`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Alto: ${this.alto}px`, canvas.width / 2, (canvas.height / 3) * 2);
         // Guardamos la referencia del canvas
         this.canvas = canvas;

         // Habilitamos la funcionalidad de mover el canvas
         this.makeCanvasDraggable(canvas);

        // Agregar las marcas de sobrante (espacio vacío)
        this.agregarSobrante(canvas);
        
    }
    // Método para eliminar el canvas asociado al vidrio
    eliminarCanvas() {
        alert("Eliminar canvas");
        const canvas = document.getElementById(`canvas-${this.id}`);
        if (canvas) {
            canvas.remove(); // Elimina el canvas del DOM
        }
    }

    // Método para hacer que el canvas se pueda mover
     // Método para hacer que el canvas se pueda mover dentro del contenedor
     makeCanvasDraggable(canvas) {
        let isDragging = false;
        let offsetX, offsetY;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - canvas.getBoundingClientRect().left;
            offsetY = e.clientY - canvas.getBoundingClientRect().top;
            canvas.style.cursor = 'grabbing';
        });

        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const parentRect = canvas.parentElement.getBoundingClientRect(); // Obtener el contenedor del canvas
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;
        
                // Limitar movimiento dentro del contenedor
                x = Math.max(parentRect.left, Math.min(x, parentRect.right - canvas.offsetWidth));
                y = Math.max(parentRect.top, Math.min(y, parentRect.bottom - canvas.offsetHeight));
        
                // Aplicar las nuevas posiciones al canvas
                canvas.style.left = `${x - parentRect.left}px`;
                canvas.style.top = `${y - parentRect.top}px`;
        
                // Coordenadas del canvas dentro del contenedor
                let canvasX = x - parentRect.left;
                let canvasY = y - parentRect.top;
                let width = canvas.offsetWidth;
                let height = canvas.offsetHeight;
        
                // Esquinas del canvas
                let topLeft = { x: canvasX, y: canvasY };
                let topRight = { x: canvasX + width, y: canvasY };
                let bottomLeft = { x: canvasX, y: canvasY + height };
                let bottomRight = { x: canvasX + width, y: canvasY + height };
        
                console.log("📌 Esquinas del canvas:");
                console.log("🔹 Superior Izquierda:", topLeft);
                console.log("🔹 Superior Derecha:", topRight);
                console.log("🔹 Inferior Izquierda:", bottomLeft);
                console.log("🔹 Inferior Derecha:", bottomRight);
                document.querySelector("#datos").innerHTML = `
    <p>📌 <strong>Esquinas del canvas:</strong></p>
    <p>🔹 <strong>Superior Izquierda:</strong> X=${topLeft.x}, Y=${topLeft.y}</p>
    <p>🔹 <strong>Superior Derecha:</strong> X=${topRight.x}, Y=${topRight.y}</p>
    <p>🔹 <strong>Inferior Izquierda:</strong> X=${bottomLeft.x}, Y=${bottomLeft.y}</p>
    <p>🔹 <strong>Inferior Derecha:</strong> X=${bottomRight.x}, Y=${bottomRight.y}</p>
`;


            }
        
            this.actualizarSobrante(canvas);
        });
        

        window.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'move';
        });
    }
//-----------------------------------------------------------------------------------------------------------------------------------------
// Método para agregar marcas de sobrante (espacio vacío)----------------------------------------------------------------------------------
      agregarSobrante(canvas) {
        const container = document.querySelector("#canvas");

        // Marcar el sobrante horizontal
        this.sobranteHorizontal = document.createElement("div");
        this.sobranteHorizontal.classList.add("sobrante");
        this.sobranteHorizontal.innerHTML = `Sobrante Horizontal: ${container.offsetWidth - canvas.width}px`;
        this.sobranteHorizontal.style.position = 'absolute';
        this.sobranteHorizontal.style.top = `${canvas.offsetTop + canvas.height + 25}px`;
        this.sobranteHorizontal.style.left = `${canvas.offsetLeft + (canvas.width / 2) - (this.sobranteHorizontal.offsetWidth / 2)}px`;
        container.appendChild(this.sobranteHorizontal);

        // Marcar el sobrante vertical
        this.sobranteVertical = document.createElement("div");
        this.sobranteVertical.classList.add("sobrante");
        this.sobranteVertical.innerHTML = `Sobrante Vertical: ${container.offsetHeight - canvas.height}px`;
        this.sobranteVertical.style.position = 'absolute';
        this.sobranteVertical.style.top = `${canvas.offsetTop + (canvas.height / 2) - (this.sobranteVertical.offsetHeight / 2)}px`;
        this.sobranteVertical.style.left = `${canvas.offsetLeft + canvas.width + 5}px`;
        container.appendChild(this.sobranteVertical);
    }
//-------------------------------------------------------------------------------------------------------------------------------------------
// Método para actualizar el sobrante en tiempo real------------------------------------------------------------------------------------------
        actualizarSobrante(canvas) {
            if (this.sobranteHorizontal && this.sobranteVertical) {
                const container = document.querySelector("#canvas");
    
                // Actualizar el sobrante horizontal
                this.sobranteHorizontal.innerHTML = `Sobrante Horizontal: ${container.offsetWidth - canvas.width - canvas.offsetLeft}px`;
                this.sobranteHorizontal.style.top = `${canvas.offsetTop + canvas.height + 25}px`;
                this.sobranteHorizontal.style.left = `${canvas.offsetLeft + (canvas.width / 2) - (this.sobranteHorizontal.offsetWidth / 2)}px`;
    
                // Actualizar el sobrante vertical
                this.sobranteVertical.innerHTML = `Sobrante Vertical: ${container.offsetHeight - canvas.height - canvas.offsetTop}px`;
                this.sobranteVertical.style.top = `${canvas.offsetTop + (canvas.height / 2) - (this.sobranteVertical.offsetHeight / 2)}px`;
                this.sobranteVertical.style.left = `${canvas.offsetLeft + canvas.width + 5}px`;
            }
        }
//---------------------------------------------------------------------------------------------------------------------------------------------
// Método para dibujar las líneas de sobrante (sobrante horizontal y vertical)----------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------      

}





// EVENTOS ---------------------------------------------------------------------------------
// Evento del botón "Enviar"
document.getElementById("btnEnviar").addEventListener("click", function () {
    let ancho = document.getElementById("ancho").value; // Obtener el valor del campo de texto para el ancho
    let alto = document.getElementById("alto").value;  // Obtener el valor del campo de texto para el alto

    // Crear un nuevo objeto Vidrio con los valores obtenidos de los inputs
    let vidrio1 = new Vidrio(ancho, alto);

    // Agregar el vidrio al array de vidrios
    vidrio1.agregarVidrio();

    // Insertar el vidrio en la tabla
    vidrio1.insertarEnTabla();
    vidrio1.crearCanvas();
});
// Función para crear un canvas basado en el vidrio
