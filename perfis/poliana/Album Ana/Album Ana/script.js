(function () {
  // Abertura: começa com esperando.png e, ao clicar, muda a frase e troca para acessou.png antes de abrir
  const abertura = document.getElementById("abertura");
  const btnAcessar = document.getElementById("btnAcessar");
  const bonequinhaImg = document.getElementById("bonequinhaImg");
  const passeFrase = document.getElementById("passeFrase");

  const imgEsperando = "esperando.png";
  const imgAcessou = "acessou.png";

  let clicouAcessar = false;

  if (bonequinhaImg) {
    bonequinhaImg.addEventListener("error", () => {
      bonequinhaImg.style.display = "none";
    });
  }

  if (abertura && btnAcessar) {
    btnAcessar.addEventListener("click", () => {
      if (clicouAcessar) return;
      clicouAcessar = true;

      if (passeFrase) {
        passeFrase.textContent = "Fechado então, bora dar uma olhada.";
      }

      if (bonequinhaImg && bonequinhaImg.style.display !== "none") {
        bonequinhaImg.classList.add("trocando");
        setTimeout(() => {
          bonequinhaImg.src = imgAcessou;
          bonequinhaImg.alt = "Bonequinha após acessar o álbum";
          bonequinhaImg.classList.remove("trocando");
          bonequinhaImg.classList.add("fazendo-paz");
        }, 140);
      }

      setTimeout(() => {
        abertura.classList.add("sair");
      }, 780);
    });
  }

  // Estrelas suaves no fundo
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

  // Esconde qualquer adesivo cuja imagem ainda não foi carregada
  document.querySelectorAll(".adesivo-item img").forEach(img => {
    img.addEventListener("error", () => {
      img.parentElement.style.display = "none";
    });
  });

  /* ---------- banco IndexedDB para vídeos ---------- */
  const DB_NAME = "meu_album_midia_db";
  const STORE_NAME = "videos";
  const PREFIXO_DB = "idb:";
  const urlsTemporarias = new Map();

  function abrirDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB não suportado"));
        return;
      }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function salvarVideoNoDB(idVideo, blobOuFile) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(blobOuFile, idVideo);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function pegarVideoDoDB(idVideo) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(idVideo);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function apagarVideoDoDB(idVideo) {
    try {
      const db = await abrirDB();
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(idVideo);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (e) {}
  }

  function ehReferenciaVideoDB(src) {
    return typeof src === "string" && src.startsWith(PREFIXO_DB);
  }

  function ehVideo(src) {
    if (!src) return false;
    return (
      ehReferenciaVideoDB(src) ||
      src.startsWith("data:video/") ||
      src.startsWith("blob:") ||
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src)
    );
  }

  async function resolverSrcMidia(src) {
    if (!ehReferenciaVideoDB(src)) return src;
    const idVideo = src.slice(PREFIXO_DB.length);
    if (urlsTemporarias.has(idVideo)) {
      return urlsTemporarias.get(idVideo);
    }
    const blob = await pegarVideoDoDB(idVideo);
    if (!blob) return "";
    const url = URL.createObjectURL(blob);
    urlsTemporarias.set(idVideo, url);
    return url;
  }

  const KEY = "meu_album_v1";
  const padrao = {
    textos: {},
    songs: ["Música 1 — Artista", "Música 2 — Artista", "Música 3 — Artista"],
    hobbies: ["Motos & velocidade", "Estrelas à noite", "Ouvir de tudo"],
    cor: "#1e3a8a",
    polas: [
      { img: "", leg: "legenda 1" },
      { img: "", leg: "legenda 2" },
      { img: "", leg: "legenda 3" },
      { img: "", leg: "legenda 4" }
    ],
    filmesSeriesFotos: [
      { img: "", leg: "filme ou série 1" },
      { img: "", leg: "filme ou série 2" },
      { img: "", leg: "filme ou série 3" }
    ]
  };

  let S;
  try {
    S = JSON.parse(localStorage.getItem(KEY)) || structuredClone(padrao);
  } catch (e) {
    S = structuredClone(padrao);
  }

  if (!Array.isArray(S.filmesSeriesFotos)) {
    S.filmesSeriesFotos = structuredClone(padrao.filmesSeriesFotos);
  }

  function salvar() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
      alert("Sem espaço para salvar. Use fotos menores ou remova alguma.");
    }
  }

  const $ = id => document.getElementById(id);
  let editando = false;

  /* ---------- textos simples ---------- */
  document.querySelectorAll(".ed").forEach(el => {
    const k = el.dataset.key;
    if (S.textos[k] !== undefined) el.innerHTML = S.textos[k];
    el.addEventListener("input", () => {
      S.textos[k] = el.innerHTML;
      salvar();
    });
  });

  /* ---------- músicas ---------- */
  function renderSongs() {
    const ol = $("songs");
    if (!ol) return;
    ol.innerHTML = "";
    S.songs.forEach((t, i) => {
      const li = document.createElement("li");
      const sp = document.createElement("span");
      sp.className = "t";
      sp.textContent = t;
      sp.contentEditable = editando;
      sp.addEventListener("input", () => {
        S.songs[i] = sp.textContent;
        salvar();
      });

      const x = document.createElement("button");
      x.className = "x";
      x.textContent = "✕";
      x.onclick = () => {
        S.songs.splice(i, 1);
        salvar();
        renderSongs();
      };

      li.append(sp, x);
      ol.appendChild(li);
    });
  }
  if ($("addSong")) {
    $("addSong").onclick = () => {
      S.songs.push("Nova música — Artista");
      salvar();
      renderSongs();
    };
  }

  /* ---------- hobbies ---------- */
  function renderHobbies() {
    const box = $("hobbies");
    if (!box) return;
    box.innerHTML = "";
    S.hobbies.forEach((t, i) => {
      const c = document.createElement("div");
      c.className = "chip";
      const sp = document.createElement("span");
      sp.textContent = t;
      sp.contentEditable = editando;
      sp.addEventListener("input", () => {
        S.hobbies[i] = sp.textContent;
        salvar();
      });

      const x = document.createElement("button");
      x.className = "x";
      x.textContent = "✕";
      x.onclick = () => {
        S.hobbies.splice(i, 1);
        salvar();
        renderHobbies();
      };

      c.append(sp, x);
      box.appendChild(c);
    });
  }
  if ($("addHobby")) {
    $("addHobby").onclick = () => {
      S.hobbies.push("novo hobby");
      salvar();
      renderHobbies();
    };
  }

  /* ---------- cor ---------- */
  function aplicarCor() {
    document.documentElement.style.setProperty("--cor-fav", S.cor);
    if ($("corPicker")) $("corPicker").value = S.cor;
  }
  if ($("corPicker")) {
    $("corPicker").addEventListener("input", e => {
      S.cor = e.target.value;
      aplicarCor();
      salvar();
    });
  }

  /* ---------- imagens, vídeos + modal ---------- */
  function reduzir(file, cb) {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 700;
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = img.width * s;
        c.height = img.height * s;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  async function processarMidia(file, cb) {
    if (file.type && file.type.startsWith("video/")) {
      const idVideo = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      await salvarVideoNoDB(idVideo, file);
      const urlTemp = URL.createObjectURL(file);
      urlsTemporarias.set(idVideo, urlTemp);
      cb(`${PREFIXO_DB}${idVideo}`);
      return;
    }
    reduzir(file, cb);
  }

  function criarElementoMidia(src) {
    if (ehVideo(src)) {
      const vid = document.createElement("video");
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      resolverSrcMidia(src).then(urlResolvida => {
        if (urlResolvida) {
          vid.src = urlResolvida;
          vid.play().catch(() => {});
        }
      });
      return vid;
    }
    const im = document.createElement("img");
    im.src = src;
    im.alt = "";
    return im;
  }

  const polaModal = $("polaModal");
  const polaModalImg = $("polaModalImg");
  const polaModalVid = $("polaModalVid");
  const polaModalLeg = $("polaModalLeg");
  const polaModalClose = $("polaModalClose");

  async function abrirModalFoto(item) {
    if (!item.img || !polaModal) return;
    polaModalLeg.textContent = item.leg || "";

    if (ehVideo(item.img) && polaModalVid) {
      polaModalImg.style.display = "none";
      polaModalImg.src = "";
      polaModalVid.style.display = "block";
      const urlResolvida = await resolverSrcMidia(item.img);
      if (urlResolvida) {
        polaModalVid.src = urlResolvida;
        polaModalVid.play().catch(() => {});
      }
    } else {
      if (polaModalVid) {
        polaModalVid.pause();
        polaModalVid.removeAttribute("src");
        polaModalVid.style.display = "none";
      }
      polaModalImg.style.display = "block";
      polaModalImg.src = item.img;
    }

    polaModal.classList.add("aberto");
    polaModal.setAttribute("aria-hidden", "false");
  }

  function fecharModalFoto() {
    if (!polaModal) return;
    polaModal.classList.remove("aberto");
    polaModal.setAttribute("aria-hidden", "true");
    polaModalImg.src = "";
    if (polaModalVid) {
      polaModalVid.pause();
      polaModalVid.removeAttribute("src");
      polaModalVid.style.display = "none";
    }
  }

  if (polaModalClose) polaModalClose.onclick = fecharModalFoto;
  if (polaModal) {
    polaModal.addEventListener("click", e => {
      if (e.target === polaModal) fecharModalFoto();
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") fecharModalFoto();
  });

  function classeTemaPolaroid(legenda, index) {
    const txt = (legenda || "").toLowerCase();
    if (txt.includes("eu") || index === 0) return "pola-eu";
    if (txt.includes("cachorro") || txt.includes("arranque") || index === 1) return "pola-dog";
    if (txt.includes("noite") || txt.includes("vó") || txt.includes("vo") || index === 2) return "pola-noite";
    if (txt.includes("role") || txt.includes("rolê") || txt.includes("crianças") || index === 3) return "pola-role";
    if (txt.includes("opala") || txt.includes("tio") || index === 4) return "pola-opala";
    return "";
  }

  function renderCardsFotos(idContainer, chaveArray, textoRemover, usarTemaPola = false) {
    const box = $(idContainer);
    if (!box) return;
    box.innerHTML = "";
    S[chaveArray].forEach((p, i) => {
      const d = document.createElement("div");
      const tema = usarTemaPola ? classeTemaPolaroid(p.leg, i) : "";
      d.className = tema ? `pola ${tema}` : "pola";

      const f = document.createElement("div");
      f.className = "foto";
      if (p.img) {
        f.appendChild(criarElementoMidia(p.img));
      } else {
        f.textContent = editando ? "clique para adicionar foto ou vídeo" : "sem mídia";
      }

      f.onclick = () => {
        if (editando) {
          const inp = document.createElement("input");
          inp.type = "file";
          inp.accept = "image/*,video/*";
          inp.onchange = async () => {
            if (inp.files[0]) {
              if (ehReferenciaVideoDB(p.img)) {
                await apagarVideoDoDB(p.img.slice(PREFIXO_DB.length));
              }
              await processarMidia(inp.files[0], url => {
                p.img = url;
                salvar();
                renderCardsFotos(idContainer, chaveArray, textoRemover, usarTemaPola);
              });
            }
          };
          inp.click();
        } else if (p.img) {
          abrirModalFoto(p);
        }
      };

      const l = document.createElement("div");
      l.className = "legenda";
      l.textContent = p.leg;
      l.contentEditable = editando;
      l.addEventListener("input", () => {
        p.leg = l.textContent;
        if (usarTemaPola) {
          const novaClasse = classeTemaPolaroid(p.leg, i);
          d.className = novaClasse ? `pola ${novaClasse}` : "pola";
        }
        salvar();
      });

      const rm = document.createElement("button");
      rm.className = "rm";
      rm.textContent = textoRemover;
      rm.onclick = async () => {
        const removido = S[chaveArray][i];
        if (removido && ehReferenciaVideoDB(removido.img)) {
          await apagarVideoDoDB(removido.img.slice(PREFIXO_DB.length));
        }
        S[chaveArray].splice(i, 1);
        salvar();
        renderCardsFotos(idContainer, chaveArray, textoRemover, usarTemaPola);
      };

      d.append(f, l, rm);
      box.appendChild(d);
    });
  }

  function renderPolas() {
    renderCardsFotos("polas", "polas", "remover polaroid", true);
  }

  function renderFilmesSeriesFotos() {
    renderCardsFotos("filmesSeriesFotos", "filmesSeriesFotos", "remover", false);
  }

  if ($("addPola")) {
    $("addPola").onclick = () => {
      S.polas.push({ img: "", leg: "nova legenda" });
      salvar();
      renderPolas();
    };
  }

  if ($("addFilmeSerieFoto")) {
    $("addFilmeSerieFoto").onclick = () => {
      S.filmesSeriesFotos.push({ img: "", leg: "novo filme ou série" });
      salvar();
      renderFilmesSeriesFotos();
    };
  }

  /* ---------- modo edição ---------- */
  if ($("btnEdit")) {
    $("btnEdit").onclick = () => {
      editando = !editando;
      document.body.classList.toggle("edit-on", editando);
      $("btnEdit").textContent = editando ? "✓ Concluir" : "✎ Editar";
      document.querySelectorAll(".ed").forEach(el => (el.contentEditable = editando));
      renderSongs();
      renderHobbies();
      renderPolas();
      renderFilmesSeriesFotos();
    };
  }

  aplicarCor();
  renderSongs();
  renderHobbies();
  renderPolas();
  renderFilmesSeriesFotos();
})();