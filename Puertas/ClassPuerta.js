class ClassPuerta {
    ancho;
    alto;
    constructor(ancho, alto) {
        this.ancho = parseFloat(ancho);
        this.alto = parseFloat(alto);
    }

    // Métodos sin modificar `this.ancho` ni `this.alto`
    vidrioFijoConNervio(ancho) {
        return ancho - 3.9;
    }

    vidrioFijoSinNervio(alto) {
        return parseFloat(alto).toFixed(2);
    }

    tuboCuadradoUnaUnCuartoAncho(ancho) {
        return (ancho - 4.9).toFixed(2);
    }

    tuboCuadradoUnaUnCuartoAlto(alto) {
        return (alto - 3.5).toFixed(2);
    }
}
// Exporta la clase para que pueda ser utilizada en otros archivos
export default ClassPuerta;

