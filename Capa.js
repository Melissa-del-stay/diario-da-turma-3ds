
document.addEventListener("DOMContentLoaded", function () {
    const capa = document.getElementById("capa");
    const cadeado = document.getElementById("cadeado");
    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");

    function abrirDiario() {
        if (capa && !capa.classList.contains("abrindo")) {
            capa.classList.add("abrindo");
        }
    }

    cadeado.addEventListener("click", abrirDiario);

    cadeado.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            abrirDiario();
        }
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        mensagem.textContent =
            "A tela de entrada está funcionando!";
    });
});
