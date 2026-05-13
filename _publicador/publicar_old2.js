/**
 * publicar.js — fonteboa
 *
 * Lê arquivos .txt das pastas de rascunhos,
 * gera os HTMLs do site, atualiza os índices,
 * e faz commit+push para o GitHub Pages.
 *
 * Também remove automaticamente do índice qualquer
 * entrada cujo HTML correspondente não existe mais.
 *
 * Chamado pelo publicar.bat — não precisa abrir este arquivo.
 * Edite apenas a seção CONFIGURAÇÃO abaixo se necessário.
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/* ═══════════════════════════════════════════════════
   CONFIGURAÇÃO — edite se mudar nomes de pastas
   ═══════════════════════════════════════════════════ */

const CONFIG = {
  // Pasta raiz do repositório do site (onde estão os HTMLs)
  // O publicar.bat já passa este caminho automaticamente.
  siteDir: process.argv[2] || '.',

  // Pastas onde você salva seus rascunhos .txt
  // Caminho relativo à pasta deste script (publicar.js)
  rascunhos: {
    contos:  'rascunhos/contos',
    ensaios: 'rascunhos/ensaios',
    novelas: 'rascunhos/novelas',
    notas:   'rascunhos/notas',
  },

  // Arquivos de índice no site
  indices: {
    contos:  'contos_index.html',
    ensaios: 'ensaios_index.html',
    novelas: 'novelas_index.html',
    notas:   'anotacoes.html',
  },

  // Prefixo dos arquivos HTML gerados
  prefixos: {
    contos:  'conto',
    ensaios: 'ensaio',
    novelas: 'novela',
    notas:   'nota',
  },

  // Palavra decorativa de fundo (hero) em cada seção
  hero: {
    contos:  'contos',
    ensaios: 'ensaios',
    novelas: 'novelas',
    notas:   'anotações',
  },

  // Label do item ativo no menu de cada seção
  menuAtivo: {
    contos:  'contos',
    ensaios: 'ensaios',
    novelas: 'novelas',
    notas:   'notas',
  },
};

/* ═══════════════════════════════════════════════════
   FUNÇÕES AUXILIARES
   ═══════════════════════════════════════════════════ */

/** Converte título em slug para nome de arquivo */
function slugify(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);
}

/** Lê um .txt e extrai título (primeira linha) e corpo (resto) */
function lerRascunho(caminho) {
  const raw = fs.readFileSync(caminho, 'utf8').replace(/\r\n/g, '\n');
  const linhas = raw.split('\n');

  // Título: primeira linha não-vazia, sem # do markdown
  let titulo = '';
  let inicioCorpo = 0;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i].trim();
    if (l) {
      titulo = l.replace(/^#+\s*/, '');
      inicioCorpo = i + 1;
      break;
    }
  }

  // Corpo: tudo depois do título
  const corpo = linhas.slice(inicioCorpo).join('\n').trim();

  return { titulo, corpo };
}

/** Converte markdown mínimo para HTML inline */
function mdParaHtml(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/_(.+?)_/g,       '<em>$1</em>');
}

/** Gera o HTML completo de uma página de texto */
function gerarHtml(secao, titulo, corpo) {
  const corpoHtml = mdParaHtml(corpo);
  const ativo     = CONFIG.menuAtivo[secao];
  const hero      = CONFIG.hero[secao];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${titulo} — fonteboa</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet"/>
  <link href="style.css" rel="stylesheet"/>
</head>
<body>

<header><div class="titulo" id="titulo">ficção breve de Luiz Fonte Boa, (1962- )</div></header>

<nav id="nav-menu">
<a${ativo === 'contos'  ? ' class="active"' : ''} href="contos_index.html">${ativo === 'contos' ? 'índice de contos' : 'contos'}</a>
<a${ativo === 'ensaios' ? ' class="active"' : ''} href="ensaios_index.html">${ativo === 'ensaios' ? 'índice de ensaios' : 'ensaios'}</a>
<a${ativo === 'novelas' ? ' class="active"' : ''} href="novelas_index.html">${ativo === 'novelas' ? 'índice de nouvelles' : 'novelas'}</a>
<a${ativo === 'notas'   ? ' class="active"' : ''} href="anotacoes.html">${ativo === 'notas' ? 'índice de anotações' : 'anotações'}</a>
<a class="inicio" href="index.html">início</a>
</nav>

<div class="content-area" id="content-area">
  <div class="text-title" id="text-title">${titulo}</div>
  <div class="scroll-area">
    <div class="scroll-inner" id="scroller">${corpoHtml}</div>
  </div>
</div>

<div class="content-area-fade" id="content-area-fade"></div>
<div class="hero-wrap"><div class="hero-text" id="hero">${hero}</div></div>

<script src="layout_master.js"></script>
<script>initLayout('${ativo}', 'texto');</script>

</body>
</html>
`;
}

/** Insere um novo <li> no índice HTML, antes do </ul> */
function atualizarIndice(arquivoIndice, href, titulo) {
  let html = fs.readFileSync(arquivoIndice, 'utf8');

  // Verifica se o link já existe (evita duplicatas)
  if (html.includes(`href="${href}"`)) {
    return false; // já publicado
  }

  const novoItem = `<li><a href="${href}">${titulo}</a></li>`;
  html = html.replace('</ul>', `${novoItem}\n</ul>`);
  fs.writeFileSync(arquivoIndice, html, 'utf8');
  return true;
}

/**
 * Remove do índice todas as entradas cujo arquivo HTML
 * não existe mais em siteDir. Retorna quantas foram removidas.
 */
function limparIndice(arquivoIndice, siteDir) {
  if (!fs.existsSync(arquivoIndice)) return 0;

  let html = fs.readFileSync(arquivoIndice, 'utf8');
  const original = html;

  // Encontra todos os href dentro de <li><a href="...">
  const regex = /<li><a href="([^"]+)">[^<]*<\/a><\/li>/g;
  let match;
  let removidos = 0;

  while ((match = regex.exec(original)) !== null) {
    const href     = match[1];
    const linha    = match[0];
    const destHtml = path.join(siteDir, href);

    if (!fs.existsSync(destHtml)) {
      html = html.replace(linha + '\n', '').replace(linha, '');
      console.log(`    – removido do índice: "${href}" (arquivo não existe)`);
      removidos++;
    }
  }

  if (removidos > 0) {
    fs.writeFileSync(arquivoIndice, html, 'utf8');
  }

  return removidos;
}

/* ═══════════════════════════════════════════════════
   EXECUÇÃO PRINCIPAL
   ═══════════════════════════════════════════════════ */

const siteDir   = path.resolve(CONFIG.siteDir);
const scriptDir = path.dirname(path.resolve(process.argv[1] || __filename));

let totalNovos    = 0;
let totalRemovidos = 0;
const erros = [];

console.log('\n══════════════════════════════════════');
console.log('  fonteboa — publicador');
console.log('══════════════════════════════════════\n');

// ── Passo 1: limpa entradas órfãs de todos os índices ──
for (const [secao, nomeIndice] of Object.entries(CONFIG.indices)) {
  const arquivoIndice = path.join(siteDir, nomeIndice);
  totalRemovidos += limparIndice(arquivoIndice, siteDir);
}

// ── Passo 2: publica textos novos ──
for (const [secao, pastaTxt] of Object.entries(CONFIG.rascunhos)) {
  const pastaAbsoluta = path.resolve(scriptDir, pastaTxt);

  if (!fs.existsSync(pastaAbsoluta)) {
    console.log(`  [aviso] Pasta não encontrada: ${pastaAbsoluta}`);
    continue;
  }

  const txts = fs.readdirSync(pastaAbsoluta)
    .filter(f => f.endsWith('.txt'));

  if (txts.length === 0) continue;

  console.log(`  Seção: ${secao} (${txts.length} arquivo(s))`);

  for (const nomeArquivo of txts) {
    const caminhoTxt = path.join(pastaAbsoluta, nomeArquivo);

    try {
      const { titulo, corpo } = lerRascunho(caminhoTxt);

      if (!titulo) {
        erros.push(`${nomeArquivo}: sem título (primeira linha vazia)`);
        continue;
      }

      const slug      = slugify(titulo);
      const prefixo   = CONFIG.prefixos[secao];
      const nomeHtml  = `${prefixo}-${slug}.html`;
      const destHtml  = path.join(siteDir, nomeHtml);
      const indice    = path.join(siteDir, CONFIG.indices[secao]);

      // Gera o HTML do texto
      const html = gerarHtml(secao, titulo, corpo);
      fs.writeFileSync(destHtml, html, 'utf8');

      // Atualiza o índice
      const adicionado = atualizarIndice(indice, nomeHtml, titulo);

      if (adicionado) {
        console.log(`    ✓ "${titulo}" → ${nomeHtml}`);
        totalNovos++;

        // Move o .txt para subpasta "publicados" (evita republicar)
        const pastaPublicados = path.join(pastaAbsoluta, 'publicados');
        if (!fs.existsSync(pastaPublicados)) fs.mkdirSync(pastaPublicados);
        fs.renameSync(caminhoTxt, path.join(pastaPublicados, nomeArquivo));
      } else {
        console.log(`    – "${titulo}" já publicado, ignorado.`);
      }

    } catch (e) {
      erros.push(`${nomeArquivo}: ${e.message}`);
    }
  }
}

// Erros
if (erros.length > 0) {
  console.log('\n  [erros]');
  erros.forEach(e => console.log(`    ! ${e}`));
}

// Git commit + push
const totalAlteracoes = totalNovos + totalRemovidos;

if (totalAlteracoes > 0) {
  const partes = [];
  if (totalNovos > 0)     partes.push(`${totalNovos} novo(s)`);
  if (totalRemovidos > 0) partes.push(`${totalRemovidos} removido(s)`);
  const msg = `publica: ${partes.join(', ')}`;

  console.log(`\n  Enviando alterações para o GitHub...`);
  try {
    process.chdir(siteDir);
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });;
    console.log('\n  ✓ Publicado com sucesso no GitHub Pages!');
    console.log('  O texto estará no ar em cerca de 1 minuto.\n');
  } catch (e) {
    console.log('\n  [ERRO no envio ao GitHub]');
    console.log('  Verifique sua conexão e se o repositório está configurado.');
    console.log('  Detalhes: ' + e.message);
  }
} else if (erros.length === 0) {
  console.log('\n  Nenhuma alteração encontrada.\n');
}
