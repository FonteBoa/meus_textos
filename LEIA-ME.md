# fonteboa — guia de manutenção e migração

## O que mudou e por quê

O site original repete ~60 linhas de JavaScript idêntico em **cada página HTML**.
Com 600–1000 textos, qualquer mudança (um item a mais no menu, ajuste de espaçamento,
nova funcionalidade) exigiria editar centenas de arquivos individualmente.

A versão otimizada centraliza todo o comportamento em dois arquivos:

| Arquivo           | Responsável por                                              |
|-------------------|--------------------------------------------------------------|
| `layout_master.js`| Menu, layout, scroll, progresso de leitura, tudo            |
| `style.css`       | Cores, fontes e espaços via variáveis CSS (`--bg`, `--fg`…) |

Cada HTML de texto agora tem **apenas 1 linha de script** que varia:

```html
<script>initLayout('contos', 'texto');</script>
```

---

## Como migrar os HTMLs existentes

Cada página de texto precisa de três alterações:

### 1. Limpar o `<nav>` — deixar vazio

```html
<!-- ANTES -->
<nav id="nav-menu">
  <a class="active" href="contos_index.html">índice de contos</a>
  <a href="ensaios_index.html">ensaios</a>
  ... (mais 3 links)
</nav>

<!-- DEPOIS -->
<nav id="nav-menu"></nav>
```

### 2. Limpar o `<div class="titulo">` — deixar vazio

```html
<!-- ANTES -->
<div class="titulo" id="titulo">ficção breve de Luiz Fonte Boa, (1962- )</div>

<!-- DEPOIS -->
<div class="titulo" id="titulo"></div>
```
O subtítulo é injetado pelo `layout_master.js` via `SITE.subtitulo`.
Para mudar o subtítulo no site inteiro: edite apenas `SITE.subtitulo` no JS.

### 3. Substituir o `<script>` inline inteiro por duas linhas

```html
<!-- ANTES: ~60 linhas de script inline -->
<script>
  function fitTitulo() { ... }
  function fitHero() { ... }
  function positionContentArea() { ... }
  ...
</script>

<!-- DEPOIS: 2 linhas -->
<script src="layout_master.js"></script>
<script>initLayout('contos', 'texto');</script>
```

---

## Parâmetros de `initLayout`

```
initLayout(activeId, tipo)
```

| `activeId` | Quando usar                                    |
|------------|------------------------------------------------|
| `'contos'` | página de conto ou índice de contos            |
| `'ensaios'`| página de ensaio ou índice de ensaios          |
| `'novelas'`| página de novela/nouvelle ou índice delas      |
| `'notas'`  | anotações                                      |
| `'inicio'` | apenas `index.html`                            |

| `tipo`     | Quando usar                                    |
|------------|------------------------------------------------|
| `'texto'`  | página de texto individual (ativa scroll/teclado + barra de progresso) |
| `'indice'` | página de listagem de obras                    |
| `'home'`   | apenas `index.html`                            |

---

## Como fazer mudanças globais

### Adicionar um item ao menu

Edite **apenas** o array `SITE.menu` em `layout_master.js`:

```js
menu: [
  { id: 'contos',   href: 'contos_index.html',   label: 'contos'     },
  { id: 'ensaios',  href: 'ensaios_index.html',   label: 'ensaios'    },
  { id: 'novelas',  href: 'novelas_index.html',   label: 'nouvelles'  },
  { id: 'notas',    href: 'anotacoes.html',        label: 'anotações'  },
  { id: 'aforismos',href: 'aforismos_index.html',  label: 'aforismos'  }, // ← novo
  { id: 'inicio',   href: 'index.html',            label: 'início'     },
],
```

**Resultado**: todos os HTMLs do site exibem o novo item automaticamente,
sem tocar em nenhum arquivo HTML.

### Mudar o subtítulo do cabeçalho

```js
// Em layout_master.js:
subtitulo: 'ficção breve de Luiz Fonte Boa, (1962–2025)',
```

### Mudar a cor de destaque (barra de progresso, hover do "início")

```css
/* Em style.css: */
:root {
  --accent: #7a1f10; /* era #ae3321 */
}
```

### Mudar a cor de fundo

```css
:root {
  --bg: #EDE0D0; /* qualquer outra cor */
}
```

### Mudar o espaço entre o nav e a área de conteúdo

```js
// Em layout_master.js:
offsetDesktop: 60,  /* era 50 */
offsetMobile:  16,  /* era 10 */
```

### Mudar o tamanho da fonte do corpo dos textos

```css
:root {
  --body-size: 1.25rem; /* era 1.15rem */
  --body-lh:   1.8;     /* era 1.7 */
}
```

---

## Como criar um novo texto

Copie `conto-template.html` (ou o equivalente da seção), salve com o nome do texto,
e edite apenas três coisas:

1. `<title>` — título da aba do navegador
2. `id="text-title"` — título visível na página
3. Conteúdo dentro de `.scroll-inner` — o texto em si
4. `id="hero"` — palavra decorativa de fundo (o gênero: `contos`, `ensaios`, etc.)

A linha `initLayout('contos', 'texto')` já está correta no template.
Se for um ensaio, troque por `initLayout('ensaios', 'texto')`.

---

## Funcionalidades incluídas na versão otimizada

| Funcionalidade          | Como ativar                                        |
|-------------------------|----------------------------------------------------|
| Menu dinâmico           | automático em todas as páginas                     |
| Subtítulo dinâmico      | automático                                         |
| Scroll por teclado      | automático em páginas `tipo='texto'`               |
| Barra de progresso      | automático em páginas `tipo='texto'`               |
| Layout responsivo       | automático (CSS + JS)                              |
| Posicionamento do conteúdo abaixo do nav | automático, se adapta a qualquer tamanho de menu |

---

## Estrutura de arquivos recomendada

```
fonteboa/
├── layout_master.js        ← edite aqui para mudar comportamento global
├── style.css               ← edite aqui para mudar visual global
├── index.html
│
├── contos_index.html       ← lista de contos (atualizar manualmente ao publicar)
├── ensaios_index.html
├── novelas_index.html
├── anotacoes.html
│
├── conto-[slug].html       ← um arquivo por texto publicado
├── ensaio-[slug].html
├── novela-[slug].html
│
└── _templates/
    ├── conto-template.html
    ├── ensaio-template.html
    └── novela-template.html
```

---

## Observação sobre os índices

Os índices (`contos_index.html` etc.) ainda são listas HTML estáticas.
Isso é simples e funciona bem até ~1000 itens sem nenhum problema de performance.
A única manutenção necessária é adicionar um `<li><a href="...">...</a></li>`
ao índice correto quando publicar um novo texto.

Se no futuro preferir gerar os índices automaticamente a partir dos arquivos HTML
existentes, isso pode ser feito com um script Node.js simples que lê os títulos
dos arquivos e regenera os índices — mas não é necessário agora.
