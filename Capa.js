
document.addEventListener("DOMContentLoaded", function () {

    const capa = document.getElementById("capa");
    const cadeado = document.getElementById("cadeado");
    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");
    const botaoEntrar = formulario
        ? formulario.querySelector('button[type="submit"]')
        : null;

    let enviandoFormulario = false;

    /* ========================================
       ABRIR A CAPA
       NÃO ALTERAR ESTA ANIMAÇÃO
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
       ENTRAR NO DIÁRIO
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

            const pagina = document.getElementById("paginaEntrada")
                || document.querySelector(".pagina");

            if (pagina) {
                pagina.classList.add("virando");
            }

            /* Redirecionamento garantido */
            setTimeout(function () {
                window.location.href = "./Diario.html";
            }, 1000);

        });
    }

});
