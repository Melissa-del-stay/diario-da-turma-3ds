
document.addEventListener("DOMContentLoaded", function () {

    const capa = document.getElementById("capa");
    const cadeado = document.getElementById("cadeado");
    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");
    const paginaInicial = document.getElementById("paginaInicial");

    const botaoEntrar = formulario
        ? formulario.querySelector('button[type="submit"]')
        : null;

    let enviandoFormulario = false;

    /* ========================================
       ABRIR A CAPA
    ======================================== */

    function abrirCapa() {
        if (capa && !capa.classList.contains("aberta")) {
            capa.classList.add("aberta");
        }
    }

    if (cadeado) {
        cadeado.addEventListener("click", abrirCapa);

        cadeado.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrirCapa();
            }
        });
    }

    /* ========================================
       ENVIAR FORMULÁRIO
    ======================================== */

    if (formulario) {
        formulario.addEventListener("submit", function (event) {

            event.preventDefault();

            if (enviandoFormulario) return;

            enviandoFormulario = true;

            if (mensagem) {
                mensagem.textContent = "Abrindo nosso diário...";
            }

            if (botaoEntrar) {
                botaoEntrar.disabled = true;
                botaoEntrar.textContent = "Abrindo...";
            }

            const pagina = document.querySelector(".pagina");

            if (pagina) {
                pagina.addEventListener("animationend", function finalizarAnimacao(event) {

                    if (event.target !== pagina || event.animationName !== "virarPagina") {
                        return;
                    }

                    /* Mostra o Diário que já está carregado no iframe */
                    if (paginaInicial) {
                        paginaInicial.classList.add("diario-visivel");
                    }

                    /* Retira a tela de entrada */
                    pagina.remove();

                    if (capa) {
                        capa.remove();
                    }

                }, { once: true });

                pagina.classList.add("virando");

            } else {
                window.location.replace("./Diario.html");
            }

        });
    }

});
