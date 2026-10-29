
document.addEventListener("DOMContentLoaded", function () {
    const capa = document.getElementById("capa");
    const cadeado = document.getElementById("cadeado");
    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");

    function abrirDiario() {
        if (capa && !capa.classList.contains("aberta")) {
            capa.classList.add("aberta");
        }
    }

    if (cadeado) {
        cadeado.addEventListener("click", abrirDiario);

        cadeado.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrirDiario();
            }
        });
    }

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            if (mensagem) {
                mensagem.textContent =
                    "A tela de entrada está funcionando!";
            }
        });
    }
});
