
/* ========================================
   JOGOS — NOSSO DIÁRIO 3DS
======================================== */

// BOTÕES

const botaoCacaPalavras = document.getElementById("botaoCacaPalavras");
const botaoQuiz = document.getElementById("botaoQuiz");

// CAÇA-PALAVRAS

botaoCacaPalavras.addEventListener("click", () => {
    window.location.href = "CacaPalavras.html";
});

// QUIZ DA TURMA

botaoQuiz.addEventListener("click", () => {
    window.location.href = "Quiz.html";
});
