    document.addEventListener("DOMContentLoaded", function () {
      let precio_riel = document.getElementById("precio_riel");
      let precio_riel_r = document.getElementById("precio_riel_r");
      let precio_jamba = document.getElementById("precio_jamba");
      let precio_jamba_r = document.getElementById("precio_jamba_r");
      // Capturar cambio en el input del color
      const colorInput = document.getElementById("aluminioColor");

      colorInput.addEventListener("input", function () {
        if (colorInput.value === "blanco") {
          alert("Has seleccionado el color blanco");
          precio_riel.textContent = "25";
          precio_riel_r.textContent = "38";
        } else if(colorInput.value === "negro"){
          alert("Color Negro seleccioando");
        } else if(colorInput.value === "bronce"){
          alert("Color bronce seleccionado");
        } else if(colorInput === "natural"){
          alert("Color Natural Seleccionado");
        } else if (colorInput === "maderado"){
          alert("Color Maderado seleccionado");
        }
      });
    });