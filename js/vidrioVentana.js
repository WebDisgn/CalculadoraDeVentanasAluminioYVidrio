   // Parámetros de la hoja completa (en cm)
   const HOJA_ANCHO = 244;
   const HOJA_ALTO = 180;

   // Array global para almacenar los vidrios con su información
   let vidrios = [];
   let vidrioCount = 0;
   const vidriosContainer = document.getElementById('vidriosContainer');
   const btnAgregarVidrio = document.getElementById('btnAgregarVidrio');
   const btnCalcular = document.getElementById('btnCalcular');
   const canvasContainer = document.getElementById('canvasContainer');

   // Función para agregar un vidrio en el formulario
   function agregarVidrio() {
     vidrioCount++;
     const div = document.createElement('div');
     div.id = `vidrioDiv${vidrioCount}`;
     div.innerHTML = `
       <h4>Vidrio ${vidrioCount}</h4>
       <label for="vidrioAncho${vidrioCount}">Ancho (cm):</label>
       <input type="number" step="0.01" id="vidrioAncho${vidrioCount}" required min="1" placeholder="Ej: 50">
       <label for="vidrioAlto${vidrioCount}">Alto (cm):</label>
       <input type="number" step="0.01" id="vidrioAlto${vidrioCount}" required min="1" placeholder="Ej: 80">
     `;
     vidriosContainer.appendChild(div);
     // Agregamos un objeto base al array (se actualizará luego)
     vidrios.push({ numero: vidrioCount });
   }

   btnAgregarVidrio.addEventListener('click', agregarVidrio);
   // Agregar el primer vidrio automáticamente
   agregarVidrio();

   // Función para actualizar los datos de cada vidrio a partir de los inputs
   function actualizarVidrios() {
     for (let i = 1; i <= vidrioCount; i++) {
       const anchoEl = document.getElementById(`vidrioAncho${i}`);
       const altoEl  = document.getElementById(`vidrioAlto${i}`);
       if (!anchoEl || !altoEl) continue;
       // Se lee y se redondea a dos decimales
       const ancho = parseFloat(parseFloat(anchoEl.value).toFixed(2));
       const alto  = parseFloat(parseFloat(altoEl.value).toFixed(2));
       vidrios[i - 1] = { numero: i, ancho, alto };
     }
   }

   // Agrupación de vidrios en tiras verticales (filas) según el alto acumulado
   // Cada tira: suma de altos <= HOJA_ALTO; el ancho de la tira será el mayor ancho de sus vidrios
   function agruparEnTiras(vidriosList) {
     const tiras = [];
     let tiraActual = { vidrios: [], ancho: 0, altura: 0 };
     for (const vidrio of vidriosList) {
       if (tiraActual.altura + vidrio.alto <= HOJA_ALTO) {
         tiraActual.vidrios.push(vidrio);
         tiraActual.altura += vidrio.alto;
         if (vidrio.ancho > tiraActual.ancho) {
           tiraActual.ancho = vidrio.ancho;
         }
       } else {
         tiras.push(tiraActual);
         tiraActual = { vidrios: [vidrio], ancho: vidrio.ancho, altura: vidrio.alto };
       }
     }
     if (tiraActual.vidrios.length > 0) {
       tiras.push(tiraActual);
     }
     return tiras;
   }

   // Agrupar tiras en planchas:
   // Si la suma de los anchos de las tiras excede HOJA_ANCHO, se crea una nueva hoja.
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
     if (planchaActual.tiras.length > 0) {
       planchas.push(planchaActual);
     }
     return planchas;
   }

   // Función para dibujar una plancha en un canvas
   function dibujarPlancha(plancha, canvasId) {
     const canvas = document.createElement('canvas');
     canvas.id = canvasId;
     // Escala: para visualizar mejor, duplicamos las dimensiones del canvas
     canvas.width = HOJA_ANCHO * 2;
     canvas.height = HOJA_ALTO * 2;
     canvas.style.marginBottom = '30px';
     canvasContainer.appendChild(canvas);
     const ctx = canvas.getContext('2d');
     const escalaX = canvas.width / HOJA_ANCHO;
     const escalaY = canvas.height / HOJA_ALTO;

     // Dibuja el contorno de la hoja
     ctx.strokeStyle = 'black';
     ctx.lineWidth = 2;
     ctx.strokeRect(0, 0, HOJA_ANCHO * escalaX, HOJA_ALTO * escalaY);

     // Dibujar líneas de corte verticales principales (líneas rojas) para delimitar las tiras
     let inicioX = 0;
     plancha.tiras.forEach((tira) => {
       inicioX += tira.ancho;
       ctx.strokeStyle = 'red';
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.moveTo(inicioX * escalaX, 0);
       ctx.lineTo(inicioX * escalaX, HOJA_ALTO * escalaY);
       ctx.stroke();
     });

     // Dibujar cada tira y sus vidrios
     inicioX = 0;
     plancha.tiras.forEach((tira) => {
       let acumuladoY = 0;
       tira.vidrios.forEach((vidrio) => {
         const posX = inicioX;
         const posY = acumuladoY;
         // Dibujar el vidrio en celeste
         ctx.fillStyle = '#ADD8E6';
         ctx.fillRect(posX * escalaX, posY * escalaY, vidrio.ancho * escalaX, vidrio.alto * escalaY);
         // Dibujar borde negro del vidrio
         ctx.strokeStyle = 'black';
         ctx.lineWidth = 2;
         ctx.strokeRect(posX * escalaX, posY * escalaY, vidrio.ancho * escalaX, vidrio.alto * escalaY);
         // Sobrante en ancho (si el vidrio es más angosto que el ancho de la tira) en gris oscuro
         if (vidrio.ancho < tira.ancho) {
           const sobranteAncho = tira.ancho - vidrio.ancho;
           ctx.fillStyle = '#555';
           ctx.fillRect((posX + vidrio.ancho) * escalaX, posY * escalaY, sobranteAncho * escalaX, vidrio.alto * escalaY);
         }
         // Acotación: Número y dimensiones (con dos decimales) del vidrio
         const centroX = posX + (tira.ancho / 2);
         const centroY = posY + (vidrio.alto / 2);
         ctx.fillStyle = 'black';
         ctx.font = "12px Arial";
         const texto = `V${vidrio.numero}: ${vidrio.ancho.toFixed(2)}x${vidrio.alto.toFixed(2)}`;
         const anchoTexto = ctx.measureText(texto).width;
         ctx.fillText(texto, (centroX * escalaX) - anchoTexto/2, centroY * escalaY);
         acumuladoY += vidrio.alto;
       });
       // Sobrante vertical en la tira (si no se ocupa toda la altura)
       if (acumuladoY < HOJA_ALTO) {
         const sobranteAlto = HOJA_ALTO - acumuladoY;
         ctx.fillStyle = '#555';
         ctx.fillRect(inicioX * escalaX, acumuladoY * escalaY, tira.ancho * escalaX, sobranteAlto * escalaY);
         ctx.fillStyle = 'black';
         ctx.font = "12px Arial";
         const txt = `${sobranteAlto.toFixed(2)} cm sobrante`;
         const anchoTxt = ctx.measureText(txt).width;
         ctx.fillText(txt, (inicioX + tira.ancho/2) * escalaX - anchoTxt/2, (acumuladoY + sobranteAlto/2) * escalaY);
       }
       inicioX += tira.ancho;
     });
   }

   // Botón para calcular y dibujar
   btnCalcular.addEventListener('click', () => {
     actualizarVidrios();
     const tiras = agruparEnTiras(vidrios);
     const planchas = agruparEnPlanchas(tiras);
     canvasContainer.innerHTML = '';
     planchas.forEach((plancha, idx) => {
       dibujarPlancha(plancha, `canvasPlancha_${idx+1}`);
     });
   });