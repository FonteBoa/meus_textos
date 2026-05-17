/**
 * 8-ADICIONAR-COMENTARIOS.js — fonteboa
 * Adiciona referências ao comentarios.css e comentarios.js
 * em todos os HTMLs de texto que ainda não as têm.
 * Ignora índices, templates e páginas estruturais.
 */

const fs   = require('fs');
const path = require('path');

const siteDir = process.argv[2] || '.';

/* ── Arquivos a ignorar ──────────────────────────── */
const ignorar = [
  'index.html',
  'contos_index.html',
  'ensaios_index.html',
  'cronicas_index.html',
  'notas_index.html',
  'nouvelles_index.html',
  'novelas_index.html',
  'anotacoes.html',
  'comentarios.html',
  'conto-template.html',
  'ensaio-template.html',
  'cronica-template.html',
  'novela-template.html',
  'nova-template.html',
  'nota-template.html',
  'contos_index-template.html',
  'cronica_index.html',
  'cronica-_index.html',
];

/* ── Linhas a acrescentar ────────────────────────── */
const linkCSS    = '<link href="comentarios.css" rel="stylesheet"/>';
const scriptJS   = '<script src="comentarios.js"></script>';

const arquivos = fs.readdirSync(siteDir)
  .filter(f => f.endsWith('.html') && !ignorar.includes(f));

let totalCorrigidos = 0;

for (const arquivo of arquivos) {
  const caminho = path.join(siteDir, arquivo);
  let conteudo  = fs.readFileSync(caminho, 'utf8');

  const temCSS = conteudo.includes('comentarios.css');
  const temJS  = conteudo.includes('comentarios.js');

  if (temCSS && temJS) continue; // já tem tudo

  // Adiciona CSS no <head> antes de </head>
  if (!temCSS) {
    conteudo = conteudo.replace('</head>', `  ${linkCSS}\n</head>`);
  }

  // Adiciona JS antes de </body>
  if (!temJS) {
    conteudo = conteudo.replace('</body>', `<script src="comentarios.js"></script>\n</body>`);
  }

  fs.writeFileSync(caminho, conteudo, 'utf8');
  console.log(`  adicionado: ${arquivo}`);
  totalCorrigidos++;
}

if (totalCorrigidos === 0) {
  console.log('  Todos os arquivos ja tem o formulario de comentarios.');
} else {
  console.log(`\n  ${totalCorrigidos} arquivo(s) atualizado(s).`);
}
