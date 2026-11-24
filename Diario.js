
const postits = document.querySelectorAll(".postit");
const folhas = document.querySelectorAll(".folha");
const botaoAnterior = document.getElementById("paginaAnterior");
const botaoProxima = document.getElementById("proximaPagina");

let paginaAtual = 0;
let trocandoPagina = false;
function atualizarBotoes() {
    botaoAnterior.disabled = paginaAtual === 0;
    botaoProxima.disabled = paginaAtual === folhas.length - 1;
}

// Garante que a página inicial esteja visível
const paginaInicial = document.querySelector('.folha[data-indice="0"]');

if (paginaInicial) {
    paginaInicial.hidden = false;
    paginaInicial.classList.add("ativa");
}

// Esconde as outras páginas inicialmente
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

    // O marcador História abre o livro História
    if (indice === 1) {
        window.location.href = "./Historia.html";
        return;
    }
    // O marcador Fotos abre a galeria de fotografias
    if (indice === 2) {
        window.location.href = "./Fotos.html";
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

    // Inicia a animação
    folhaAtual.classList.remove("ativa");
    folhaAtual.classList.add("virando");

    requestAnimationFrame(() => {
        proximaFolha.classList.add("ativa");

        setTimeout(() => {
            folhaAtual.hidden = true;
            folhaAtual.classList.remove("virando");

            paginaAtual = indice;
            trocandoPagina = false;
            atualizarBotoes();
        }, 650);
    });
}

// Adiciona os cliques aos marcadores
postits.forEach((postit) => {
    postit.addEventListener("click", () => {
        const indice = Number(postit.dataset.pagina);
        abrirPagina(indice);
    });
});
botaoAnterior.addEventListener("click", () => {
    if (paginaAtual > 0) {
        abrirPagina(paginaAtual - 1);
    }
});

botaoProxima.addEventListener("click", () => {
    if (paginaAtual < folhas.length - 1) {
        abrirPagina(paginaAtual + 1);
    }
});

atualizarBotoes();
