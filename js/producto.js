let productos = [];
let productos_tbody = document.getElementById("productos_tbody");
console.log(productos_tbody);
document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  mostrarProductos();
});

async function cargarProductos() {
  try {
    const res = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminioYVidrio/src/productos.json');
    productos = await res.json();
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos() {
  const tbody = document.getElementById('productos_tbody'); // Selecciona el <tbody> de la tabla
  tbody.innerHTML = ''; // Limpia el contenido anterior

  productos.forEach((p, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
    <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      
      <td><input type="number" min="0" value="0" id="cant${index}" onchange="calcularTotal()" /></td>
      <td>${p.cantidad}</td>
    `;
    tbody.appendChild(fila);
  });
}

function calcularTotal() {
  let total = 0;
  productos.forEach((p, i) => {
    const cant = parseInt(document.getElementById(`cant${i}`).value) || 0;
    total += cant * p.precio;
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

function generarFactura() {
  alert('Aquí generas el PDF (lo agregamos luego con jsPDF)');
}
