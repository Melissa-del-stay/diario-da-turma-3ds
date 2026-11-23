const postits = document.querySelectorAll(".postit");
const folhas = document.querySelectorAll(".folha");

let paginaAtual = 0;
let trocandoPagina = false;

// Garante que a página inicial esteja visível quando o diário carregar
const paginaInicial = document.querySelector('.folha[data-indice="0"]');

if (paginaInicial) {
    paginaInicial.hidden = false;
    paginaInicial.classList.add("ativa");
}

// Garante que as outras páginas comecem escondidas
folhas.forEach((folha) => {
    if (folha.dataset.indice !== "0") {
        folha.hidden = true;
        folha.classList.remove("ativa", "virando");
    }
});

// Abre a página selecionada
function abrirPagina(indice) {
    if (trocandoPagina || indice === paginaAtual) {
        return;
    }

    const folhaAtual = document.querySelector(
        `.folha[data-indice="${paginaAtual}"]`
    );

    const proximaFolha = document.querySelector(
        `.folha[data-indice="${indice}"]`
    );

    if (!folhaAtual || !proximaFolha) {
        return;
    }

    trocandoPagina = true;

    // Atualiza o marcador selecionado
    postits.forEach((postit) => {
        const ativo = Number(postit.dataset.pagina) === indice;

        postit.classList.toggle("ativo", ativo);

        if (ativo) {
            postit.setAttribute("aria-current", "page");
        } else {
            postit.removeAttribute("aria-current");
        }
    });

    // Prepara a próxima folha
    proximaFolha.hidden = false;
    proximaFolha.classList.remove("ativa", "virando");

    // Inicia a animação da folha atual
    folhaAtual.classList.remove("ativa");
    folhaAtual.classList.add("virando");

    // Mostra a próxima folha após o início da animação
    requestAnimationFrame(() => {
        proximaFolha.classList.add("ativa");

        // Aguarda a animação terminar
        setTimeout(() => {
            folhaAtual.hidden = true;
            folhaAtual.classList.remove("virando");

            paginaAtual = indice;
            trocandoPagina = false;
        }, 650);
    });
}

// Adiciona o clique aos marcadores
postits.forEach((postit) => {
    postit.addEventListener("click", () => {
        const indice = Number(postit.dataset.pagina);
        abrirPagina(indice);
    });
});