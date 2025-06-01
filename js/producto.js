let productos = [];

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos();
  });

function mostrarProductos() {
  const contenedor = document.getElementById('lista-productos');
  contenedor.innerHTML = '';
  productos.forEach((p, index) => {
    contenedor.innerHTML += `
      <div class="item">
        <span>${p.nombre} ($${p.precio})</span>
        <input type="number" min="0" value="0" id="cant${index}" onchange="calcularTotal()" />
      </div>`;
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
