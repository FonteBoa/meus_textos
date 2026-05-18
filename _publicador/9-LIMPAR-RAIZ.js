/**
 * 9-LIMPAR-RAIZ.js — fonteboa
 * Apaga da raiz do site todos os HTMLs de texto
 * (conto-*, ensaio-*, cronica-*, nota-*)
 * mantendo apenas os arquivos estruturais.
 */

const fs   = require('fs');
const path = require('path');

const siteDir = process.argv[2] || '.';

const manter = [
  'index.html',
  'contos_index.html',
  'ensaios_index.html',
  'cronicas_index.html',
  'notas_index.html',
  'anotacoes.html',
  'comentarios.html',
  'conto-template.html',
  'ensaio-template.html',
  'cronica-template.html',
  'nota-template.html',
  'contos_index-template.html',
];

const arquivos = fs.readdirSync(siteDir)
  .filter(f => f.endsWith('.html') && !manter.includes(f));

let totalApagados = 0;

for (const arquivo of arquivos) {
  const caminho = path.join(siteDir, arquivo);
  fs.unlinkSync(caminho);
  console.log(`  apagado: ${arquivo}`);
  totalApagados++;
}

if (totalApagados === 0) {
  console.log('  Nenhum arquivo para apagar.');
} else {
  console.log(`\n  ${totalApagados} arquivo(s) apagado(s).`);
}
