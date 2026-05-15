/**
 * 7-LIMPAR-E-CORRIGIR.js — fonteboa
 * 1. Remove "disabled" dos scripts layout_master.js
 * 2. Remove referências ao overlay-system
 * 3. Corrige link "crônicas_index.html" → "cronicas_index.html"
 * 4. Apaga arquivos desnecessários da raiz
 */

const fs   = require('fs');
const path = require('path');

const siteDir = process.argv[2] || '.';

/* ── Substituições nos HTMLs ─────────────────────── */
const substituicoes = [
  [ '<script disabled src="layout_master.js"></script>',  '<script src="layout_master.js"></script>' ],
  [ '<script disabled>initLayout(',                       '<script>initLayout(' ],
  [ '<link rel="stylesheet" href="overlay-system.css">', '' ],
  [ '<script src="file:///C:/TEXTOS/site/overlay-system.js"></script>', '' ],
  [ '<script src="overlay-system.js"></script>',          '' ],
  [ '<link href="overlay-system.css" rel="stylesheet"/>', '' ],
  [ 'href="crônicas_index.html"',                         'href="cronicas_index.html"' ],
];

/* ── Arquivos a apagar ───────────────────────────── */
const apagar = [
  'overlay-system.js',
  'overlay-system.css',
  'teste-overlay.html',
  'comentarios_OLD_3.js',
  'comentarios_OLD_3.css',
  'comentarios_OLD_4.js',
  'comentarios_OLD_4css',
  'testes.zip',
  'files.zip',
  'teste_comentarios.zip',
  'conto-detalhismos_original.html',
  'conto-PRIMEIRO-IMPULSO-teste.html',
  'comentarios.js_OLD.txt',
];

/* ── Corrige HTMLs ───────────────────────────────── */
const arquivos = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));
let totalCorrigidos = 0;

for (const arquivo of arquivos) {
  const caminho = path.join(siteDir, arquivo);
  let conteudo = fs.readFileSync(caminho, 'utf8');
  const original = conteudo;

  for (const [busca, troca] of substituicoes) {
    conteudo = conteudo.split(busca).join(troca);
  }

  if (conteudo !== original) {
    fs.writeFileSync(caminho, conteudo, 'utf8');
    console.log(`  corrigido: ${arquivo}`);
    totalCorrigidos++;
  }
}

/* ── Apaga arquivos desnecessários ───────────────── */
let totalApagados = 0;

for (const nome of apagar) {
  const caminho = path.join(siteDir, nome);
  if (fs.existsSync(caminho)) {
    fs.unlinkSync(caminho);
    console.log(`  apagado:   ${nome}`);
    totalApagados++;
  }
}

/* ── Resumo ──────────────────────────────────────── */
console.log('');
if (totalCorrigidos === 0 && totalApagados === 0) {
  console.log('  Nenhuma alteracao necessaria.');
} else {
  if (totalCorrigidos > 0) console.log(`  ${totalCorrigidos} arquivo(s) corrigido(s).`);
  if (totalApagados  > 0) console.log(`  ${totalApagados} arquivo(s) apagado(s).`);
}
