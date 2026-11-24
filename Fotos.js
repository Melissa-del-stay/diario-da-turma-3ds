
// ========================================
// FOTOS — NOSSO DIÁRIO 3DS
// ========================================

// ELEMENTOS DO HTML

const gradeFotos = document.getElementById("gradeFotos");

const botaoAnterior = document.querySelector(".controle-lateral.anterior");
const botaoProximo = document.querySelector(".controle-lateral.proximo");

const postits = document.querySelectorAll(".postit");

// CONFIGURAÇÕES

const fotosPorPagina = 6;

let paginaAtual = 0;

const fotografias = [
    {
        imagem: "café da manhã/imagens/foto1.jpg",
        legenda: "Nossos momentos especiais"
    },
    {
        imagem: "café da manhã/imagens/foto2.jpg",
        legenda: "Memórias da turma"
    },
    {
        imagem: "café da manhã/imagens/foto3.jpg",
        legenda: "Amizades que ficam"
    },
    {
        imagem: "café da manhã/imagens/foto4.jpg",
        legenda: "Dias inesquecíveis"
    },
    {
        imagem: "café da manhã/imagens/foto5.jpeg",
        legenda: "Nossa trajetória"
    },
    {
        imagem: "café da manhã/imagens/foto6.jpeg",
        legenda: "Momentos de alegria"
    }
];

// CALCULA A QUANTIDADE DE PÁGINAS

function quantidadeDePaginas() {
    return Math.ceil(fotografias.length / fotosPorPagina);
}

// MOSTRA AS FOTOGRAFIAS DA PÁGINA ATUAL

function mostrarFotos() {

    gradeFotos.innerHTML = "";

    const inicio = paginaAtual * fotosPorPagina;
    const fim = inicio + fotosPorPagina;

    const fotosDaPagina = fotografias.slice(inicio, fim);

    fotosDaPagina.forEach((foto) => {

        const cartao = document.createElement("figure");
        cartao.classList.add("foto");

        const imagem = document.createElement("img");

        imagem.src = foto.imagem;
        imagem.alt = foto.legenda;
        imagem.loading = "lazy";

        const legenda = document.createElement("figcaption");
        legenda.textContent = foto.legenda;

        cartao.appendChild(imagem);
        cartao.appendChild(legenda);

        gradeFotos.appendChild(cartao);

    });

    atualizarBotoes();
}

// ATUALIZA O ESTADO DAS SETAS

function atualizarBotoes() {

    botaoAnterior.disabled = paginaAtual === 0;

    botaoProximo.disabled =
        paginaAtual >= quantidadeDePaginas() - 1;

}

// AVANÇA UMA PÁGINA

botaoProximo.addEventListener("click", () => {

    if (paginaAtual < quantidadeDePaginas() - 1) {

        paginaAtual++;

        mostrarFotos();

    }

});

// VOLTA UMA PÁGINA

botaoAnterior.addEventListener("click", () => {

    if (paginaAtual > 0) {

        paginaAtual--;

        mostrarFotos();

    }

});

// NAVEGAÇÃO ENTRE AS TELAS

const destinos = {
    "Início": "Diario.html",
    "História": "Historia.html",
    "Fotos": "Fotos.html",
    "Figurinhas": "Figurinhas.html",
    "Jogos": "Jogos.html",
    "Álbum de figurinhas": "Album.html",
    "Perfis da turma": "Perfis.html"
};

postits.forEach((postit) => {

    postit.addEventListener("click", () => {

        const nome = postit.textContent.trim();
        const destino = destinos[nome];

        if (destino && nome !== "Fotos") {
            window.location.href = destino;
        }

    });

});
mostrarFotos();
