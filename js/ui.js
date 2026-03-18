/**
 * ui.js - Manipulación del DOM y Renderizado
 */

const UIManager = {

    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(valor);
    },

    // Mostrar pantalla de login u app
    mostrarLogin() {
        document.getElementById("login-screen").style.display = "flex";
        document.getElementById("app-screen").style.display = "none";
    },

    mostrarApp(usuario) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-screen").style.display = "block";
        document.getElementById("navbar-nombre").innerText = usuario;
        document.getElementById("avatar-inicial").innerText = usuario.charAt(0).toUpperCase();
    },

    // Renderizar chips de usuarios existentes
    renderizarUsuarios(usuarios) {
        const contenedor = document.getElementById("usuarios-existentes");
        const chips = document.getElementById("chips-container");
        
        if (usuarios.length === 0) {
            contenedor.style.display = "none";
            return;
        }

        contenedor.style.display = "block";
        chips.innerHTML = "";

        usuarios.forEach(u => {
            const btn = document.createElement("button");
            btn.className = "chip-usuario";
            btn.textContent = u;
            btn.onclick = () => {
                document.getElementById("input-login-usuario").value = u;
            };
            chips.appendChild(btn);
        });
    },

    // Actualizar tarjetas de estadísticas
    actualizarStats(presupuesto, transacciones) {
        const totalIngresos = transacciones
            .filter(t => t.tipo === "ingreso")
            .reduce((acc, t) => acc + t.monto, 0);

        const totalGastos = transacciones
            .filter(t => t.tipo === "gasto")
            .reduce((acc, t) => acc + t.monto, 0);

        const balance = presupuesto + totalIngresos - totalGastos;

        const elBalance = document.getElementById("balance-valor");
        elBalance.innerText = this.formatearMoneda(balance);
        elBalance.className = "stat-valor " + (balance < 0 ? "valor-negativo" : balance === 0 ? "valor-neutro" : "valor-positivo");

        document.getElementById("presupuesto-valor").innerText = this.formatearMoneda(presupuesto);
        document.getElementById("total-ingresos").innerText = this.formatearMoneda(totalIngresos);
        document.getElementById("total-gastos").innerText = this.formatearMoneda(totalGastos);
    },

    // Renderizar historial
    renderizarLista(transacciones, onEliminar) {
        const contenedor = document.getElementById("contenedor-transacciones");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        if (transacciones.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📊</div>
                    <p>No hay movimientos registrados todavía.</p>
                </div>`;
            return;
        }

        // Mostrar del más reciente al más antiguo
        const lista = [...transacciones].reverse();

        lista.forEach(t => {
            const div = document.createElement("div");
            div.className = `mov-card ${t.tipo}`;
            
            const emoji = t.tipo === "gasto" ? "📉" : "📈";
            const signo  = t.tipo === "gasto" ? "−" : "+";

            div.innerHTML = `
                <div class="mov-icon">${emoji}</div>
                <div class="mov-info">
                    <div class="mov-descripcion">${t.descripcion}</div>
                    <div class="mov-tipo">${t.tipo}</div>
                </div>
                <div class="mov-monto">${signo} ${this.formatearMoneda(t.monto)}</div>
                <button class="btn-del" data-id="${t.id}" title="Eliminar">✕</button>
            `;
            contenedor.appendChild(div);
            div.querySelector(".btn-del").onclick = () => onEliminar(t.id);
        });
    },

    // Toast con Toastify
    notificar(mensaje, tipo = "success") {
        const colores = {
            success: "linear-gradient(135deg, #00b09b, #3fb950)",
            error: "linear-gradient(135deg, #f85149, #ff6b6b)",
            info: "linear-gradient(135deg, #58a6ff, #1f6feb)"
        };
        Toastify({
            text: mensaje,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: colores[tipo] || colores.success,
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "'Outfit', sans-serif"
            }
        }).showToast();
    },

    // Modal con SweetAlert2
    confirmarAccion(titulo, texto, callback) {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: "warning",
            background: "#161b22",
            color: "#e6edf3",
            showCancelButton: true,
            confirmButtonColor: "#f85149",
            cancelButtonColor: "#30363d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) callback();
        });
    }
};
