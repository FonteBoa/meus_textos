/**
 * corrigir-menu.js — fonteboa
 * Substitui todas as referências a novelas/nouvelles
 * pelo termo correto crônicas em todos os HTMLs do site.
 */

const fs   = require('fs');
const path = require('path');

const siteDir = process.argv[2] || '.';

const substituicoes = [
  [ 'novelas_index.html',   'cronicas_index.html'  ],
  [ 'nouvelles_index.html', 'cronicas_index.html'  ],
  [ '>novelas<',            '>crônicas<'           ],
  [ '>nouvelles<',          '>crônicas<'           ],
  [ '>novelas',             '>crônicas'            ],
  [ '>nouvelles',           '>crônicas'            ],
  [ '>índice de novelas<',  '>índice de crônicas<' ],
  [ '>índice de nouvelles<','>índice de crônicas<' ],
];

const arquivos = fs.readdirSync(siteDir)
  .filter(f => f.endsWith('.html'));

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
    console.log(`  corrido: ${arquivo}`);
    totalCorrigidos++;
  }
}

if (totalCorrigidos === 0) {
  console.log('  Nenhum arquivo precisou de correcao.');
} else {
  console.log(`\n  ${totalCorrigidos} arquivo(s) corrigido(s).`);
}
