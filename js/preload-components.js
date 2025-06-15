    async function cargarComponentes() {
      try {
        const nav = await fetch('http://127.0.0.1:5500/components/nav.html');
        document.getElementById('nav-container').innerHTML = await nav.text();

        const footer = await fetch('http://127.0.0.1:5500/components/footer.html');
        document.getElementById('footer-container').innerHTML = await footer.text();
      } catch (error) {
        console.error('Error cargando componentes:', error);
      }
    }

    document.addEventListener('DOMContentLoaded', cargarComponentes);