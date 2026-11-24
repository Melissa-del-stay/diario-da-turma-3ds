
/* ========================================
   CAÇA-PALAVRAS — NOSSO DIÁRIO 3DS
======================================== */

// 1. PALAVRAS E EXPLICAÇÕES

const palavras = [
    { palavra: "POLENGUINHO", explicacao: "Alê, a criança da sala." },
    { palavra: "TRIBUNAL", explicacao: "O grupo de patetas da sala (os meninos)." },
    { palavra: "PEROLAGACHA", explicacao: "Um e-mail antigo de 2015." },
    { palavra: "MALMAL", explicacao: "Apelido do Mauricio." },
    { palavra: "CAPS", explicacao: "A sala em si já é o CAPS." },
    { palavra: "HENRIQUE", explicacao: "O farmador de aura." },
    { palavra: "LUTADORAFORTE", explicacao: "Um usuário com nome esquisito no Roblox." },
    { palavra: "CAFE", explicacao: "João Vitor." },
    { palavra: "LEITE", explicacao: "João Gabriel." },
    { palavra: "BOLINHA", explicacao: "Ex-mascote da sala." }
];

// 2. ELEMENTOS DO HTML

const tamanho = 14;

const quadro = document.getElementById("quadroLetras");
const listaPalavras = document.getElementById("listaPalavras");
const contador = document.getElementById("contador");
const explicacao = document.getElementById("explicacao");
const mensagemFinal = document.getElementById("mensagemFinal");
const botaoProximaRodada = document.getElementById("proximaRodada");

let letras = [];
let posicoesPalavras = {};
let encontradas = [];

let selecionando = false;
let inicioSelecao = null;
let fimSelecao = null;

// 3. DIREÇÕES DAS PALAVRAS

const direcoes = [
    [0, 1], [0, -1],
    [1, 0], [-1, 0],
    [1, 1], [1, -1],
    [-1, 1], [-1, -1]
];

// 4. CRIAR O QUADRO

function criarQuadro() {

    letras = Array.from(
        { length: tamanho },
        () => Array(tamanho).fill("")
    );

    posicoesPalavras = {};

    palavras.forEach(item => {

        let colocada = false;
        let tentativas = 0;

        while (!colocada && tentativas < 2000) {

            tentativas++;

            const direcao =
                direcoes[Math.floor(Math.random() * direcoes.length)];

            const linha = Math.floor(Math.random() * tamanho);
            const coluna = Math.floor(Math.random() * tamanho);

            const [dl, dc] = direcao;

            const fimLinha = linha + (item.palavra.length - 1) * dl;
            const fimColuna = coluna + (item.palavra.length - 1) * dc;

            if (
                fimLinha < 0 || fimLinha >= tamanho ||
                fimColuna < 0 || fimColuna >= tamanho
            ) {
                continue;
            }

            let podeColocar = true;

            for (let i = 0; i < item.palavra.length; i++) {

                const l = linha + i * dl;
                const c = coluna + i * dc;

                if (
                    letras[l][c] !== "" &&
                    letras[l][c] !== item.palavra[i]
                ) {
                    podeColocar = false;
                    break;
                }
            }

            if (!podeColocar) continue;

            const posicoes = [];

            for (let i = 0; i < item.palavra.length; i++) {

                const l = linha + i * dl;
                const c = coluna + i * dc;

                letras[l][c] = item.palavra[i];

                posicoes.push({ linha: l, coluna: c });
            }

            posicoesPalavras[item.palavra] = posicoes;
            colocada = true;
        }

        if (!colocada) {
            throw new Error("Não foi possível posicionar: " + item.palavra);
        }
    });

    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let l = 0; l < tamanho; l++) {
        for (let c = 0; c < tamanho; c++) {

            if (letras[l][c] === "") {
                letras[l][c] =
                    alfabeto[Math.floor(Math.random() * alfabeto.length)];
            }
        }
    }

    mostrarQuadro();
}

// 5. MOSTRAR AS LETRAS

function mostrarQuadro() {

    quadro.innerHTML = "";

    for (let l = 0; l < tamanho; l++) {
        for (let c = 0; c < tamanho; c++) {

            const celula = document.createElement("button");

            celula.type = "button";
            celula.className = "letra";
            celula.textContent = letras[l][c];

            celula.dataset.linha = l;
            celula.dataset.coluna = c;

            celula.setAttribute("draggable", "false");

            quadro.appendChild(celula);
        }
    }
}

// 6. MOSTRAR A LISTA

function mostrarLista() {

    listaPalavras.innerHTML = "";

    palavras.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item.palavra;
        li.dataset.palavra = item.palavra;

        if (encontradas.includes(item.palavra)) {
            li.classList.add("encontrada");
        }

        listaPalavras.appendChild(li);
    });

    contador.textContent = encontradas.length + " / 10";
}

// 7. OBTER A CÉLULA PELA POSIÇÃO DO MOUSE

function obterCelulaNaPosicao(x, y) {

    const elemento = document.elementFromPoint(x, y);

    if (!elemento) return null;

    const celula = elemento.closest(".letra");

    if (!celula || !quadro.contains(celula)) {
        return null;
    }

    return celula;
}

// 8. COMEÇAR A SELEÇÃO

quadro.addEventListener("pointerdown", function (event) {

    const celula = event.target.closest(".letra");

    if (!celula) return;
    if (encontradas.length === palavras.length) return;

    event.preventDefault();

    selecionando = true;

    inicioSelecao = {
        linha: Number(celula.dataset.linha),
        coluna: Number(celula.dataset.coluna)
    };

    fimSelecao = { ...inicioSelecao };

    atualizarSelecao();
});

// 9. ACOMPANHAR O ARRASTO

window.addEventListener("pointermove", function (event) {

    if (!selecionando) return;

    const celula = obterCelulaNaPosicao(
        event.clientX,
        event.clientY
    );

    if (!celula) return;

    fimSelecao = {
        linha: Number(celula.dataset.linha),
        coluna: Number(celula.dataset.coluna)
    };

    atualizarSelecao();
});

// 10. CALCULAR O CAMINHO

function obterCaminho() {

    if (!inicioSelecao || !fimSelecao) return [];

    const dl = fimSelecao.linha - inicioSelecao.linha;
    const dc = fimSelecao.coluna - inicioSelecao.coluna;

    const passos = Math.max(Math.abs(dl), Math.abs(dc));

    if (passos === 0) return [inicioSelecao];

    if (
        dl !== 0 &&
        dc !== 0 &&
        Math.abs(dl) !== Math.abs(dc)
    ) {
        return [];
    }

    const passoLinha = dl === 0 ? 0 : dl / passos;
    const passoColuna = dc === 0 ? 0 : dc / passos;

    const caminho = [];

    for (let i = 0; i <= passos; i++) {

        caminho.push({
            linha: inicioSelecao.linha + i * passoLinha,
            coluna: inicioSelecao.coluna + i * passoColuna
        });
    }

    return caminho;
}

// 11. DESTACAR AS LETRAS

function atualizarSelecao() {

    quadro.querySelectorAll(".letra.selecionada")
        .forEach(celula => {
            celula.classList.remove("selecionada");
        });

    const caminho = obterCaminho();

    caminho.forEach(posicao => {

        const celula = quadro.querySelector(
            `[data-linha="${posicao.linha}"][data-coluna="${posicao.coluna}"]`
        );

        if (celula && !celula.classList.contains("encontrada")) {
            celula.classList.add("selecionada");
        }
    });
}

// 12. SOLTAR O MOUSE OU DEDO

window.addEventListener("pointerup", function () {

    if (!selecionando) return;

    verificarPalavra();

    selecionando = false;

    quadro.querySelectorAll(".letra.selecionada")
        .forEach(celula => {
            celula.classList.remove("selecionada");
        });

    inicioSelecao = null;
    fimSelecao = null;
});

window.addEventListener("pointercancel", function () {

    selecionando = false;

    quadro.querySelectorAll(".letra.selecionada")
        .forEach(celula => {
            celula.classList.remove("selecionada");
        });

    inicioSelecao = null;
    fimSelecao = null;
});

// 13. VERIFICAR A PALAVRA

function verificarPalavra() {

    const caminho = obterCaminho();

    if (caminho.length < 2) return;

    const palavraSelecionada = caminho.map(posicao => {
        return letras[posicao.linha][posicao.coluna];
    }).join("");

    const palavraInvertida = palavraSelecionada
        .split("")
        .reverse()
        .join("");

    const encontrada = palavras.find(item => {

        return (
            !encontradas.includes(item.palavra) &&
            (
                item.palavra === palavraSelecionada ||
                item.palavra === palavraInvertida
            )
        );
    });

    if (encontrada) {
        marcarPalavra(encontrada);
    }
}

// 14. MARCAR A PALAVRA ENCONTRADA

function marcarPalavra(item) {

    encontradas.push(item.palavra);

    const posicoes = posicoesPalavras[item.palavra];

    posicoes.forEach(posicao => {

        const celula = quadro.querySelector(
            `[data-linha="${posicao.linha}"][data-coluna="${posicao.coluna}"]`
        );

        if (celula) {
            celula.classList.add("encontrada");
        }
    });

    const li = listaPalavras.querySelector(
        `[data-palavra="${item.palavra}"]`
    );

    if (li) {
        li.classList.add("encontrada");
    }

    contador.textContent = encontradas.length + " / 10";

    explicacao.innerHTML = `
        <h2>${item.palavra}</h2>
        <p>${item.explicacao}</p>
    `;

    if (encontradas.length === palavras.length) {

        mensagemFinal.textContent =
            "Parabéns! Você encontrou todas as 10 palavras!";

        botaoProximaRodada.hidden = false;
    }
}

// 15. PRÓXIMA RODADA

botaoProximaRodada.addEventListener("click", function () {

    encontradas = [];

    mensagemFinal.textContent = "";
    botaoProximaRodada.hidden = true;

    explicacao.innerHTML = `
        <h2>Você sabia?</h2>
        <p>Encontre uma palavra para descobrir sua explicação!</p>
    `;

    mostrarLista();
    criarQuadro();
});

// 16. INICIAR O JOGO

mostrarLista();
criarQuadro();
