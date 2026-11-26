
/* ========================================
   FOTOS E VÍDEOS — NOSSO DIÁRIO 3DS
======================================== */

// ========================================
// ELEMENTOS DO HTML
// ========================================

const gradeFotos = document.getElementById("gradeFotos");

const paginaAnterior = document.getElementById("paginaAnterior");
const proximaPagina = document.getElementById("proximaPagina");
const indicadorPagina = document.getElementById("indicadorPagina");

const visualizador = document.getElementById("visualizador");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharFoto = document.getElementById("fecharFoto");
const fotoAnterior = document.getElementById("fotoAnterior");
const fotoProxima = document.getElementById("fotoProxima");

const etiqueta = document.querySelector(".etiqueta");
const titulo = document.querySelector(".cabecalho h1");
const descricao = document.querySelector(".cabecalho p");
const controles = document.querySelector(".controles");

// ========================================
// CONFIGURAÇÕES
// ========================================

const itensPorPagina = 6;

let paginaAtual = 0;
let fotoAtual = 0;
let indiceVideoAtual = 0;
let animacaoEmAndamento = false;
let videoAmpliado = null;

const duracaoSaida = 200;
const duracaoEntrada = 1050;

// ========================================
// FOTOGRAFIAS
// ========================================

const fotos = [
    { src: "imagens/imagem1.jpeg", alt: "Memória 1" },
    { src: "imagens/imagem2.jpeg", alt: "Memória 2" },
    { src: "imagens/imagem3.jpg", alt: "Memória 3" },
    { src: "imagens/imagem4.jpg", alt: "Memória 4" },
    { src: "imagens/imagem5.jpg", alt: "Memória 5" },
    { src: "imagens/imagem6.jpg", alt: "Memória 6" }
];

// ========================================
// VÍDEOS
// ========================================

const videos = [
    {
        src: "imagens/video1.mp4",
        formato: "horizontal",
        alt: "Vídeo 1 da turma"
    },
    {
        src: "imagens/video2.mp4",
        formato: "vertical",
        alt: "Vídeo 2 da turma"
    },
    {
        src: "imagens/video3.mp4",
        formato: "horizontal",
        alt: "Vídeo 3 da turma"
    },
    {
        src: "imagens/video4.mp4",
        formato: "horizontal",
        alt: "Vídeo 4 da turma"
    },
    {
        src: "imagens/video5.mp4",
        formato: "horizontal",
        alt: "Vídeo 5 da turma"
    },
    {
        src: "imagens/video6.mp4",
        formato: "horizontal",
        alt: "Vídeo 6 da turma"
    }
];

// ========================================
// OBSERVADOR DOS VÍDEOS
// ========================================

const observadorVideos = new IntersectionObserver((entradas) => {

    entradas.forEach((entrada) => {

        const video = entrada.target;

        if (entrada.isIntersecting && !document.hidden) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }

    });

}, {
    threshold: 0.35
});

// ========================================
// MOSTRAR CONTEÚDO
// ========================================

function mostrarConteudo() {

    gradeFotos.innerHTML = "";

    if (paginaAtual === 0) {
        mostrarFotos();
    } else {
        mostrarVideos();
    }

    atualizarControles();

}

// ========================================
// MOSTRAR FOTOGRAFIAS
// ========================================

function mostrarFotos() {

    titulo.textContent = "Nossas Memórias";
    descricao.textContent = "Momentos que merecem ser lembrados.";

    fotos.forEach((foto, indice) => {

        const botao = document.createElement("button");

        botao.className = "foto-item";
        botao.type = "button";
        botao.setAttribute("aria-label", `Ampliar ${foto.alt}`);

        const imagem = document.createElement("img");

        imagem.src = foto.src;
        imagem.alt = foto.alt;
        imagem.loading = "lazy";

        imagem.addEventListener("error", () => {
            botao.classList.add("imagem-indisponivel");
            botao.setAttribute("aria-label", "Imagem não encontrada");
        });

        botao.appendChild(imagem);

        botao.addEventListener("click", () => {
            abrirFoto(indice);
        });

        gradeFotos.appendChild(botao);

    });

}

// ========================================
// MOSTRAR VÍDEOS
// ========================================

function mostrarVideos() {

    titulo.textContent = "Vídeos da Turma";
    descricao.textContent = "Momentos que ganharam vida.";

    videos.forEach((item, indice) => {

        const quadro = document.createElement("article");

        quadro.className = `foto-item video-item ${item.formato}`;

        const video = document.createElement("video");

        video.src = item.src;
        video.className = "video-memoria";
        video.muted = true;
        video.defaultMuted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.setAttribute("aria-label", item.alt);

        // Dois cliques no computador ampliam o vídeo.
        video.addEventListener("dblclick", (evento) => {
            evento.preventDefault();
            abrirVideo(video);
        });

        // Um toque em telas sensíveis ao toque amplia o vídeo.
        video.addEventListener("click", () => {

            if (window.matchMedia("(pointer: coarse)").matches) {
                abrirVideo(video);
            }

        });

        // Botão para ativar ou silenciar o áudio.
        const botaoSom = document.createElement("button");

        botaoSom.type = "button";
        botaoSom.className = "botao-som";
        botaoSom.textContent = "Ativar som";
        botaoSom.setAttribute("aria-label", `Ativar som do vídeo ${indice + 1}`);

        botaoSom.addEventListener("click", async () => {

            video.muted = !video.muted;

            if (!video.muted) {

                try {
                    await video.play();

                    botaoSom.textContent = "Silenciar";
                    botaoSom.setAttribute(
                        "aria-label",
                        `Silenciar vídeo ${indice + 1}`
                    );

                } catch {

                    video.muted = true;
                    botaoSom.textContent = "Ativar som";

                }

            } else {

                botaoSom.textContent = "Ativar som";
                botaoSom.setAttribute(
                    "aria-label",
                    `Ativar som do vídeo ${indice + 1}`
                );

            }

        });

        video.addEventListener("error", () => {
            quadro.classList.add("video-indisponivel");
        });

        quadro.append(video, botaoSom);

        gradeFotos.appendChild(quadro);

        observadorVideos.observe(video);

    });

}

// ========================================
// CONTROLES DE PÁGINA
// ========================================

function atualizarControles() {

    paginaAnterior.disabled = paginaAtual === 0;
    proximaPagina.disabled = paginaAtual === 1;

    indicadorPagina.textContent =
        `Página ${String(paginaAtual + 1).padStart(2, "0")} / 02`;

}

// ========================================
// ANIMAÇÃO DE ENTRADA
// ========================================

function animarEntrada() {

    const elementos = [
        etiqueta,
        titulo,
        descricao,
        ...gradeFotos.children,
        controles
    ];

    elementos.forEach((elemento, indice) => {

        elemento.classList.remove("subindo-aparecendo");

        elemento.style.animationDelay = `${indice * 70}ms`;

        void elemento.offsetWidth;

        elemento.classList.add("subindo-aparecendo");

    });

    setTimeout(() => {

        elementos.forEach((elemento) => {
            elemento.classList.remove("subindo-aparecendo");
            elemento.style.animationDelay = "";
        });

        animacaoEmAndamento = false;

    }, duracaoEntrada);

}

// ========================================
// ANIMAÇÃO DE SAÍDA
// ========================================

function animarSaida() {

    const elementos = [
        etiqueta,
        titulo,
        descricao,
        ...gradeFotos.children,
        controles
    ];

    elementos.forEach((elemento) => {
        elemento.classList.add("saindo-subindo");
    });

}

// ========================================
// LIMPAR ANIMAÇÕES
// ========================================

function limparAnimacoes() {

    const elementos = [
        etiqueta,
        titulo,
        descricao,
        ...gradeFotos.children,
        controles
    ];

    elementos.forEach((elemento) => {

        elemento.classList.remove(
            "saindo-subindo",
            "subindo-aparecendo"
        );

        elemento.style.animationDelay = "";

    });

}

// ========================================
// PAUSAR VÍDEOS
// ========================================

function pausarVideos() {

    gradeFotos.querySelectorAll("video").forEach((video) => {
        video.pause();
    });

}

// ========================================
// VIRAR PÁGINA
// ========================================

function virarPagina(direcao) {

    if (animacaoEmAndamento) return;

    const novaPagina = paginaAtual + direcao;

    if (novaPagina < 0 || novaPagina > 1) return;

    animacaoEmAndamento = true;

    animarSaida();

    setTimeout(() => {

        pausarVideos();

        observadorVideos.disconnect();

        limparAnimacoes();

        paginaAtual = novaPagina;

        mostrarConteudo();

        animarEntrada();

    }, duracaoSaida);

}

paginaAnterior.addEventListener("click", () => {
    virarPagina(-1);
});

proximaPagina.addEventListener("click", () => {
    virarPagina(1);
});

// ========================================
// ABRIR VÍDEO AMPLIADO
// ========================================

function abrirVideo(videoOriginal) {

    if (videoAmpliado) return;

    indiceVideoAtual = videos.findIndex(
        item => item.src === videoOriginal.getAttribute("src")
    );

    if (indiceVideoAtual < 0) return;

    videoOriginal.pause();

    criarVideoAmpliado();

    visualizador.classList.add("aberto", "visualizador-video");

}

// ========================================
// CRIAR VÍDEO AMPLIADO
// ========================================

function criarVideoAmpliado() {

    fecharVideoAmpliado();

    const item = videos[indiceVideoAtual];

    if (!item) return;

    const videoOriginal =
        gradeFotos.querySelectorAll(".video-memoria")[indiceVideoAtual];

    videoAmpliado = document.createElement("video");

    videoAmpliado.className = "video-ampliado";
    videoAmpliado.src = item.src;
    videoAmpliado.controls = true;
    videoAmpliado.autoplay = true;
    videoAmpliado.loop = true;
    videoAmpliado.playsInline = true;
    videoAmpliado.muted = videoOriginal ? videoOriginal.muted : true;
    videoAmpliado.preload = "auto";

    videoAmpliado.addEventListener("loadedmetadata", () => {

        if (videoOriginal) {
            try {
                videoAmpliado.currentTime = videoOriginal.currentTime;
            } catch {}
        }

        videoAmpliado.play().catch(() => {});

    }, { once: true });

    visualizador.appendChild(videoAmpliado);

}

// ========================================
// TROCAR VÍDEO AMPLIADO
// ========================================

function mudarVideoAmpliado(direcao) {

    if (!videoAmpliado) return;

    const novoIndice = indiceVideoAtual + direcao;

    if (novoIndice < 0 || novoIndice >= videos.length) return;

    indiceVideoAtual = novoIndice;

    criarVideoAmpliado();

}

// ========================================
// FECHAR VÍDEO AMPLIADO
// ========================================

function fecharVideoAmpliado() {

    if (videoAmpliado) {

        videoAmpliado.pause();
        videoAmpliado.removeAttribute("src");
        videoAmpliado.load();
        videoAmpliado.remove();

        videoAmpliado = null;

    }

    visualizador.classList.remove("visualizador-video");

}

// ========================================
// VISUALIZADOR DE FOTOGRAFIAS
// ========================================

function abrirFoto(indice) {

    if (!fotos[indice]) return;

    fecharVideoAmpliado();

    fotoAtual = indice;

    fotoAmpliada.src = fotos[indice].src;
    fotoAmpliada.alt = fotos[indice].alt;

    visualizador.classList.remove("visualizador-video");
    visualizador.classList.add("aberto");

}

// ========================================
// FECHAR VISUALIZADOR
// ========================================

function fecharVisualizador() {

    fecharVideoAmpliado();

    visualizador.classList.remove("aberto");

    fotoAmpliada.src = "";

    if (paginaAtual === 1) {

        gradeFotos.querySelectorAll(".video-memoria").forEach((video) => {
            observadorVideos.observe(video);
        });

    }

}

fecharFoto.addEventListener("click", fecharVisualizador);

visualizador.addEventListener("click", (evento) => {

    if (evento.target === visualizador) {
        fecharVisualizador();
    }

});

// ========================================
// SETAS: FOTOS OU VÍDEOS
// ========================================

fotoAnterior.addEventListener("click", () => {

    if (visualizador.classList.contains("visualizador-video")) {
        mudarVideoAmpliado(-1);
    } else {
        mudarFoto(-1);
    }

});

fotoProxima.addEventListener("click", () => {

    if (visualizador.classList.contains("visualizador-video")) {
        mudarVideoAmpliado(1);
    } else {
        mudarFoto(1);
    }

});

// ========================================
// TROCAR FOTOGRAFIA AMPLIADA
// ========================================

function mudarFoto(direcao) {

    const novoIndice = fotoAtual + direcao;

    if (novoIndice < 0 || novoIndice >= fotos.length) {
        return;
    }

    abrirFoto(novoIndice);

}

// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", (evento) => {

    if (!visualizador.classList.contains("aberto")) return;

    if (evento.key === "Escape") {
        fecharVisualizador();
        return;
    }

    if (visualizador.classList.contains("visualizador-video")) {

        if (evento.key === "ArrowLeft") {
            mudarVideoAmpliado(-1);
        }

        if (evento.key === "ArrowRight") {
            mudarVideoAmpliado(1);
        }

        return;
    }

    if (evento.key === "ArrowLeft") {
        mudarFoto(-1);
    }

    if (evento.key === "ArrowRight") {
        mudarFoto(1);
    }

});

// ========================================
// VISIBILIDADE DA ABA
// ========================================

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        pausarVideos();

        if (videoAmpliado) {
            videoAmpliado.pause();
        }

    } else if (paginaAtual === 1 && !videoAmpliado) {

        gradeFotos.querySelectorAll(".video-memoria").forEach((video) => {
            observadorVideos.observe(video);
        });

    }

});

// ========================================
// INICIALIZAÇÃO
// ========================================

mostrarConteudo();

animacaoEmAndamento = true;

animarEntrada();
