// preload.js
const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  try {
    const navPath = path.join(__dirname, 'components/nav.html');
    const footerPath = path.join(__dirname, 'components/footer.html');

    const nav = fs.readFileSync(navPath, 'utf8');
    const footer = fs.readFileSync(footerPath, 'utf8');

    document.body.insertAdjacentHTML('afterbegin', nav);
    document.body.insertAdjacentHTML('beforeend', footer);
  } catch (err) {
    console.error('Error cargando componentes locales:', err);
  }
});
