const API = "http://localhost:3000";

async function abrirModalQuarto() {
    document.getElementById("modalQuarto").style.display = "flex";
}

function fecharModalQuarto() {
    document.getElementById("modalQuarto").style.display = "none";
}

async function salvarQuarto() {
    const numero = document.getElementById("numeroQuarto").value;
    const tipo = document.getElementById("tipoQuarto").value;

    await fetch(`${API}/quartos/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, tipo })
    });

    fecharModalQuarto();
    listarQuartos();
}

async function listarQuartos() {
    const tabela = document.getElementById("listaQuartos");
    if (!tabela) return;

    const res = await fetch(`${API}/quartos/listar`);
    const quartos = await res.json();

    tabela.innerHTML = "";

    quartos.forEach(q => {
        tabela.innerHTML += `
        <tr>
            <td>${q.id}</td>
            <td>${q.numero}</td>
            <td>${q.tipo}</td>
            <td>
                <button onclick="verReservas(${q.id}, '${q.numero}')">Ver Reservas</button>
                <button class="danger" onclick="excluirQuarto(${q.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

async function excluirQuarto(id) {
    if (confirm("Deseja excluir este quarto?")) {
        const res = await fetch(`${API}/reservas/listar`);
        const reservas = await res.json();
 
        const reservasDoQuarto = reservas.filter(r => r.quartosId === id);
 
        for (const r of reservasDoQuarto) {
            await fetch(`${API}/reservas/excluir/${r.id}`, { method: "DELETE" });
        }
 
        await fetch(`${API}/quartos/excluir/${id}`, { method: "DELETE" });
        listarQuartos();
    }
}

function verReservas(id, numero) {
    sessionStorage.setItem("quartoAtual", id);
    sessionStorage.setItem("quartoNumero", numero);
    window.location = "reservas.html";
}

function abrirModalReserva() {
    document.getElementById("modalReserva").style.display = "flex";
}

function fecharModalReserva() {
    document.getElementById("modalReserva").style.display = "none";
}

async function salvarReserva() {
    const quartosId = Number(sessionStorage.getItem("quartoAtual"));

    await fetch(`${API}/reservas/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            hospede: document.getElementById("hospede").value,
            data_entrada: new Date(document.getElementById("entrada").value).toISOString(),
            data_saida: new Date(document.getElementById("saida").value).toISOString(),
            quartosId
        })
    });

    fecharModalReserva();
    listarReservas();
}

async function listarReservas() {
    const tabela = document.getElementById("listaReservas");
    if (!tabela) return;

    const quartoId = Number(sessionStorage.getItem("quartoAtual"));
    const quartoNumero = sessionStorage.getItem("quartoNumero");

    const res = await fetch(`${API}/reservas/listar`);
    const reservas = await res.json();

    tabela.innerHTML = "";

    reservas
        .filter(r => r.quartosId === quartoId)
        .forEach(r => {
            const entrada = new Date(r.data_entrada).toLocaleDateString("pt-BR");
            const saida = new Date(r.data_saida).toLocaleDateString("pt-BR");

            tabela.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.hospede}</td>
                <td>${entrada}</td>
                <td>${saida}</td>
                <td>
                    <button class="danger" onclick="excluirReserva(${r.id})">Excluir</button>
                </td>
            </tr>`;
        });

    const titulo = document.getElementById("tituloQuarto");
    if (titulo) titulo.innerText = `Reservas do Quarto ${quartoNumero}`;
}

async function excluirReserva(id) {
    if (confirm("Deseja excluir esta reserva?")) {
        await fetch(`${API}/reservas/excluir/${id}`, { method: "DELETE" });
        listarReservas();
    }
}

listarQuartos();
listarReservas();