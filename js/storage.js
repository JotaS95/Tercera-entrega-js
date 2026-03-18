/**
 * storage.js - Manejo persistente de datos (multi-usuario)
 */

const StorageManager = {
    // Claves dinámicas por usuario
    getKeys(usuario) {
        return {
            TRANSACCIONES: `billetera_${usuario}_transacciones`,
            PRESUPUESTO: `billetera_${usuario}_presupuesto`,
        };
    },

    USUARIOS_KEY: "billetera_usuarios_lista",

    // Guardar / recuperar lista de usuarios
    obtenerUsuarios() {
        const data = localStorage.getItem(this.USUARIOS_KEY);
        return data ? JSON.parse(data) : [];
    },

    registrarUsuario(usuario) {
        const lista = this.obtenerUsuarios();
        if (!lista.includes(usuario)) {
            lista.push(usuario);
            localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(lista));
        }
    },

    // Transacciones por usuario
    guardarTransacciones(usuario, lista) {
        const keys = this.getKeys(usuario);
        localStorage.setItem(keys.TRANSACCIONES, JSON.stringify(lista));
    },

    obtenerTransacciones(usuario) {
        const keys = this.getKeys(usuario);
        const data = localStorage.getItem(keys.TRANSACCIONES);
        return data ? JSON.parse(data) : [];
    },

    // Presupuesto por usuario
    guardarPresupuesto(usuario, valor) {
        const keys = this.getKeys(usuario);
        localStorage.setItem(keys.PRESUPUESTO, valor.toString());
    },

    obtenerPresupuesto(usuario) {
        const keys = this.getKeys(usuario);
        const data = localStorage.getItem(keys.PRESUPUESTO);
        return data ? parseFloat(data) : 0;
    },

    // Limpiar datos del usuario actual
    limpiarUsuario(usuario) {
        const keys = this.getKeys(usuario);
        localStorage.removeItem(keys.TRANSACCIONES);
        localStorage.removeItem(keys.PRESUPUESTO);
    }
};
