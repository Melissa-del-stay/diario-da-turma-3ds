
const formulario = document.getElementById("formCadastro");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const mensagem = document.getElementById("mensagemStatus");

function validarSenhas() {
    if (
        confirmarSenha.value !== "" &&
        senha.value !== confirmarSenha.value
    ) {
        confirmarSenha.setCustomValidity("As senhas não são iguais.");
    } else {
        confirmarSenha.setCustomValidity("");
    }
}

senha.addEventListener("input", validarSenhas);
confirmarSenha.addEventListener("input", validarSenhas);

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    mensagem.className = "";

    if (senha.value !== confirmarSenha.value) {
        mensagem.textContent =
            "As senhas não coincidem. Confira e tente novamente.";
        mensagem.classList.add("erro");
        confirmarSenha.focus();
        return;
    }

    mensagem.textContent =
        "Tudo certo com o formulário! A criação da conta ainda precisa ser conectada a um sistema de cadastro.";
    mensagem.classList.add("sucesso");
});
