
document.addEventListener("DOMContentLoaded", () => {

    const paginas = document.querySelectorAll(".pagina");
    const botaoAnterior = document.getElementById("paginaAnterior");
    const botaoProxima = document.getElementById("proximaPagina");
    const indicador = document.getElementById("indicadorPagina");

    const nomesPaginas = [
        "Capa",
        "Introdução",
        "Capítulo 01 • 2025",
        "Capítulo 02 • Terceirão — Parte 1",
        "Capítulo 02 • Terceirão — Parte 2"
    ];

    if (!paginas.length || !botaoAnterior || !botaoProxima || !indicador) {
        console.error("Erro: não encontrei todos os elementos do livro.");
        return;
    }

    let paginaAtual = 0;
    let animando = false;

    function atualizarBotoes() {
        botaoAnterior.disabled = paginaAtual === 0;
        botaoProxima.disabled = paginaAtual === paginas.length - 1;

        indicador.textContent =
            nomesPaginas[paginaAtual] || `Página ${paginaAtual + 1}`;
    }

    function mostrarPagina(indice, direcao) {

        if (animando || indice < 0 || indice >= paginas.length) {
            return;
        }

        animando = true;

        const paginaAtualElemento = paginas[paginaAtual];
        const proximaPaginaElemento = paginas[indice];

        proximaPaginaElemento.style.display = "block";
        proximaPaginaElemento.classList.remove("ativa");

        paginaAtualElemento.classList.add(
            direcao === 1 ? "virando-frente" : "virando-volta"
        );

        proximaPaginaElemento.classList.add("preparando");

        setTimeout(() => {

            paginaAtualElemento.classList.remove(
                "ativa",
                "virando-frente",
                "virando-volta"
            );

            paginaAtualElemento.style.display = "none";

            proximaPaginaElemento.classList.remove("preparando");
            proximaPaginaElemento.classList.add("ativa");

            paginaAtual = indice;

            atualizarBotoes();

            animando = false;

        }, 650);
    }

    botaoProxima.addEventListener("click", () => {
        mostrarPagina(paginaAtual + 1, 1);
    });

    botaoAnterior.addEventListener("click", () => {
        mostrarPagina(paginaAtual - 1, -1);
    });

    paginas.forEach((pagina, indice) => {
        pagina.classList.remove(
            "ativa",
            "preparando",
            "virando-frente",
            "virando-volta"
        );

        pagina.style.display = indice === 0 ? "block" : "none";
    });

    paginas[0].classList.add("ativa");

    atualizarBotoes();

});
