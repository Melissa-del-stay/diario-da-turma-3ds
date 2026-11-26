// ================================
// PLAYER DE MÚSICA
// ================================

const musica = document.getElementById("musicaFundo");
const botaoMusica = document.getElementById("botaoMusica");

if (musica && botaoMusica) {
    botaoMusica.addEventListener("click", () => {
        if (musica.paused) {
            musica.play();
            botaoMusica.textContent = "♫ Pausar minha música";
        } else {
            musica.pause();
            botaoMusica.textContent = "♫ Tocar minha música";
        }
    });
}


// ================================
// CARROSSEL: MINHAS LEMBRANÇAS
// ================================

const caminhoFotos =
    "file:///C:/Users/perol/OneDrive/Documentos/fotos%20minhas/";

const lembrancas = [
    { arquivo: "foto%20minha1.jpeg", legenda: "Um pedacinho de mim ♡" },
    { arquivo: "foto%20minha2.jpeg", legenda: "Uma lembrança especial ♡" },
    { arquivo: "foto%20minha3.jpeg", legenda: "Um momento para guardar ♡" },
    { arquivo: "foto%20minha4.jpeg", legenda: "Uma lembrança minha ♡" },
    { arquivo: "foto%20minha5.jpeg", legenda: "Um pedacinho da minha história ♡" },
    { arquivo: "foto%20minha6.jpg", legenda: "Um momento especial ♡" },
    { arquivo: "foto%20minha7.jpg", legenda: "Uma lembrança querida ♡" },
    { arquivo: "foto%20minha9.jpg", legenda: "Um dia para lembrar ♡" },
    { arquivo: "foto%20minha10.jpg", legenda: "Mais uma lembrança ♡" },
    { arquivo: "foto%20minha11.jpg", legenda: "Um pedacinho de mim ♡" },
    { arquivo: "foto%20minha12.jpeg", legenda: "Uma lembrança especial ♡" }
];

const carrosselConteudo = document.getElementById("carrosselConteudo");
const legendaCarrossel = document.getElementById("legendaCarrossel");
const indicadoresCarrossel = document.getElementById("indicadoresCarrossel");

let lembrancaAtual = 0;
let intervaloCarrossel;


// Mostra uma lembrança
function mostrarLembranca(indice) {
    if (!carrosselConteudo || lembrancas.length === 0) return;

    lembrancaAtual = indice;

    const lembranca = lembrancas[lembrancaAtual];

    carrosselConteudo.innerHTML = "";

    if (lembranca.video) {
        const video = document.createElement("video");

        video.src = caminhoFotos + lembranca.arquivo;
        video.className = "video-destaque";
        video.controls = true;
        video.muted = true;
        video.playsInline = true;

        carrosselConteudo.appendChild(video);
    } else {
        const imagem = document.createElement("img");

        imagem.src = caminhoFotos + lembranca.arquivo;
        imagem.alt = lembranca.legenda || "Uma lembrança minha";
        imagem.className = "foto-destaque";

        carrosselConteudo.appendChild(imagem);
    }

    if (legendaCarrossel) {
        legendaCarrossel.textContent =
            lembranca.legenda || "Um pedacinho de mim ♡";
    }

    atualizarIndicadores();
}


// Cria os indicadores
function criarIndicadores() {
    if (!indicadoresCarrossel) return;

    indicadoresCarrossel.innerHTML = "";

    lembrancas.forEach((lembranca, indice) => {
        const indicador = document.createElement("button");

        indicador.type = "button";
        indicador.className = "indicador-foto";
        indicador.setAttribute(
            "aria-label",
            `Mostrar lembrança ${indice + 1}`
        );

        indicador.addEventListener("click", () => {
            mostrarLembranca(indice);
            reiniciarCarrossel();
        });

        indicadoresCarrossel.appendChild(indicador);
    });
}


// Destaca o indicador atual
function atualizarIndicadores() {
    if (!indicadoresCarrossel) return;

    const indicadores =
        indicadoresCarrossel.querySelectorAll(".indicador-foto");

    indicadores.forEach((indicador, indice) => {
        indicador.classList.toggle("ativo", indice === lembrancaAtual);
    });
}


// Passa para a próxima lembrança
function proximaLembranca() {
    const proximoIndice =
        (lembrancaAtual + 1) % lembrancas.length;

    mostrarLembranca(proximoIndice);
}


// Reinicia o tempo do carrossel
function reiniciarCarrossel() {
    clearInterval(intervaloCarrossel);

    intervaloCarrossel = setInterval(() => {
        proximaLembranca();
    }, 5000);
}


// Inicia o carrossel
if (carrosselConteudo && indicadoresCarrossel) {
    criarIndicadores();
    mostrarLembranca(0);
    reiniciarCarrossel();
}
// ================================
// CARROSSEL: MINHA INFÂNCIA
// ================================

const caminhoInfancia =
    "file:///C:/Users/perol/OneDrive/Documentos/eu%20crian%C3%A7a/";

const fotosInfancia = [
    "foto%20com%20mae1.jpg",
    "pequena%20eu2.jpg",
    "pequena%20eu%20pai6.jpg",
    "pequena%20eu3.jpg",
    "pequena%20eu%20pai%20e%20vovo5.jpg",
    "pequena%20eu%20pai4.jpg",
    "pequena%20eu%205.jpg"
];

const conteudoInfancia =
    document.getElementById("conteudoInfancia");

const indicadoresInfancia =
    document.getElementById("indicadoresInfancia");

const legendaInfancia =
    document.getElementById("legendaInfancia");

let infanciaAtual = 0;
let intervaloInfancia;


// Mostra uma foto da infância
function mostrarFotoInfancia(indice) {
    if (!conteudoInfancia || fotosInfancia.length === 0) return;

    infanciaAtual = indice;

    const imagem = document.createElement("img");

    imagem.src = caminhoInfancia + fotosInfancia[infanciaAtual];
    imagem.alt = "Uma lembrança da minha infância";
    imagem.className = "foto-destaque";

    conteudoInfancia.innerHTML = "";
    conteudoInfancia.appendChild(imagem);

    if (legendaInfancia) {
        legendaInfancia.textContent = "Um pedacinho da minha infância ♡";
    }

    atualizarIndicadoresInfancia();
}


// Cria os indicadores
function criarIndicadoresInfancia() {
    if (!indicadoresInfancia) return;

    indicadoresInfancia.innerHTML = "";

    fotosInfancia.forEach((foto, indice) => {
        const indicador = document.createElement("button");

        indicador.type = "button";
        indicador.className = "indicador-foto";

        indicador.setAttribute(
            "aria-label",
            `Mostrar foto da infância ${indice + 1}`
        );

        indicador.addEventListener("click", () => {
            mostrarFotoInfancia(indice);
            reiniciarCarrosselInfancia();
        });

        indicadoresInfancia.appendChild(indicador);
    });
}


// Atualiza o indicador ativo
function atualizarIndicadoresInfancia() {
    if (!indicadoresInfancia) return;

    const indicadores =
        indicadoresInfancia.querySelectorAll(".indicador-foto");

    indicadores.forEach((indicador, indice) => {
        indicador.classList.toggle(
            "ativo",
            indice === infanciaAtual
        );
    });
}


// Passa para a próxima foto
function proximaFotoInfancia() {
    const proximoIndice =
        (infanciaAtual + 1) % fotosInfancia.length;

    mostrarFotoInfancia(proximoIndice);
}


// Reinicia o tempo do carrossel
function reiniciarCarrosselInfancia() {
    clearInterval(intervaloInfancia);

    intervaloInfancia = setInterval(() => {
        proximaFotoInfancia();
    }, 5000);
}


// Inicia o carrossel da infância
if (conteudoInfancia && indicadoresInfancia) {
    criarIndicadoresInfancia();
    mostrarFotoInfancia(0);
    reiniciarCarrosselInfancia();
}
// ================================
// CARROSSEL: MEUS COMPANHEIROS
// ================================

const caminhoCompanheiros =
    "file:///C:/Users/perol/OneDrive/Documentos/outros/";

const fotosCompanheiros = [
    "foto%20cachorro2.jpg",
    "foto%20como%20meu%20cachorro.jpeg",
    "ursinho1.jpg",
    "ursinho2.jpg"
];

const conteudoCompanheiros =
    document.getElementById("conteudoCompanheiros");

const indicadoresCompanheiros =
    document.getElementById("indicadoresCompanheiros");

let companheiroAtual = 0;
let intervaloCompanheiros;


// Mostra uma foto dos companheiros
function mostrarFotoCompanheiros(indice) {
    if (!conteudoCompanheiros || fotosCompanheiros.length === 0) return;

    companheiroAtual = indice;

    const imagem = document.createElement("img");

    imagem.src =
        caminhoCompanheiros + fotosCompanheiros[companheiroAtual];

    imagem.alt = "Uma lembrança com meus companheiros";
    imagem.className = "foto-destaque";

    conteudoCompanheiros.innerHTML = "";
    conteudoCompanheiros.appendChild(imagem);

    atualizarIndicadoresCompanheiros();
}


// Cria os indicadores
function criarIndicadoresCompanheiros() {
    if (!indicadoresCompanheiros) return;

    indicadoresCompanheiros.innerHTML = "";

    fotosCompanheiros.forEach((foto, indice) => {
        const indicador = document.createElement("button");

        indicador.type = "button";
        indicador.className = "indicador-foto";

        indicador.setAttribute(
            "aria-label",
            `Mostrar foto dos companheiros ${indice + 1}`
        );

        indicador.addEventListener("click", () => {
            mostrarFotoCompanheiros(indice);
            reiniciarCarrosselCompanheiros();
        });

        indicadoresCompanheiros.appendChild(indicador);
    });
}


// Atualiza o indicador ativo
function atualizarIndicadoresCompanheiros() {
    if (!indicadoresCompanheiros) return;

    const indicadores =
        indicadoresCompanheiros.querySelectorAll(".indicador-foto");

    indicadores.forEach((indicador, indice) => {
        indicador.classList.toggle(
            "ativo",
            indice === companheiroAtual
        );
    });
}


// Passa para a próxima foto
function proximaFotoCompanheiros() {
    const proximoIndice =
        (companheiroAtual + 1) % fotosCompanheiros.length;

    mostrarFotoCompanheiros(proximoIndice);
}


// Reinicia o tempo do carrossel
function reiniciarCarrosselCompanheiros() {
    clearInterval(intervaloCompanheiros);

    intervaloCompanheiros = setInterval(() => {
        proximaFotoCompanheiros();
    }, 5000);
}


// Inicia o carrossel dos companheiros
if (conteudoCompanheiros && indicadoresCompanheiros) {
    criarIndicadoresCompanheiros();
    mostrarFotoCompanheiros(0);
    reiniciarCarrosselCompanheiros();
}


// ================================
// ✨ ESTRELINHAS SURPRESA NAS FOTOS
// ================================

const galeriasComEstrelas =
    document.querySelectorAll(".carrossel");

function criarEstrelinhas(galeria) {
    const simbolosEstrela = ["✦", "✧", "✦", "⋆", "✧"];
    const quantidadeEstrelas = 8;

    for (let i = 0; i < quantidadeEstrelas; i++) {
        const estrela = document.createElement("span");

        estrela.className = "estrelinha-surpresa";

        estrela.textContent =
            simbolosEstrela[
                Math.floor(Math.random() * simbolosEstrela.length)
            ];

        estrela.style.left = `${10 + Math.random() * 80}%`;
        estrela.style.top = `${25 + Math.random() * 50}%`;
        estrela.style.fontSize = `${12 + Math.random() * 12}px`;
        estrela.style.animationDelay = `${Math.random() * 0.35}s`;

        galeria.appendChild(estrela);

        estrela.addEventListener("animationend", () => {
            estrela.remove();
        });
    }
}


// Estrelas ao passar o mouse ou tocar
galeriasComEstrelas.forEach((galeria) => {
    galeria.addEventListener("mouseenter", () => {
        criarEstrelinhas(galeria);
    });

    galeria.addEventListener(
        "touchstart",
        () => {
            criarEstrelinhas(galeria);
        },
        { passive: true }
    );
});


// ================================
// ✨ CARTÕES APARECENDO AO DESCER
// ================================

const cartoes = document.querySelectorAll(".cartao");

if ("IntersectionObserver" in window) {
    const observadorCartoes = new IntersectionObserver(
        (entradas, observador) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("cartao-visivel");
                    observador.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    cartoes.forEach((cartao) => {
        observadorCartoes.observe(cartao);
    });
} else {
    cartoes.forEach((cartao) => {
        cartao.classList.add("cartao-visivel");
    });
}


// ================================
// 💌 MENSAGEM SECRETA DO DIÁRIO
// ================================

const botaoMensagem =
    document.getElementById("abrirMensagem");

const textoMensagem =
    document.getElementById("textoMensagem");

if (botaoMensagem && textoMensagem) {
    botaoMensagem.addEventListener("click", () => {
        const mensagemAberta = !textoMensagem.hidden;

        textoMensagem.hidden = mensagemAberta;

        botaoMensagem.setAttribute(
            "aria-expanded",
            String(!mensagemAberta)
        );
    });
}