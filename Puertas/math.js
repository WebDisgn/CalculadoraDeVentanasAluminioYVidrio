import ClassMath from './ClassMath.js';

const _num1 = document.querySelector('#num1');
const _num2 = document.querySelector('#num2');
const resultado = document.querySelector('#resultado');

const operaciones = new ClassMath();

// Función que conecta UI con la clase
function actualizarResultados() {
    operaciones.num1 = _num1.value;  // setter
    operaciones.num2 = _num2.value;  // setter

   resultado.innerHTML = `Suma: ${operaciones.sumar()} <br> Resta: ${operaciones.restar()}`;

}

// Escuchar eventos
_num1.addEventListener('input', actualizarResultados);
_num2.addEventListener('input', actualizarResultados);

// Inicializar
actualizarResultados();
