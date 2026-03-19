/**
 * storage.js - Manejo persistente de datos (Versión Básica)
 */

const StorageManager = {
    KEYS: {
        TRANSACCIONES: "billetera_transacciones_basica",
        PRESUPUESTO: "billetera_presupuesto_basica"
    },

    // Guardar transacciones
    guardarTransacciones(lista) {
        localStorage.setItem(this.KEYS.TRANSACCIONES, JSON.stringify(lista));
    },

    // Obtener transacciones
    obtenerTransacciones() {
        const data = localStorage.getItem(this.KEYS.TRANSACCIONES);
        return data ? JSON.parse(data) : [];
    },

    // Guardar presupuesto
    guardarPresupuesto(valor) {
        const num = parseFloat(valor);
        localStorage.setItem(this.KEYS.PRESUPUESTO, isNaN(num) ? "0" : num.toString());
    },

    // Obtener presupuesto
    obtenerPresupuesto() {
        const data = localStorage.getItem(this.KEYS.PRESUPUESTO);
        const parsed = parseFloat(data);
        return isNaN(parsed) ? 0 : parsed;
    },

    // Limpiar todo
    limpiarTodo() {
        localStorage.removeItem(this.KEYS.TRANSACCIONES);
        localStorage.removeItem(this.KEYS.PRESUPUESTO);
    }
};
