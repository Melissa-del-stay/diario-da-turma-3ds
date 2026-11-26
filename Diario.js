
document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       ELEMENTOS DO DIÁRIO
    ======================================== */

    const folhas = document.querySelectorAll(".folha");

    const voltarPagina = document.getElementById("voltarPagina");
    const avancarPagina = document.getElementById("avancarPagina");

    const postits = document.querySelectorAll(".postit");
    // Carrega a página História antecipadamente.
    const preCarregamento = document.createElement("link");

    preCarregamento.rel = "prefetch";
    preCarregamento.href = "Historia.html";

    document.head.appendChild(preCarregamento);
    let animando = false;

    /* ========================================
       CONFIGURAÇÃO INICIAL
    ======================================== */

    if (voltarPagina) {
        voltarPagina.disabled = true;
    }

    /* ========================================
       IDENTIFICAR PÁGINA ATUAL
    ======================================== */

    const paginaAtual = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    postits.forEach(function (postit) {

        const destino = postit.getAttribute("href");

        if (!destino) return;

        const arquivoDestino = destino
            .split("/")
            .pop()
            .toLowerCase();

        if (arquivoDestino === paginaAtual) {
            postit.classList.add("ativo");
            postit.setAttribute("aria-current", "page");
        } else {
            postit.classList.remove("ativo");
            postit.removeAttribute("aria-current");
        }

    });

    /* ========================================
       ANIMAÇÃO DE VIRAR A PÁGINA
    ======================================== */

    function virarPagina(direcao, destino) {

        if (animando) return;

        const folhaAtiva = document.querySelector(".folha.ativa");

        if (!folhaAtiva) {
            window.location.href = destino;
            return;
        }

        animando = true;

        if (voltarPagina) {
            voltarPagina.disabled = true;
        }

        if (avancarPagina) {
            avancarPagina.disabled = true;
        }

        const classeAnimacao = direcao === "proxima"
            ? "virando-proxima"
            : "virando-anterior";

        folhaAtiva.classList.add(classeAnimacao);

        /* Aguarda a animação original de 550ms */

        let finalizada = false;

        function finalizarAnimacao() {

            if (finalizada) return;

            finalizada = true;

            folhaAtiva.removeEventListener(
                "animationend",
                detectarFim
            );

            window.location.href = destino;
        }

        function detectarFim(event) {

            if (event.target !== folhaAtiva) return;

            if (
                event.animationName !== "virarProxima" &&
                event.animationName !== "virarAnterior"
            ) {
                return;
            }

            finalizarAnimacao();
        }

        folhaAtiva.addEventListener(
            "animationend",
            detectarFim
        );

        /* Segurança caso o navegador não dispare animationend */

    }

    /* ========================================
       SETA DIREITA — HISTÓRIA
    ======================================== */

    if (avancarPagina) {

        avancarPagina.addEventListener("click", function () {

            virarPagina("proxima", "Historia.html");

        });

    }

    /* ========================================
       SETA ESQUERDA
    ======================================== */

    if (voltarPagina) {

        voltarPagina.addEventListener("click", function () {

            if (voltarPagina.disabled) return;

            virarPagina("anterior", "Diario.html");

        });

    }

});
