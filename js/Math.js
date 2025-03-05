class Math {
    num1;
    num2;
  
    constructor(num1 = 0, num2 = 0) {
      this.num1 = parseFloat(num1);
      this.num2 = parseFloat(num2);
    }
  
    sumarNumeros() {
      return this.num1 + this.num2;
    }
  
    restarNumeros() {
      return this.num1 - this.num2;
    }
  
    multiplicarNumeros() {
      return this.num1 * this.num2;
    }
  
    dividirNumeros() {
      if (this.num2 === 0) {
        throw new Error("No se puede dividir por cero");
      }
      return this.num1 / this.num2;
    }
  }
  
  // 🔹 Instanciar con valores enteros o decimales
  const operacion = new Math(10.5, "5.2");
  
  console.log(operacion.sumarNumeros());  // 15.7
  console.log(operacion.restarNumeros()); // 5.3
  console.log(operacion.multiplicarNumeros()); // 54.6
  console.log(operacion.dividirNumeros()); // 2.019230769230769
  