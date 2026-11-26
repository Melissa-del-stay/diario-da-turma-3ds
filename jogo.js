
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTOS DA TELA
    // ========================================

    const capaJogos = document.querySelector(".capa-jogos");
    const areaJogo = document.getElementById("areaJogo");
    const conteudoJogo = document.getElementById("conteudoJogo");

    const botaoCacaPalavras = document.getElementById("abrirCacaPalavras");
    const botaoQuiz = document.getElementById("abrirQuiz");
    const botaoVoltar = document.getElementById("voltarJogos");

    // ========================================
    // PALAVRAS E SIGNIFICADOS
    // ========================================

    const palavras = [
        { palavra: "POLENGUINHO", significado: "Alê, a criança da sala." },
        { palavra: "TRIBUNAL", significado: "O grupo de patetas da sala (os meninos)." },
        { palavra: "PEROLAGACHA", significado: "Um e-mail antigo de 2015." },
        { palavra: "MALMAL", significado: "Apelido do Mauricio." },
        { palavra: "CAPS", significado: "A sala em si já é o CAPS." },
        { palavra: "HENRIQUE", significado: "O farmador de aura." },
        { palavra: "LUTADORAFORTE", significado: "Um usuário com nome esquisito no Roblox." },
        { palavra: "CAFE", significado: "João Vitor." },
        { palavra: "LEITE", significado: "João Gabriel." },
        { palavra: "BOLINHA", significado: "Ex-mascote da sala." }
    ];

    // ========================================
    // CONFIGURAÇÕES DO CAÇA-PALAVRAS
    // ========================================

    const tamanhoGrade = 13;

    const direcoes = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1]
    ];

    let grade = [];
    let palavrasEncontradas = [];
    let celulasSelecionadas = [];
    let selecionando = false;
    let ponteiroAtivo = null;

    const chaveMoedas = "diario3ds_moedas";
    const chaveRecompensa = "diario3ds_caca_completo";

    // ========================================
    // SISTEMA DE MOEDAS
    // ========================================

    function consultarMoedas() {
        return Number(localStorage.getItem(chaveMoedas)) || 0;
    }

    function adicionarMoedas(quantidade) {
        const novoSaldo = consultarMoedas() + quantidade;

        localStorage.setItem(chaveMoedas, novoSaldo);

        atualizarSaldo();
    }

    function atualizarSaldo() {
        const saldo = document.getElementById("saldoMoedas");

        if (saldo) {
            saldo.textContent = consultarMoedas();
        }
    }

    // ========================================
    // ABRIR E FECHAR JOGOS
    // ========================================

    function abrirJogo(nome) {

        capaJogos.style.display = "none";
        areaJogo.classList.add("aberta");

        if (nome === "caca-palavras") {
            mostrarCacaPalavras();
        }

        if (nome === "quiz") {
            mostrarQuiz();
        }
    }

    function voltarParaJogos() {

        areaJogo.classList.remove("aberta");
        capaJogos.style.display = "flex";

        conteudoJogo.innerHTML = "";
    }

    // ========================================
    // CRIAR GRADE VAZIA
    // ========================================

    function criarGradeVazia() {

        return Array.from(
            { length: tamanhoGrade },
            () => Array(tamanhoGrade).fill("")
        );
    }

    // ========================================
    // POSICIONAR PALAVRAS
    // ========================================

    function posicionarPalavra(palavra) {

        for (let tentativa = 0; tentativa < 1000; tentativa++) {

            const [linhaDirecao, colunaDirecao] =
                direcoes[Math.floor(Math.random() * direcoes.length)];

            const linhaInicial = Math.floor(Math.random() * tamanhoGrade);
            const colunaInicial = Math.floor(Math.random() * tamanhoGrade);

            const linhaFinal =
                linhaInicial + (palavra.length - 1) * linhaDirecao;

            const colunaFinal =
                colunaInicial + (palavra.length - 1) * colunaDirecao;

            if (
                linhaFinal < 0 ||
                linhaFinal >= tamanhoGrade ||
                colunaFinal < 0 ||
                colunaFinal >= tamanhoGrade
            ) {
                continue;
            }

            let podeColocar = true;

            for (let i = 0; i < palavra.length; i++) {

                const linha = linhaInicial + i * linhaDirecao;
                const coluna = colunaInicial + i * colunaDirecao;

                const letraAtual = grade[linha][coluna];

                if (letraAtual !== "" && letraAtual !== palavra[i]) {
                    podeColocar = false;
                    break;
                }
            }

            if (!podeColocar) continue;

            for (let i = 0; i < palavra.length; i++) {

                const linha = linhaInicial + i * linhaDirecao;
                const coluna = colunaInicial + i * colunaDirecao;

                grade[linha][coluna] = palavra[i];
            }

            return true;
        }

        return false;
    }

    // ========================================
    // COMPLETAR GRADE COM LETRAS ALEATÓRIAS
    // ========================================

    function preencherGrade() {

        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let linha = 0; linha < tamanhoGrade; linha++) {

            for (let coluna = 0; coluna < tamanhoGrade; coluna++) {

                if (grade[linha][coluna] === "") {

                    grade[linha][coluna] =
                        letras[Math.floor(Math.random() * letras.length)];
                }
            }
        }
    }

    // ========================================
    // GERAR CAÇA-PALAVRAS
    // ========================================

    function gerarCacaPalavras() {

        const palavrasOrdenadas = [...palavras]
            .sort((a, b) => b.palavra.length - a.palavra.length);

        let gerouGrade = false;

        for (let tentativa = 0; tentativa < 100; tentativa++) {

            grade = criarGradeVazia();

            let todasPosicionadas = true;

            for (const item of palavrasOrdenadas) {

                if (!posicionarPalavra(item.palavra)) {
                    todasPosicionadas = false;
                    break;
                }
            }

            if (todasPosicionadas) {
                preencherGrade();
                gerouGrade = true;
                break;
            }
        }

        if (!gerouGrade) {
            console.error("Não foi possível gerar o caça-palavras.");
        }
    }

    // ========================================
    // MOSTRAR CAÇA-PALAVRAS
    // ========================================

    function mostrarCacaPalavras() {

        palavrasEncontradas = [];
        celulasSelecionadas = [];
        selecionando = false;
        ponteiroAtivo = null;

        gerarCacaPalavras();

        conteudoJogo.innerHTML = `
            <div class="cabecalho-caca">

                <div>
                    <h2>Caça-palavras da turma</h2>
                    <p>
                        Atenção: as palavras podem estar em qualquer direção!
                    </p>
                </div>

                <div class="moedas-jogo">
                    <span>🪙</span>
                    <strong id="saldoMoedas">${consultarMoedas()}</strong>
                </div>

            </div>

            <div class="progresso-caca">

                <p id="progressoTexto">
                    0 de ${palavras.length} palavras encontradas
                </p>

                <div class="barra-progresso">
                    <div id="barraPreenchida"></div>
                </div>

            </div>

            <div class="layout-caca">

                <div class="grade-caca" id="gradeCaca"></div>

                <div class="painel-caca">

                    <h3>Palavras para encontrar</h3>

                    <div class="lista-palavras" id="listaPalavras"></div>

                    <h3 class="titulo-significados">
                        Significados encontrados
                    </h3>

                    <div id="significados" class="significados">
                        <p>
                            Encontre uma palavra para descobrir seu significado!
                        </p>
                    </div>

                </div>

            </div>

            <div id="mensagemFinal" class="mensagem-final"></div>
        `;

        criarElementosGrade();
        criarListaPalavras();
        atualizarProgresso();
    }

    // ========================================
    // DESENHAR GRADE
    // ========================================

    function criarElementosGrade() {

        const elementoGrade = document.getElementById("gradeCaca");

        elementoGrade.innerHTML = "";

        for (let linha = 0; linha < tamanhoGrade; linha++) {

            for (let coluna = 0; coluna < tamanhoGrade; coluna++) {

                const celula = document.createElement("button");

                celula.type = "button";
                celula.className = "letra-caca";
                celula.textContent = grade[linha][coluna];

                celula.dataset.linha = linha;
                celula.dataset.coluna = coluna;

                elementoGrade.appendChild(celula);
            }
        }

        elementoGrade.addEventListener("pointerdown", iniciarSelecao);
        elementoGrade.addEventListener("pointermove", continuarSelecao);
        elementoGrade.addEventListener("pointerup", finalizarSelecao);
        elementoGrade.addEventListener("pointercancel", cancelarSelecao);
    }

    // ========================================
    // LISTA DE PALAVRAS
    // ========================================

    function criarListaPalavras() {

        const lista = document.getElementById("listaPalavras");

        lista.innerHTML = "";

        palavras.forEach(item => {

            const elemento = document.createElement("div");

            elemento.className = "palavra-pendente";
            elemento.id = `palavra-${item.palavra}`;

            elemento.textContent = item.palavra;

            lista.appendChild(elemento);
        });
    }

    // ========================================
    // OBTER CÉLULA PELO PONTEIRO
    // ========================================

    function obterCelula(evento) {

        const elemento = document.elementFromPoint(
            evento.clientX,
            evento.clientY
        );

        if (!elemento || !elemento.classList.contains("letra-caca")) {
            return null;
        }

        return elemento;
    }

    // ========================================
    // INICIAR SELEÇÃO
    // ========================================

    function iniciarSelecao(evento) {

        if (evento.pointerType === "mouse" && evento.button !== 0) {
            return;
        }

        const celula = obterCelula(evento);

        if (!celula) return;

        selecionando = true;
        ponteiroAtivo = evento.pointerId;
        celulasSelecionadas = [celula];

        const elementoGrade = document.getElementById("gradeCaca");

        if (elementoGrade.setPointerCapture) {
            elementoGrade.setPointerCapture(evento.pointerId);
        }

        marcarSelecao();

        evento.preventDefault();
    }

    // ========================================
    // CONTINUAR SELEÇÃO
    // ========================================

    function continuarSelecao(evento) {

        if (!selecionando || evento.pointerId !== ponteiroAtivo) {
            return;
        }

        const celula = obterCelula(evento);

        if (!celula) return;

        const primeira = celulasSelecionadas[0];

        const linhaInicial = Number(primeira.dataset.linha);
        const colunaInicial = Number(primeira.dataset.coluna);

        const linhaFinal = Number(celula.dataset.linha);
        const colunaFinal = Number(celula.dataset.coluna);

        const diferencaLinha = linhaFinal - linhaInicial;
        const diferencaColuna = colunaFinal - colunaInicial;

        const distancia = Math.max(
            Math.abs(diferencaLinha),
            Math.abs(diferencaColuna)
        );

        if (distancia === 0) return;

        const alinhada =
            diferencaLinha === 0 ||
            diferencaColuna === 0 ||
            Math.abs(diferencaLinha) === Math.abs(diferencaColuna);

        if (!alinhada) return;

        const passoLinha = Math.sign(diferencaLinha);
        const passoColuna = Math.sign(diferencaColuna);

        celulasSelecionadas = [];

        for (let i = 0; i <= distancia; i++) {

            const linha = linhaInicial + i * passoLinha;
            const coluna = colunaInicial + i * passoColuna;

            const elemento = document.querySelector(
                `.letra-caca[data-linha="${linha}"][data-coluna="${coluna}"]`
            );

            if (elemento) {
                celulasSelecionadas.push(elemento);
            }
        }

        marcarSelecao();
    }

    // ========================================
    // MARCAR SELEÇÃO
    // ========================================

    function marcarSelecao() {

        document.querySelectorAll(".letra-caca.selecionada")
            .forEach(celula => {
                celula.classList.remove("selecionada");
            });

        celulasSelecionadas.forEach(celula => {

            if (!celula.classList.contains("encontrada")) {
                celula.classList.add("selecionada");
            }
        });
    }

    // ========================================
    // CANCELAR SELEÇÃO
    // ========================================

    function cancelarSelecao() {

        selecionando = false;
        ponteiroAtivo = null;
        celulasSelecionadas = [];

        marcarSelecao();
    }

    // ========================================
    // FINALIZAR SELEÇÃO
    // ========================================

    function finalizarSelecao(evento) {

        if (!selecionando || evento.pointerId !== ponteiroAtivo) {
            return;
        }

        selecionando = false;
        ponteiroAtivo = null;

        const palavraSelecionada = celulasSelecionadas
            .map(celula => celula.textContent)
            .join("");

        const palavraInvertida = palavraSelecionada
            .split("")
            .reverse()
            .join("");

        const encontrada = palavras.find(item =>
            item.palavra === palavraSelecionada ||
            item.palavra === palavraInvertida
        );

        if (
            encontrada &&
            !palavrasEncontradas.includes(encontrada.palavra)
        ) {
            registrarPalavra(encontrada);
        }

        celulasSelecionadas = [];

        marcarSelecao();
    }

    // ========================================
    // REGISTRAR PALAVRA ENCONTRADA
    // ========================================

    function registrarPalavra(item) {

        palavrasEncontradas.push(item.palavra);

        const elementoPalavra = document.getElementById(
            `palavra-${item.palavra}`
        );

        if (elementoPalavra) {
            elementoPalavra.classList.remove("palavra-pendente");
            elementoPalavra.classList.add("palavra-encontrada");
        }

        celulasSelecionadas.forEach(celula => {

            celula.classList.remove("selecionada");
            celula.classList.add("encontrada");
        });

        mostrarSignificado(item);
        atualizarProgresso();

        if (palavrasEncontradas.length === palavras.length) {
            finalizarJogo();
        }
    }

    // ========================================
    // MOSTRAR SIGNIFICADO
    // ========================================

    function mostrarSignificado(item) {

        const painel = document.getElementById("significados");

        if (palavrasEncontradas.length === 1) {
            painel.innerHTML = "";
        }

        const significado = document.createElement("div");

        significado.className = "significado-item";

        const titulo = document.createElement("strong");
        titulo.textContent = item.palavra;

        const descricao = document.createElement("p");
        descricao.textContent = item.significado;

        significado.appendChild(titulo);
        significado.appendChild(descricao);

        painel.appendChild(significado);
    }

    // ========================================
    // ATUALIZAR PROGRESSO
    // ========================================

    function atualizarProgresso() {

        const quantidade = palavrasEncontradas.length;

        const texto = document.getElementById("progressoTexto");
        const barra = document.getElementById("barraPreenchida");

        if (texto) {
            texto.textContent =
                `${quantidade} de ${palavras.length} palavras encontradas`;
        }

        if (barra) {
            barra.style.width =
                `${(quantidade / palavras.length) * 100}%`;
        }
    }

    // ========================================
    // FINALIZAR CAÇA-PALAVRAS
    // ========================================

    function finalizarJogo() {

        const mensagem = document.getElementById("mensagemFinal");

        const jaRecebeuRecompensa =
            localStorage.getItem(chaveRecompensa) === "sim";

        if (!jaRecebeuRecompensa) {
            adicionarMoedas(20);
            localStorage.setItem(chaveRecompensa, "sim");
        }

        mensagem.innerHTML = `
            <div class="texto-vitoria">
                <h3>Parabéns! Você encontrou todas as palavras!</h3>

                ${jaRecebeuRecompensa
                ? "<p>Você já recebeu sua recompensa!</p>"
                : "<p>Você ganhou 20 moedas! 🪙</p>"
            }
            </div>

            <button type="button" id="jogarNovamente">
                ↻ Jogar novamente
            </button>
        `;

        const botaoReiniciar = document.getElementById("jogarNovamente");

        botaoReiniciar.addEventListener("click", () => {
            mostrarCacaPalavras();
        });

        setTimeout(() => {

            const textoVitoria = mensagem.querySelector(".texto-vitoria");

            if (textoVitoria) {
                textoVitoria.remove();
            }

        }, 5000);
    }

    // ========================================
    // QUIZ DA TURMA
    // ========================================

    function mostrarQuiz() {

        const perguntasQuiz = [
            {
                pergunta: "Qual foi o principal motivo que fez os alunos temerem pelo futuro da turma em 2025?",
                alternativas: [
                    { texto: "Mudança de escola" },
                    { texto: "Saída de alunos e divisão da turma", correta: true },
                    { texto: "Mudança de curso" },
                    { texto: "Falta de material" }
                ]
            },
            {
                pergunta: "O que as montagens feitas por inteligência artificial representavam no diário?",
                alternativas: [
                    { texto: "Uma previsão de como seria a turma no futuro" },
                    { texto: "Uma forma divertida de imaginar a turma em situações e cenários diferentes", correta: true },
                    { texto: "Uma atividade obrigatória do curso" },
                    { texto: "Uma homenagem aos professores" }
                ]
            },
            {
                pergunta: "O que mudou na dinâmica da turma quando chegou 2026?",
                alternativas: [
                    { texto: "A turma ficou maior e mais dividida" },
                    { texto: "A turma ficou menor, mais unida e teve aulas mais práticas", correta: true },
                    { texto: "Todos mudaram de curso" },
                    { texto: "A turma deixou de fazer atividades práticas" }
                ]
            },
            {
                pergunta: "Qual professor teve papel importante na aproximação dos alunos?",
                alternativas: [
                    { texto: "Marta" },
                    { texto: "Ellen" },
                    { texto: "Taís" },
                    { texto: "Henrique", correta: true }
                ]
            },
            {
                pergunta: "Qual era o nome do mascote feito com uma bola de pingue-pongue?",
                alternativas: [
                    { texto: "Bolinha", correta: true },
                    { texto: "Pelota" },
                    { texto: "Pingo" },
                    { texto: "Bola 3DS" }
                ]
            },
            {
                pergunta: "Quem ficou associado ao episódio que marcou o fim do Bolinha?",
                alternativas: [
                    { texto: "Henrique" },
                    { texto: "Maycon", correta: true },
                    { texto: "Alê" },
                    { texto: "Tribunal" }
                ]
            },
            {
                pergunta: "O que foi feito para homenagear o Bolinha depois do ocorrido?",
                alternativas: [
                    { texto: "Uma festa" },
                    { texto: "Uma exposição" },
                    { texto: "Um vídeo de funeral", correta: true },
                    { texto: "Uma votação" }
                ]
            },
            {
                pergunta: "Quem era considerado o professor mais querido da sala?",
                alternativas: [
                    { texto: "Marta" },
                    { texto: "Ellen" },
                    { texto: "Taís" },
                    { texto: "Todos os professores" },
                    { texto: "Henrique", correta: true }
                ]
            },
            {
                pergunta: "Quem era a Polenguinho?",
                alternativas: [
                    { texto: "Tainá" },
                    { texto: "Ana" },
                    { texto: "Poli" },
                    { texto: "Alê", correta: true }
                ]
            },
            {
                pergunta: "Qual era o curso da turma quando ela ainda era chamada de 2DS?",
                alternativas: [
                    { texto: "Desenvolvimento de Jogos" },
                    { texto: "Análise de Dados" },
                    { texto: "Desenvolvimento de Sistemas", correta: true },
                    { texto: "Redes de Computadores" }
                ]
            },
            {
                pergunta: "Qual acontecimento marcou uma das mudanças mais importantes da turma?",
                alternativas: [
                    { texto: "A passagem para o terceirão", correta: true },
                    { texto: "A troca de escola" },
                    { texto: "A criação de outra turma" },
                    { texto: "A mudança de professores" }
                ]
            },
            {
                pergunta: "O que mais contribuiu para a aproximação da turma em 2026?",
                alternativas: [
                    { texto: "Apenas as avaliações" },
                    { texto: "A convivência, os professores e as experiências compartilhadas", correta: true },
                    { texto: "A separação dos grupos" },
                    { texto: "A diminuição das aulas práticas" }
                ]
            },
            {
                pergunta: "Qual objeto representa diretamente uma das lembranças mais inusitadas da turma?",
                alternativas: [
                    { texto: "Uma bola de futebol" },
                    { texto: "Uma bola de pingue-pongue", correta: true },
                    { texto: "Um troféu" },
                    { texto: "Um livro" }
                ]
            },
            {
                pergunta: "Qual alternativa descreve melhor a trajetória da turma?",
                alternativas: [
                    { texto: "Uma turma que permaneceu igual durante todo o curso" },
                    { texto: "Uma turma que começou com incertezas e construiu uma convivência mais unida", correta: true },
                    { texto: "Uma turma que não passou por mudanças" },
                    { texto: "Uma turma que deixou de compartilhar experiências" }
                ]
            },
            {
                pergunta: "Qual é a ideia central da história registrada no diário?",
                alternativas: [
                    { texto: "Registrar somente as notas e avaliações" },
                    { texto: "Mostrar apenas os eventos escolares" },
                    { texto: "Preservar experiências, mudanças, brincadeiras e memórias da turma", correta: true },
                    { texto: "Contar a história de apenas um aluno" }
                ]
            }
        ];

        // ========================================
        // EMBARALHAR PERGUNTAS E ALTERNATIVAS
        // ========================================

        function embaralhar(lista) {

            const copia = [...lista];

            for (let i = copia.length - 1; i > 0; i--) {

                const j = Math.floor(Math.random() * (i + 1));

                [copia[i], copia[j]] = [copia[j], copia[i]];
            }

            return copia;
        }

        const perguntas = embaralhar(perguntasQuiz).map(item => ({
            ...item,
            alternativas: embaralhar(item.alternativas)
        }));

        // ========================================
        // VARIÁVEIS DO QUIZ
        // ========================================

        let perguntaAtual = 0;
        let pontuacao = 0;
        let respondida = false;

        // ========================================
        // MOSTRAR PERGUNTA
        // ========================================

        function exibirPergunta() {

            respondida = false;

            const pergunta = perguntas[perguntaAtual];

            conteudoJogo.innerHTML = `
                <div class="quiz-container">

                    <div class="cabecalho-quiz">
                        <div>
                            <h2>Quiz da turma</h2>
                            <p>Será que você conhece mesmo o nosso 3DS?</p>
                        </div>

                        <div class="pontuacao-quiz">
                            <span>Pontuação</span>
                            <strong>${pontuacao} / 150</strong>
                        </div>
                    </div>

                    <div class="progresso-quiz">
                        <span>Pergunta ${perguntaAtual + 1} de 15</span>

                        <div class="barra-progresso">
                            <div style="width: ${((perguntaAtual + 1) / 15) * 100}%"></div>
                        </div>
                    </div>

                    <div class="pergunta-quiz">

                        <span class="numero-questao">
                            QUESTÃO ${String(perguntaAtual + 1).padStart(2, "0")}
                        </span>

                        <h3>${pergunta.pergunta}</h3>

                        <div class="alternativas-quiz">

                            ${pergunta.alternativas.map((alternativa, indice) => `
                                <button
                                    type="button"
                                    class="alternativa-quiz"
                                    data-indice="${indice}"
                                >
                                    <span>${String.fromCharCode(65 + indice)}</span>
                                    ${alternativa.texto}
                                </button>
                            `).join("")}

                        </div>

                        <p id="feedbackQuiz" class="feedback-quiz"></p>

                        <button
                            type="button"
                            id="proximaPergunta"
                            class="botao-proxima-quiz"
                            hidden
                        >
                            Próxima pergunta →
                        </button>

                    </div>

                </div>
            `;

            document.querySelectorAll(".alternativa-quiz").forEach(botao => {
                botao.addEventListener("click", () => responderPergunta(botao));
            });
        }

        // ========================================
        // RESPONDER PERGUNTA
        // ========================================

        function responderPergunta(botaoSelecionado) {

            if (respondida) return;

            respondida = true;

            const indice = Number(botaoSelecionado.dataset.indice);
            const pergunta = perguntas[perguntaAtual];
            const alternativaEscolhida = pergunta.alternativas[indice];

            const feedback = document.getElementById("feedbackQuiz");

            const alternativas = document.querySelectorAll(".alternativa-quiz");

            alternativas.forEach((botao, indiceBotao) => {

                botao.disabled = true;

                const alternativa = pergunta.alternativas[indiceBotao];

                if (alternativa.correta) {
                    botao.classList.add("resposta-correta");
                }

                if (
                    botao === botaoSelecionado &&
                    !alternativaEscolhida.correta
                ) {
                    botao.classList.add("resposta-errada");
                }
            });

            if (alternativaEscolhida.correta) {

                pontuacao += 10;

                feedback.textContent = "Muito bem! Você acertou! +10 pontos";
                feedback.className = "feedback-quiz acertou";

            } else {

                feedback.textContent =
                    "Não foi dessa vez! A resposta correta está destacada.";

                feedback.className = "feedback-quiz errou";
            }

            const botaoProxima = document.getElementById("proximaPergunta");

            botaoProxima.hidden = false;

            botaoProxima.textContent =
                perguntaAtual === 14 ? "Ver resultado →" : "Próxima pergunta →";

            botaoProxima.addEventListener("click", avancarPergunta);
        }

        // ========================================
        // AVANÇAR PERGUNTA
        // ========================================

        function avancarPergunta() {

            perguntaAtual++;

            if (perguntaAtual < perguntas.length) {
                exibirPergunta();
            } else {
                mostrarResultado();
            }
        }

        // ========================================
        // RESULTADO FINAL
        // ========================================

        function mostrarResultado() {

            let mensagem = "";

            if (pontuacao === 150) {
                mensagem = "Conhece a turma de olhos fechados!";
            } else if (pontuacao >= 110) {
                mensagem = "Mandou muito bem!";
            } else if (pontuacao >= 70) {
                mensagem = "Conhece bastante coisa!";
            } else {
                mensagem = "Precisa rever o diário!";
            }

            conteudoJogo.innerHTML = `
                <div class="resultado-quiz">

                    <span class="etiqueta-resultado">QUIZ FINALIZADO</span>

                    <div class="icone-resultado">🏆</div>

                    <h2>Fim de jogo!</h2>

                    <p class="mensagem-resultado">${mensagem}</p>

                    <div class="pontuacao-final">
                        <strong>${pontuacao}</strong>
                        <span>de 150 pontos</span>
                    </div>

                    <p class="acertos-resultado">
                        Você acertou ${pontuacao / 10} de 15 perguntas.
                    </p>

                    <button type="button" id="reiniciarQuiz">
                        Jogar novamente
                    </button>

                </div>
            `;

            document.getElementById("reiniciarQuiz")
                .addEventListener("click", mostrarQuiz);
        }

        // ========================================
        // INICIAR QUIZ
        // ========================================

        exibirPergunta();
    }

    // ========================================
    // LIGAÇÃO DOS BOTÕES
    // ========================================

    botaoCacaPalavras.addEventListener("click", () => {
        abrirJogo("caca-palavras");
    });

    botaoQuiz.addEventListener("click", () => {
        abrirJogo("quiz");
    });

    botaoVoltar.addEventListener("click", voltarParaJogos);

});
