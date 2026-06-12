let quartos = JSON.parse(localStorage.getItem("quartos")) || [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function salvarStorage() {
    localStorage.setItem("quartos", JSON.stringify(quartos));
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function abrirModalQuarto() {
    document.getElementById("modalQuarto").style.display = "flex";
}

function fecharModalQuarto() {
    document.getElementById("modalQuarto").style.display = "none";
}

function salvarQuarto() {

    const numero =
        document.getElementById("numeroQuarto").value;

    const tipo =
        document.getElementById("tipoQuarto").value;

    quartos.push({
        id: Date.now(),
        numero,
        tipo
    });

    salvarStorage();
    fecharModalQuarto();
    listarQuartos();
}

function listarQuartos() {

    const tabela =
        document.getElementById("listaQuartos");

    if (!tabela) return;

    tabela.innerHTML = "";

    quartos.forEach(q => {

        tabela.innerHTML += `
        <tr>

            <td>${q.id}</td>
            <td>${q.numero}</td>
            <td>${q.tipo}</td>

            <td>
                <button onclick="verReservas(${q.id})">
                    Ver Reservas
                </button>

                <button class="danger"
                onclick="excluirQuarto(${q.id})">
                    Excluir
                </button>
            </td>
        </tr>
        `;
    });
}

function excluirQuarto(id) {
    if(confirm("Deseja excluir este quarto?")) {
        quartos =
            quartos.filter(q => q.id !== id);

        salvarStorage();
        listarQuartos();
    }
}

function verReservas(id) {
    localStorage.setItem("quartoAtual", id);
    window.location = "reservas.html";
}


function abrirModalReserva() {
    document.getElementById(
        "modalReserva"
    ).style.display = "flex";
}

function fecharModalReserva() {
    document.getElementById(
        "modalReserva"
    ).style.display = "none";
}

function salvarReserva() {
    const quartoId =
        Number(localStorage.getItem("quartoAtual"));

    reservas.push({
        id: 
            Date.now(), quartoId,
        hospede:
            document.getElementById("hospede").value,
        entrada:
            document.getElementById("entrada").value,
        saida:
            document.getElementById("saida").value
    });

    salvarStorage();
    listarReservas();
    fecharModalReserva();
}

function listarReservas() {

    const tabela =
        document.getElementById("listaReservas");

    if (!tabela) return;

    const quartoId =
        Number(localStorage.getItem("quartoAtual"));

    tabela.innerHTML = "";

    reservas
    .filter(r => r.quartoId === quartoId)
    .forEach(r => {

        tabela.innerHTML += `
        <tr>

            <td>${r.id}</td>
            <td>${r.hospede}</td>
            <td>${r.entrada}</td>
            <td>${r.saida}</td>

            <td>
                <button
                class="danger"
                onclick="excluirReserva(${r.id})">

                Excluir
                </button>
            </td>
        </tr>
        `;
    });

    const quarto = quartos.find(q => q.id === quartoId);

    document.getElementById(
        "tituloQuarto"
    ).innerText =
        `Reservas do Quarto ${quarto.numero}`;
}

function excluirReserva(id) {
    if(confirm("Deseja excluir esta reserva?")) {
        reservas =
            reservas.filter(r => r.id !== id);

        salvarStorage();
        listarReservas();
    }
}

listarQuartos();
listarReservas();