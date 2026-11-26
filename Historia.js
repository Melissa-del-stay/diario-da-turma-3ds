
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // NAVEGAÇÃO ENTRE AS PÁGINAS
    // ========================================

    const paginas = document.querySelectorAll(".pagina");
    const botaoAnterior = document.getElementById("paginaAnterior");
    const botaoProxima = document.getElementById("proximaPagina");
    const indicador = document.getElementById("indicadorPagina");

    const nomesPaginas = [
        "Capa",
        "Introdução",
        "Capítulo 01 • 2025",
        "Terceirão • Obras de IA — Parte 1",
        "Terceirão • Obras de IA — Parte 2",
        "Terceirão • Café e projetos"
    ];

    if (!paginas.length || !botaoAnterior || !botaoProxima || !indicador) {
        console.error("Erro: não encontrei todos os elementos do livro.");
        return;
    }

    let paginaAtual = 0;
    let animando = false;

    // ========================================
    // ATUALIZAR INDICADOR
    // ========================================

    function atualizarBotoes() {

        botaoAnterior.disabled = false;
        botaoProxima.disabled = false;

        indicador.textContent =
            nomesPaginas[paginaAtual] || `Página ${paginaAtual + 1}`;
    }

    // ========================================
    // ANIMAÇÃO DE ENTRADA
    // ========================================

    function revelarPagina(pagina) {

        pagina.classList.remove("revelando");

        void pagina.offsetWidth;

        pagina.classList.add("revelando");

        setTimeout(() => {
            pagina.classList.remove("revelando");
        }, 900);
    }

    // ========================================
    // VOLTAR PARA O DIÁRIO
    // ========================================

    function voltarParaDiario() {

        if (animando) return;

        animando = true;

        const pagina = paginas[paginaAtual];

        pagina.classList.add("saindo-para-diario");

        setTimeout(() => {
            window.location.href = "Diario.html";
        }, 650);
    }

    // ========================================
    // AVANÇAR PARA FOTOS
    // ========================================
function irParaFotos() {

    if (animando) return;

    animando = true;

    const pagina = paginas[paginaAtual];

    pagina.classList.add("saindo-para-fotos");

    setTimeout(() => {
        window.location.href = "Fotos.html";
    }, 350);
}
    // ========================================
    // VIRAR PÁGINAS
    // ========================================

    function mostrarPagina(indice, direcao) {

        if (animando) return;

        // Antes da primeira página, volta para o Diário.
        if (indice < 0) {
            voltarParaDiario();
            return;
        }

        // Depois da última página, vai para Fotos.
        if (indice >= paginas.length) {
            irParaFotos();
            return;
        }

        animando = true;

        const paginaAtualElemento = paginas[paginaAtual];
        const proximaPaginaElemento = paginas[indice];

        proximaPaginaElemento.style.display = "block";

        proximaPaginaElemento.classList.remove("ativa");
        proximaPaginaElemento.classList.add("preparando");

        revelarPagina(proximaPaginaElemento);

        paginaAtualElemento.classList.add(
            direcao === 1 ? "virando-frente" : "virando-volta"
        );

        setTimeout(() => {

            paginaAtualElemento.classList.remove(
                "ativa",
                "virando-frente",
                "virando-volta"
            );

            paginaAtualElemento.style.display = "none";

            proximaPaginaElemento.classList.remove("preparando");
            proximaPaginaElemento.classList.add("ativa");

            paginaAtual = indice;

            atualizarBotoes();

            animando = false;

        }, 650);
    }

    // ========================================
    // EVENTOS DAS SETAS
    // ========================================

    botaoProxima.addEventListener("click", () => {

        mostrarPagina(paginaAtual + 1, 1);

    });

    botaoAnterior.addEventListener("click", () => {

        mostrarPagina(paginaAtual - 1, -1);

    });

    // ========================================
    // PREPARAÇÃO INICIAL DO LIVRO
    // ========================================

    paginas.forEach((pagina, indice) => {

        pagina.classList.remove(
            "ativa",
            "preparando",
            "revelando",
            "virando-frente",
            "virando-volta",
            "saindo-para-diario",
            "saindo-para-fotos"
        );

        pagina.style.display = indice === 0 ? "block" : "none";

    });

    paginas[0].classList.add("ativa");

    revelarPagina(paginas[0]);

    atualizarBotoes();


    // ========================================
    // VISUALIZADOR DE FOTOS
    // ========================================

    const imagens = Array.from(
        document.querySelectorAll(".galeria-memoria img")
    );

    const visualizador = document.getElementById("visualizadorFotos");
    const imagemAmpliada = document.getElementById("imagemAmpliada");
    const contadorFotos = document.getElementById("contadorFotos");

    const fecharVisualizador = document.getElementById("fecharVisualizador");
    const fotoAnterior = document.getElementById("fotoAnterior");
    const proximaFoto = document.getElementById("proximaFoto");

    let fotoAtual = 0;

    if (
        visualizador &&
        imagemAmpliada &&
        contadorFotos &&
        fecharVisualizador &&
        fotoAnterior &&
        proximaFoto
    ) {

        // Mostrar foto ampliada.
        function mostrarFoto(indice) {

            if (!imagens.length) return;

            fotoAtual = (indice + imagens.length) % imagens.length;

            const foto = imagens[fotoAtual];

            imagemAmpliada.src = foto.src;
            imagemAmpliada.alt = foto.alt;

            contadorFotos.textContent =
                `${fotoAtual + 1} / ${imagens.length}`;
        }

        // Abrir visualizador.
        function abrirVisualizador(indice) {

            mostrarFoto(indice);

            visualizador.classList.add("aberto");

            visualizador.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";
        }

        // Fechar visualizador.
        function fecharModal() {

            visualizador.classList.remove("aberto");

            visualizador.setAttribute("aria-hidden", "true");

            document.body.style.overflow = "";
        }

        // Clique nas imagens.
        imagens.forEach((imagem, indice) => {

            imagem.addEventListener("click", () => {
                abrirVisualizador(indice);
            });

        });

        // Fechar.
        fecharVisualizador.addEventListener("click", fecharModal);

        // Foto anterior.
        fotoAnterior.addEventListener("click", () => {
            mostrarFoto(fotoAtual - 1);
        });

        // Próxima foto.
        proximaFoto.addEventListener("click", () => {
            mostrarFoto(fotoAtual + 1);
        });

        // Clique no fundo fecha.
        visualizador.addEventListener("click", (evento) => {

            if (evento.target === visualizador) {
                fecharModal();
            }

        });

        // Teclado.
        document.addEventListener("keydown", (evento) => {

            if (!visualizador.classList.contains("aberto")) return;

            if (evento.key === "Escape") {
                fecharModal();
            }

            if (evento.key === "ArrowLeft") {
                mostrarFoto(fotoAtual - 1);
            }

            if (evento.key === "ArrowRight") {
                mostrarFoto(fotoAtual + 1);
            }

        });

    }

});