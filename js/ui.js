/**
 * ui.js - Estética Premium - Versión Simplificada
 */

const UIManager = {

    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);
    },

    formatearFecha(timestamp) {
        return new Date(timestamp).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    },

    actualizarStats(presupuesto, transacciones) {
        const ingresos = transacciones.filter(t => t.tipo === "ingreso").reduce((acc, t) => acc + t.monto, 0);
        const gastos   = transacciones.filter(t => t.tipo === "gasto").reduce((acc, t) => acc + t.monto, 0);
        const balance = presupuesto + ingresos - gastos;

        document.getElementById("balance-valor").innerText = this.formatearMoneda(balance);
        document.getElementById("presupuesto-valor").innerText = this.formatearMoneda(presupuesto);
        document.getElementById("total-ingresos").innerText = this.formatearMoneda(ingresos);
        document.getElementById("total-gastos").innerText = this.formatearMoneda(gastos);

        return { balance, totalGastos: gastos };
    },

    actualizarProgreso(presupuesto, totalGastos) {
        const card = document.getElementById("card-progreso");
        if (presupuesto <= 0) { card.style.display = "none"; return; }

        card.style.display = "block";
        const pct = Math.min((totalGastos / presupuesto) * 100, 100);
        const barra = document.getElementById("barra-fill");
        barra.style.width = `${pct}%`;
        
        if (pct >= 90) barra.style.background = "#ef233c";
        else if (pct >= 70) barra.style.background = "#d29922";
        else barra.style.background = "#06c270";

        document.getElementById("progreso-pct").innerText = `${Math.round(pct)}% utilizado`;
        document.getElementById("progreso-restante-label").innerText = `${this.formatearMoneda(presupuesto - totalGastos)} disponibles`;
    },

    renderizarLista(transacciones, onEliminar) {
        const contenedor = document.getElementById("contenedor-transacciones");
        contenedor.innerHTML = "";

        if (transacciones.length === 0) {
            contenedor.innerHTML = '<div class="empty-state">No hay movimientos.</div>';
            return;
        }

        const ordenadas = [...transacciones].sort((a,b) => b.id - a.id);
        const meses = {};

        ordenadas.forEach(t => {
            const f = new Date(t.id);
            const claveMes = `${f.getFullYear()}-${f.getMonth()}`;
            const nombreMes = f.toLocaleString("es-AR", { month: "long", year: "numeric" });
            if (!meses[claveMes]) meses[claveMes] = { nombre: nombreMes, items: [] };
            meses[claveMes].items.push(t);
        });

        Object.keys(meses).forEach((k, idx) => {
            const mes = meses[k];
            const block = document.createElement("div");
            block.className = "mes-grupo";
            
            const header = document.createElement("div");
            header.className = `mes-header ${idx === 0 ? "abierto" : "cerrado"}`;
            header.innerHTML = `<span>${mes.nombre}</span><span>▼</span>`;
            header.onclick = () => {
                header.classList.toggle("abierto");
                header.classList.toggle("cerrado");
            };

            const content = document.createElement("div");
            content.className = "mes-contenido";

            mes.items.forEach(t => {
                const item = document.createElement("div");
                item.className = `mov-card ${t.tipo}`;
                item.innerHTML = `
                    <div class="mov-icon">${t.tipo === 'gasto' ? '💸' : '💰'}</div>
                    <div class="mov-info">
                        <span class="mov-descripcion">${t.descripcion}</span>
                        <div class="mov-meta">${this.formatearFecha(t.id)}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="mov-monto ${t.tipo === 'gasto' ? 'valor-negativo' : 'valor-positivo'}">${t.tipo === 'gasto' ? '-' : '+'}${this.formatearMoneda(t.monto)}</span>
                        <button class="btn-del">✕</button>
                    </div>
                `;
                item.querySelector(".btn-del").onclick = () => onEliminar(t.id);
                content.appendChild(item);
            });

            block.appendChild(header);
            block.appendChild(content);
            contenedor.appendChild(block);
        });
    },

    notificar(msg, tipo) {
        Toastify({ text: msg, duration: 2000, style: { background: tipo === "success" ? "#06c270" : "#ef233c" } }).showToast();
    },

    confirmarAccion(tit, txt, cb) {
        Swal.fire({ title: tit, text: txt, icon: "warning", showCancelButton: true, confirmButtonColor: "#4361ee" }).then(res => { if (res.isConfirmed) cb(); });
    }
};
