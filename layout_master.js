/**
 * layout_master.js — fonteboa
 *
 * Centraliza TODO o comportamento do site.
 * Cada HTML de texto ou índice não precisa de nenhum <script> inline.
 * Para adicionar um item ao menu, mudar offset, mudar comportamento de scroll,
 * mudar título do cabeçalho, etc: edite APENAS este arquivo.
 */

/* ─────────────────────────────────────────
   1. CONFIGURAÇÃO GLOBAL — edite aqui
   ───────────────────────────────────────── */

const SITE = {
  // Subtítulo que aparece no cabeçalho de todas as páginas
  subtitulo: 'ficção breve de Luiz Fonte Boa, (1962- )',

  // Itens do menu principal.
  // Para adicionar um item: inclua um objeto { id, href, label } nesta lista.
  // A ordem aqui é a ordem de exibição no nav (de cima para baixo).
  menu: [
    { id: 'contos',   href: 'contos_index.html',   label: 'contos'     },
    { id: 'ensaios',  href: 'ensaios_index.html',   label: 'ensaios'    },
    { id: 'novelas',  href: 'novelas_index.html',   label: 'nouvelles'  },
    { id: 'notas',    href: 'anotacoes.html',        label: 'anotações'  },
    { id: 'inicio',   href: 'index.html',            label: 'início'     },
  ],

  // Espaço (px) entre o último item do nav e o topo da área de conteúdo
  offsetDesktop: 50,
  offsetMobile: 10,    // usado quando largura ≤ breakpointMobile
  breakpointMobile: 600,

  // Passo de scroll via teclado (px)
  scrollStep: 120,

  // Fator de escala do hero decorativo (> 1 = mais largo que a janela)
  heroScale: 1.12,
};


/* ─────────────────────────────────────────
   2. FUNÇÕES DE LAYOUT — não edite
   ───────────────────────────────────────── */

/** Redimensiona o subtítulo do cabeçalho para preencher toda a largura disponível */
function fitTitulo() {
  const el = document.getElementById('titulo');
  if (!el) return;
  el.style.fontSize = '100px';
  const pad = parseInt(getComputedStyle(document.querySelector('header')).paddingLeft) || 40;
  el.style.fontSize = (100 * (window.innerWidth - pad * 2) / el.scrollWidth) + 'px';
}

/** Redimensiona o título do texto individual se ele não couber na linha */
function fitTextTitle() {
  const el = document.getElementById('text-title');
  if (!el) return;
  el.style.fontSize = '1.8rem';
  const available = el.parentElement.offsetWidth;
  if (el.scrollWidth > available) {
    const scale = available / el.scrollWidth;
    el.style.fontSize = Math.max(0.9, 1.8 * scale) + 'rem';
  }
}

/** Redimensiona o hero decorativo de fundo */
function fitHero() {
  const el = document.getElementById('hero');
  if (!el) return;
  el.style.fontSize = '100px';
  el.style.fontSize = (100 * (window.innerWidth * SITE.heroScale) / el.scrollWidth) + 'px';
}

/** Posiciona a área de conteúdo logo abaixo do último item do nav */
function positionContentArea() {
  const nav = document.getElementById('nav-menu');
  if (!nav) return;
  const lastLink = nav.querySelector('a:last-child');
  if (!lastLink) return;
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;
  const offset = window.innerWidth <= SITE.breakpointMobile
    ? SITE.offsetMobile
    : SITE.offsetDesktop;
  contentArea.style.top = (lastLink.getBoundingClientRect().bottom + offset) + 'px';
}

/** Posiciona o fade de rodapé rente ao fundo da área de scroll */
function positionFade() {
  const scrollArea = document.querySelector('.scroll-area');
  const fade = document.getElementById('content-area-fade');
  if (!scrollArea || !fade) return;
  fade.style.top = (scrollArea.getBoundingClientRect().bottom - 80) + 'px';
}

/** Executa todos os ajustes de layout em sequência */
function refreshLayout() {
  fitTitulo();
  fitHero();
  positionContentArea();
  fitTextTitle();
  positionFade();
}


/* ─────────────────────────────────────────
   3. INJEÇÃO DE MENU — não edite
   ───────────────────────────────────────── */

/**
 * Gera e injeta o nav a partir de SITE.menu.
 * @param {string} activeId  - id do item ativo (ex: 'contos', 'ensaios', 'inicio')
 * @param {boolean} isTexto  - true quando a página é um texto individual (não um índice)
 *                             Nesse caso o item ativo exibe "índice de X"
 */
function injectMenu(activeId, isTexto = false) {
  const nav = document.getElementById('nav-menu');
  if (!nav) return;

  const labelMap = {
    contos:  'índice de contos',
    ensaios: 'índice de ensaios',
    novelas: 'índice de nouvelles',
    notas:   'índice de anotações',
  };

  nav.innerHTML = SITE.menu.map(item => {
    const isActive = item.id === activeId;
    const label = (isActive && isTexto && labelMap[item.id])
      ? labelMap[item.id]
      : item.label;
    const cls = isActive ? 'active' : (item.id === 'inicio' ? 'inicio' : '');
    return `<a href="${item.href}"${cls ? ` class="${cls}"` : ''}>${label}</a>`;
  }).join('\n');
}


/* ─────────────────────────────────────────
   4. SCROLL POR TECLADO — não edite
   ───────────────────────────────────────── */

function enableKeyboardScroll() {
  const scroller = document.getElementById('scroller');
  if (!scroller) return;
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scroller.scrollBy({ top: SITE.scrollStep, behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scroller.scrollBy({ top: -SITE.scrollStep, behavior: 'smooth' });
    }
  });
}


/* ─────────────────────────────────────────
   5. PROGRESSO DE LEITURA — bônus
   Exibe uma barra fina no topo durante a leitura.
   Não requer nenhum HTML extra nas páginas de texto.
   ───────────────────────────────────────── */

function enableReadingProgress() {
  const scroller = document.getElementById('scroller');
  if (!scroller) return;

  const bar = document.createElement('div');
  bar.id = 'reading-bar';
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px', 'width:0',
    'background:#ae3321', 'z-index:100', 'transition:width .1s linear',
    'pointer-events:none',
  ].join(';');
  document.body.appendChild(bar);

  scroller.addEventListener('scroll', () => {
    const pct = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight);
    bar.style.width = Math.min(100, pct * 100) + '%';
  });
}


/* ─────────────────────────────────────────
   6. PONTO DE ENTRADA PÚBLICO
   Chamado pelo <script> mínimo de cada página.
   ───────────────────────────────────────── */

/**
 * initLayout(activeId, tipo)
 *
 * @param {string} activeId  - qual item do menu está ativo
 *                             'contos' | 'ensaios' | 'novelas' | 'notas' | 'inicio'
 * @param {string} tipo      - 'texto' | 'indice' | 'home'
 */
function initLayout(activeId, tipo = 'texto') {
  const isTexto = tipo === 'texto';
  const isHome  = tipo === 'home';

  // Injeta subtítulo no cabeçalho (evita repetição nos HTMLs)
  const tituloEl = document.getElementById('titulo');
  if (tituloEl && !tituloEl.textContent.trim()) {
    tituloEl.textContent = SITE.subtitulo;
  }

  injectMenu(activeId, isTexto);

  document.fonts.ready.then(() => {
    refreshLayout();
    if (isTexto) {
      enableKeyboardScroll();
      enableReadingProgress();
    }
  });

  window.addEventListener('resize', refreshLayout);
}
