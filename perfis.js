
const campoPesquisa = document.getElementById("pesquisarPerfil");
const cards = document.querySelectorAll(".card-perfil");
const mensagemVazia = document.getElementById("nenhumPerfil");

campoPesquisa.addEventListener("input", function () {

    const pesquisa = campoPesquisa.value
        .toLowerCase()
        .trim();

    let encontrados = 0;

    cards.forEach(function (card) {

        const nome = card.dataset.nome.toLowerCase();

        if (nome.includes(pesquisa)) {
            card.style.display = "";
            encontrados++;
        } else {
            card.style.display = "none";
        }

    });

    mensagemVazia.style.display =
        encontrados === 0 ? "block" : "none";

});
