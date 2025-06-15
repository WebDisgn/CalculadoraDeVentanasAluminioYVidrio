    async function cargarComponentes() {
      try {
        const nav = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminio/components/nav.html');
        document.getElementById('nav-container').innerHTML = await nav.text();

        const footer = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminio/components/footer.html');
        document.getElementById('footer-container').innerHTML = await footer.text();
      } catch (error) {
        console.error('Error cargando componentes:', error);
      }
    }

    document.addEventListener('DOMContentLoaded', cargarComponentes);