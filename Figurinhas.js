
/* ========================================
   FIGURINHAS — NOSSO DIÁRIO 3DS
======================================== */

const paginas = document.querySelectorAll(".pagina-figurinhas");

const paginaAnterior = document.getElementById("paginaAnterior");
const proximaPagina = document.getElementById("proximaPagina");
const indicadorPagina = document.getElementById("indicadorPagina");

let paginaAtual = 0;
let animando = false;

const totalPaginas = paginas.length;

/* ========================================
   ATUALIZAR CONTROLES
======================================== */

function atualizarControles() {
    indicadorPagina.textContent =
        `Página ${paginaAtual + 1} de ${totalPaginas}`;

    paginaAnterior.disabled = paginaAtual === 0;
    proximaPagina.disabled = paginaAtual === totalPaginas - 1;
}

/* ========================================
   VIRAR PÁGINA
======================================== */

function virarPagina(direcao) {

    if (animando) return;

    const proxima = paginaAtual + direcao;

    if (proxima < 0 || proxima >= totalPaginas) return;

    const paginaAtualElemento = paginas[paginaAtual];
    const proximaPaginaElemento = paginas[proxima];

    animando = true;

    paginaAnterior.disabled = true;
    proximaPagina.disabled = true;

    // Animação de saída
    const classeSaida = direcao === 1
        ? "virando-saida-proxima"
        : "virando-saida-anterior";

    const classeEntrada = direcao === 1
        ? "virando-entrada-proxima"
        : "virando-entrada-anterior";

    paginaAtualElemento.classList.add(classeSaida);

    paginaAtualElemento.addEventListener("animationend", function saidaFinalizada(event) {

        if (event.target !== paginaAtualElemento) return;

        paginaAtualElemento.removeEventListener(
            "animationend",
            saidaFinalizada
        );

        paginaAtualElemento.classList.remove(
            "ativa",
            classeSaida
        );

        // Atualiza a página atual
        paginaAtual = proxima;

        proximaPaginaElemento.classList.add("ativa");
        proximaPaginaElemento.classList.add(classeEntrada);

        atualizarControles();

        // Finaliza a animação de entrada
        proximaPaginaElemento.addEventListener("animationend", function entradaFinalizada(event) {

            if (event.target !== proximaPaginaElemento) return;

            proximaPaginaElemento.removeEventListener(
                "animationend",
                entradaFinalizada
            );

            proximaPaginaElemento.classList.remove(classeEntrada);

            animando = false;
            atualizarControles();

        });

    });

}

/* ========================================
   BOTÕES
======================================== */

proximaPagina.addEventListener("click", () => {
    virarPagina(1);
});

paginaAnterior.addEventListener("click", () => {
    virarPagina(-1);
});

/* ========================================
   INICIALIZAÇÃO
======================================== */

paginas.forEach((pagina, indice) => {
    pagina.classList.remove("ativa");

    if (indice === 0) {
        pagina.classList.add("ativa");
    }
});

atualizarControles();
