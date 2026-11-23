document.addEventListener("DOMContentLoaded", function () {
    const capa = document.getElementById("capa");
    const cadeado = document.getElementById("cadeado");
    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");

    const botaoEntrar = formulario
        ? formulario.querySelector('button[type="submit"]')
        : null;

    let enviandoFormulario = false;

    // Abre a capa ao clicar no cadeado
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

    // Envia o formulário e abre o diário
    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            if (enviandoFormulario) {
                return;
            }

            enviandoFormulario = true;

            if (mensagem) {
                mensagem.textContent = "Abrindo nosso diário...";
            }

            if (botaoEntrar) {
                botaoEntrar.disabled = true;
                botaoEntrar.textContent = "Abrindo...";
            }

            const pagina = document.querySelector(".pagina");

            // Inicia a animação de virar a página
            if (pagina) {
                pagina.classList.add("virando");
            }
          // Vai para o diário mais rápido
setTimeout(function () {
    window.location.replace("./Diario.html");
}, 550);
        });
    }
});