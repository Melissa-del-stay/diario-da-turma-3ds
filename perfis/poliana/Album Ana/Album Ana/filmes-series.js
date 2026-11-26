(function () {
  const boxEstrelas = document.getElementById("estrelas");
  if (boxEstrelas) {
    for (let i = 0; i < 40; i++) {
      const e = document.createElement("div");
      e.className = "estrela";
      const tam = Math.random() * 2 + 1;
      e.style.width = `${tam}px`;
      e.style.height = `${tam}px`;
      e.style.top = `${Math.random() * 100}%`;
      e.style.left = `${Math.random() * 100}%`;
      e.style.animationDelay = `${Math.random() * 3.5}s`;
      boxEstrelas.appendChild(e);
    }
  }

  const KEY = "meu_album_filmes_series_v1";
  const padrao = {
    textos: {},
    series: ["Brooklyn Nine-Nine", "The Mentalist"],
    filmes: ["Filme 1", "Filme 2"]
  };

  let S;
  try {
    S = JSON.parse(localStorage.getItem(KEY)) || structuredClone(padrao);
  } catch (e) {
    S = structuredClone(padrao);
  }

  function salvar() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {}
  }

  const $ = id => document.getElementById(id);
  let editando = false;

  document.querySelectorAll(".ed").forEach(el => {
    const k = el.dataset.key;
    if (S.textos[k] !== undefined) el.innerHTML = S.textos[k];
    el.addEventListener("input", () => {
      S.textos[k] = el.innerHTML;
      salvar();
    });
  });

  function renderLista(idElemento, chaveArray, textoPadrao) {
    const ol = $(idElemento);
    if (!ol) return;
    ol.innerHTML = "";
    S[chaveArray].forEach((t, i) => {
      const li = document.createElement("li");
      const sp = document.createElement("span");
      sp.className = "t";
      sp.textContent = t;
      sp.contentEditable = editando;
      sp.addEventListener("input", () => {
        S[chaveArray][i] = sp.textContent;
        salvar();
      });

      const x = document.createElement("button");
      x.className = "x";
      x.textContent = "✕";
      x.onclick = () => {
        S[chaveArray].splice(i, 1);
        salvar();
        renderLista(idElemento, chaveArray, textoPadrao);
      };

      li.append(sp, x);
      ol.appendChild(li);
    });
  }

  $("addSerie").onclick = () => {
    S.series.push("Nova série");
    salvar();
    renderLista("series", "series", "Nova série");
  };

  $("addFilme").onclick = () => {
    S.filmes.push("Novo filme");
    salvar();
    renderLista("filmes", "filmes", "Novo filme");
  };

  $("btnEdit").onclick = () => {
    editando = !editando;
    document.body.classList.toggle("edit-on", editando);
    $("btnEdit").textContent = editando ? "✓ Concluir" : "✎ Editar";
    document.querySelectorAll(".ed").forEach(el => (el.contentEditable = editando));
    renderLista("series", "series", "Nova série");
    renderLista("filmes", "filmes", "Novo filme");
  };

  renderLista("series", "series", "Nova série");
  renderLista("filmes", "filmes", "Novo filme");
})();