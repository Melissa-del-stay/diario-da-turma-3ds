
/* ========================================
   FOTOS — NOSSO DIÁRIO 3DS
======================================== */

const gradeFotos = document.getElementById("gradeFotos");

const paginaAnterior = document.getElementById("paginaAnterior");
const proximaPagina = document.getElementById("proximaPagina");
const indicadorPagina = document.getElementById("indicadorPagina");

const visualizador = document.getElementById("visualizador");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharFoto = document.getElementById("fecharFoto");
const fotoAnterior = document.getElementById("fotoAnterior");
const fotoProxima = document.getElementById("fotoProxima");

const cabecalho = document.querySelector(".cabecalho");
const controles = document.querySelector(".controles");

const etiqueta = document.querySelector(".etiqueta");
const titulo = document.querySelector(".cabecalho h1");
const descricao = document.querySelector(".cabecalho p");

const fotosPorPagina = 6;

let paginaAtual = 0;
let fotoAtual = 0;
let animacaoEmAndamento = false;

const duracaoSaida = 200;
const duracaoEntrada = 1100;

// Espaços reservados para as futuras fotografias
const fotos = Array.from({ length: 12 }, (_, indice) => ({
    src: null,
    alt: `Memória ${indice + 1}`
}));

const totalPaginas = Math.ceil(fotos.length / fotosPorPagina);

// ========================================
// MOSTRAR FOTOS
// ========================================

function mostrarFotos() {
    gradeFotos.innerHTML = "";

    const inicio = paginaAtual * fotosPorPagina;

    const fotosDaPagina = fotos.slice(
        inicio,
        inicio + fotosPorPagina
    );

    fotosDaPagina.forEach((foto, indice) => {
        const botao = document.createElement("button");

        botao.className = "foto-item";
        botao.type = "button";

        if (foto.src) {
            const imagem = document.createElement("img");

            imagem.src = foto.src;
            imagem.alt = foto.alt;

            botao.appendChild(imagem);

            botao.addEventListener("click", () => {
                abrirFoto(inicio + indice);
            });

        } else {
            botao.disabled = true;

            const placeholder = document.createElement("div");

            placeholder.className = "foto-placeholder";

            const simbolo = document.createElement("span");
            simbolo.textContent = "✦";

            const texto = document.createElement("small");
            texto.textContent = "Espaço para foto";

            placeholder.append(simbolo, texto);
            botao.appendChild(placeholder);
        }

        gradeFotos.appendChild(botao);
    });

    atualizarControles();
}

// ========================================
// ATUALIZAR CONTROLES
// ========================================

function atualizarControles() {
    paginaAnterior.disabled = paginaAtual === 0;

    proximaPagina.disabled =
        paginaAtual === totalPaginas - 1;

    indicadorPagina.textContent =
        `Página ${String(paginaAtual + 1).padStart(2, "0")} / ${String(totalPaginas).padStart(2, "0")}`;
}

// ========================================
// ANIMAÇÃO DE ENTRADA
// ========================================

function animarEntrada() {

    const elementos = [
        etiqueta,
        titulo,
        descricao,
        ...gradeFotos.children,
        controles
    ];

    elementos.forEach((elemento, indice) => {
        elemento.classList.remove("subindo-aparecendo");

        elemento.style.animationDelay = `${indice * 65}ms`;

        void elemento.offsetWidth;

        elemento.classList.add("subindo-aparecendo");
    });

    const tempoTotal = duracaoEntrada + elementos.length * 65;

    setTimeout(() => {
        elementos.forEach(elemento => {
            elemento.classList.remove("subindo-aparecendo");
            elemento.style.animationDelay = "";
        });

        animacaoEmAndamento = false;

    }, tempoTotal);
}

// ========================================
// ANIMAÇÃO DE SAÍDA
// ========================================

function animarSaida() {
    cabecalho.classList.add("saindo-subindo");
    gradeFotos.classList.add("saindo-subindo");
    controles.classList.add("saindo-subindo");
}

// ========================================
// VIRAR PÁGINA
// ========================================

function virarPagina(direcao) {

    if (animacaoEmAndamento) return;

    const novaPagina = paginaAtual + direcao;

    if (novaPagina < 0 || novaPagina >= totalPaginas) {
        return;
    }

    animacaoEmAndamento = true;

    animarSaida();

    setTimeout(() => {

        cabecalho.classList.remove("saindo-subindo");
        gradeFotos.classList.remove("saindo-subindo");
        controles.classList.remove("saindo-subindo");

        paginaAtual = novaPagina;

        mostrarFotos();

        animarEntrada();

    }, duracaoSaida);
}

paginaAnterior.addEventListener("click", () => {
    virarPagina(-1);
});

proximaPagina.addEventListener("click", () => {
    virarPagina(1);
});

// ========================================
// VISUALIZADOR
// ========================================

function abrirFoto(indice) {

    if (!fotos[indice] || !fotos[indice].src) {
        return;
    }

    fotoAtual = indice;

    fotoAmpliada.src = fotos[indice].src;
    fotoAmpliada.alt = fotos[indice].alt;

    visualizador.classList.add("aberto");
}

function fecharVisualizador() {
    visualizador.classList.remove("aberto");
    fotoAmpliada.src = "";
}

fecharFoto.addEventListener("click", fecharVisualizador);

visualizador.addEventListener("click", (evento) => {

    if (evento.target === visualizador) {
        fecharVisualizador();
    }

});

// ========================================
// TROCAR FOTO AMPLIADA
// ========================================

function mudarFoto(direcao) {

    let novoIndice = fotoAtual + direcao;

    while (novoIndice >= 0 && novoIndice < fotos.length) {

        if (fotos[novoIndice].src) {
            abrirFoto(novoIndice);
            return;
        }

        novoIndice += direcao;
    }
}

fotoAnterior.addEventListener("click", () => mudarFoto(-1));
fotoProxima.addEventListener("click", () => mudarFoto(1));

// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", (evento) => {

    if (!visualizador.classList.contains("aberto")) {
        return;
    }

    if (evento.key === "Escape") {
        fecharVisualizador();
    }

    if (evento.key === "ArrowLeft") {
        mudarFoto(-1);
    }

    if (evento.key === "ArrowRight") {
        mudarFoto(1);
    }

});

// ========================================
// INICIAR
// ========================================

mostrarFotos();

animacaoEmAndamento = true;
animarEntrada();
