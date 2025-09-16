class ClassMath {
    #num1;
    #num2;

    constructor(num1 = 0, num2 = 0) {
        this.#num1 = num1;
        this.#num2 = num2;
    }

    // Getters y setters
    get num1() { return this.#num1; }
    set num1(value) { this.#num1 = parseFloat(value) || 0; }

    get num2() { return this.#num2; }
    set num2(value) { this.#num2 = parseFloat(value) || 0; }

    // Métodos de negocio
    sumar() { return this.#num1 + this.#num2; }
    restar() { return this.#num1 - this.#num2; }
    multiplicar() { return this.#num1 * this.#num2; }
    dividir() { return this.#num2 !== 0 ? this.#num1 / this.#num2 : null; }
}

export default ClassMath;
