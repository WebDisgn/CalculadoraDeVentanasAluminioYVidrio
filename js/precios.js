    document.addEventListener("DOMContentLoaded", function () {
      let precio_riel = document.getElementById("precio_riel");
      let precio_riel_r = document.getElementById("precio_riel_r");
      // Capturar cambio en el input del color
      const colorInput = document.getElementById("aluminioColor");

      colorInput.addEventListener("input", function () {
        if (colorInput.value === "blanco") {
          alert("Has seleccionado el color blanco");
          precio_riel.textContent = "25";
          precio_riel_r.textContent = "38";
        }
      });
    });