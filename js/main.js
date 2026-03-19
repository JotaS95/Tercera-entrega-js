/**
 * main.js - Acceso Directo Profesional Simplificado
 */

const App = {
    usuario: "Mi Cuenta",
    transacciones: [],
    presupuesto: 0,

    iniciar() {
        this.cargarDatos();
    },

    async cargarDatos() {
        this.transacciones = StorageManager.obtenerTransacciones();
        this.presupuesto = StorageManager.obtenerPresupuesto();
        
        // Mostrar fecha actual en el header
        const elFecha = document.getElementById("header-fecha");
        if (elFecha) {
            elFecha.innerText = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        this.actualizarUI();
        this.configurarEventos();

        try {
            const res = await fetch("data/transacciones.json");
            const data = await res.json();
            console.log("Categorías cargadas:", data);
        } catch (e) {
            console.error("Error cargando categorías:", e);
        }
    },

    configurarEventos() {
        document.getElementById("formulario-gastos").onsubmit = (e) => this.procesarNuevaTransaccion(e);
        document.getElementById("btn-guardar-presupuesto").onclick = () => this.cambiarPresupuesto();
        document.getElementById("btn-reiniciar-todo").onclick = () => this.borrarTodo();
    },

    procesarNuevaTransaccion(e) {
        e.preventDefault();
        const descripcion = document.getElementById("input-descripcion").value.trim();
        const montoRaw = document.getElementById("input-monto").value;
        const monto = parseFloat(montoRaw.replace(",", "."));
        const tipo = document.getElementById("select-tipo").value;

        if (!descripcion || isNaN(monto) || monto <= 0) {
            UIManager.notificar("Datos inválidos", "error");
            return;
        }

        const nueva = { id: Date.now(), descripcion, monto, tipo };
        this.transacciones.push(nueva);
        StorageManager.guardarTransacciones(this.transacciones);
        e.target.reset();
        UIManager.notificar("Registro exitoso ✓");
        this.actualizarUI();
    },

    cambiarPresupuesto() {
        const valorRaw = document.getElementById("input-presupuesto").value;
        const valor = parseFloat(valorRaw.replace(",", "."));
        if (!isNaN(valor) && valor >= 0) {
            this.presupuesto = valor;
            StorageManager.guardarPresupuesto(valor);
            document.getElementById("input-presupuesto").value = "";
            UIManager.notificar("Presupuesto guardado");
            this.actualizarUI();
        }
    },

    eliminarTransaccion(id) {
        UIManager.confirmarAccion("¿Eliminar movimiento?", "No podrás deshacerlo", () => {
            this.transacciones = this.transacciones.filter(t => t.id !== id);
            StorageManager.guardarTransacciones(this.transacciones);
            this.actualizarUI();
        });
    },

    borrarTodo() {
        UIManager.confirmarAccion("¿Limpiar todo?", "Se borrará el historial y presupuesto.", () => {
            StorageManager.limpiarTodo();
            this.transacciones = [];
            this.presupuesto = 0;
            UIManager.notificar("App reseteada", "success");
            window.location.reload();
        });
    },

    actualizarUI() {
        const { totalGastos } = UIManager.actualizarStats(this.presupuesto, this.transacciones);
        UIManager.renderizarLista(this.transacciones, (id) => this.eliminarTransaccion(id));
        UIManager.actualizarProgreso(this.presupuesto, totalGastos);
    }
};

document.addEventListener("DOMContentLoaded", () => App.iniciar());
