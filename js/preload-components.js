// preload.js
window.addEventListener('DOMContentLoaded', async () => {
  try {
    //const nav = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminioYVidrio/components/nav.html');
    const footer = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminioYVidrio/components/footer.html');
  const nav = await fetch('https://webdisgn.github.io/CalculadoraDeVentanasAluminioYVidrio/components/nav.html');
    document.body.insertAdjacentHTML('afterbegin', await nav.text());
    const navContainer = document.createElement('div');
    navContainer.id = 'nav-container';
    navContainer.innerHTML = await nav.text();
    document.body.prepend(navContainer);

    const footerContainer = document.createElement('div');
    footerContainer.id = 'footer-container';
    footerContainer.innerHTML = await footer.text();
    document.body.appendChild(footerContainer);

  } catch (err) {
    console.error('Error cargando navbar/footer:', err);
  }
});
