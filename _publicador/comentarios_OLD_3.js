/**
 * comentarios.js — fonteboa
 *
 * Janela flutuante de comentários por página.
 * Comentários guardados localmente (localStorage).
 * Arrasto pela barra de título, redimensionável,
 * nunca maximizável.
 */

(function () {
  const LIMITE = 280;

  /* ── Cria a estrutura HTML da janela ───────────── */
  function criarJanela() {
    // Botão disparador
    const btn = document.createElement('button');
    btn.id = 'btn-comentar';
    btn.textContent = 'Quero comentar';
    document.body.appendChild(btn);

    // Janela
    const janela = document.createElement('div');
    janela.id = 'janela-comentarios';
    janela.innerHTML = `
      <div id="janela-titulo">
        Comentários dos leitores
        <button id="janela-fechar" title="Fechar">✕</button>
      </div>
      <div id="janela-corpo">
        <input
          id="campo-nome"
          type="text"
          placeholder="Nome"
          maxlength="80"
          autocomplete="off"
        />
        <textarea
          id="campo-comentario"
          placeholder="Comentário"
          maxlength="${LIMITE}"
        ></textarea>
        <div id="contador-chars">0 / ${LIMITE}</div>
        <button id="btn-publicar">Publicar</button>
      </div>
      <div id="lista-comentarios"></div>
    `;
    document.body.appendChild(janela);
  }

  /* ── Chave única por página ────────────────────── */
  function chaveStorage() {
    const p = window.location.pathname.split('/').pop() || 'index';
    return 'comentarios:' + p;
  }

  /* ── Carrega comentários do localStorage ───────── */
  function carregarComentarios() {
    try {
      return JSON.parse(localStorage.getItem(chaveStorage()) || '[]');
    } catch (e) {
      return [];
    }
  }

  /* ── Salva comentários no localStorage ─────────── */
  function salvarComentarios(lista) {
    localStorage.setItem(chaveStorage(), JSON.stringify(lista));
  }

  /* ── Renderiza a lista de comentários ──────────── */
  function renderizarLista() {
    const lista = carregarComentarios();
    const el = document.getElementById('lista-comentarios');
    if (!el) return;

    if (lista.length === 0) {
      el.innerHTML = '<p class="sem-comentarios">Nenhum comentário ainda.</p>';
      return;
    }

    el.innerHTML = lista.map((c, i) => `
      ${i > 0 ? '<div class="comentario-divisor"></div>' : ''}
      <div class="comentario-item">
        <span class="comentario-autor">${escapar(c.nome)}</span>
        <span class="comentario-texto">${escapar(c.texto)}</span>
      </div>
    `).join('');
  }

  /* ── Escapa HTML para segurança ────────────────── */
  function escapar(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Lógica de arrastar a janela ───────────────── */
  function habilitarArrastar(janela, alca) {
    let ox = 0, oy = 0, mx = 0, my = 0;

    alca.addEventListener('mousedown', (e) => {
      e.preventDefault();
      mx = e.clientX;
      my = e.clientY;
      document.addEventListener('mousemove', mover);
      document.addEventListener('mouseup', soltar);
    });

    function mover(e) {
      ox = mx - e.clientX;
      oy = my - e.clientY;
      mx = e.clientX;
      my = e.clientY;

      let novoTop  = janela.offsetTop  - oy;
      let novoLeft = janela.offsetLeft - ox;

      // Limita dentro da viewport
      novoTop  = Math.max(0, Math.min(novoTop,  window.innerHeight - 60));
      novoLeft = Math.max(0, Math.min(novoLeft, window.innerWidth  - 60));

      janela.style.top    = novoTop  + 'px';
      janela.style.left   = novoLeft + 'px';
      janela.style.bottom = 'auto';
      janela.style.right  = 'auto';
    }

    function soltar() {
      document.removeEventListener('mousemove', mover);
      document.removeEventListener('mouseup',   soltar);
    }

    // Touch (mobile)
    alca.addEventListener('touchstart', (e) => {
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;
    }, { passive: true });

    alca.addEventListener('touchmove', (e) => {
      ox = mx - e.touches[0].clientX;
      oy = my - e.touches[0].clientY;
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;

      let novoTop  = janela.offsetTop  - oy;
      let novoLeft = janela.offsetLeft - ox;
      novoTop  = Math.max(0, Math.min(novoTop,  window.innerHeight - 60));
      novoLeft = Math.max(0, Math.min(novoLeft, window.innerWidth  - 60));

      janela.style.top    = novoTop  + 'px';
      janela.style.left   = novoLeft + 'px';
      janela.style.bottom = 'auto';
      janela.style.right  = 'auto';
      e.preventDefault();
    }, { passive: false });
  }

  /* ── Inicialização ─────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    criarJanela();

    const janela   = document.getElementById('janela-comentarios');
    const btnAbrir = document.getElementById('btn-comentar');
    const btnFechar= document.getElementById('janela-fechar');
    const btnPublicar = document.getElementById('btn-publicar');
    const campoNome = document.getElementById('campo-nome');
    const campoCom  = document.getElementById('campo-comentario');
    const contador  = document.getElementById('contador-chars');
    const alca      = document.getElementById('janela-titulo');

    habilitarArrastar(janela, alca);
    renderizarLista();

    // Abre/fecha
    btnAbrir.addEventListener('click', () => {
      janela.classList.toggle('visivel');
    });

    btnFechar.addEventListener('click', () => {
      janela.classList.remove('visivel');
    });

    // Contador de caracteres
    campoCom.addEventListener('input', () => {
      const n = campoCom.value.length;
      contador.textContent = n + ' / ' + LIMITE;
      contador.classList.toggle('quase', n >= LIMITE - 30);
    });

    // Limpa erro ao digitar
    campoNome.addEventListener('input', () => {
      campoNome.classList.remove('erro');
      campoNome.placeholder = 'Nome';
    });
    campoCom.addEventListener('input', () => {
      campoCom.classList.remove('erro');
      campoCom.placeholder = 'Comentário';
    });

    // Publicar
    btnPublicar.addEventListener('click', () => {
      const nome  = campoNome.value.trim();
      const texto = campoCom.value.trim();
      let erro = false;

      if (!nome) {
        campoNome.classList.add('erro');
        campoNome.value = '';
        campoNome.placeholder = 'Adicite aqui com seu nome';
        erro = true;
      }
      if (!texto) {
        campoCom.classList.add('erro');
        campoCom.value = '';
        campoCom.placeholder = 'Digite aqui seu comentário';
        erro = true;
      }
      if (erro) return;

      const lista = carregarComentarios();
      lista.push({ nome, texto });
      salvarComentarios(lista);

      campoNome.value = '';
      campoCom.value  = '';
      contador.textContent = '0 / ' + LIMITE;
      renderizarLista();
    });
  });
})();
