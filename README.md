# Use-Me | Primeira versão

Site responsivo de catálogo para a loja @useme.oficiaal.

## Estrutura

- `index.html` - página principal
- `styles.css` - identidade visual e responsividade
- `script.js` - produtos, busca, categorias e WhatsApp
- `fonts/` - coloque aqui a fonte licenciada da loja

## Fonte Amsterdam One

Como a loja possui a licença, coloque o arquivo `.woff2` da fonte dentro de `fonts/` com o nome:

`AmsterdamOne.woff2`

Depois, no `styles.css`, descomente o bloco `@font-face`.

## WhatsApp

Abra `script.js` e altere:

`whatsapp: "5500000000000"`

para o número real da loja, somente números e incluindo o código do país.

## Produtos

Os produtos de exemplo ficam no começo do `script.js`, dentro de `const products`.
Na próxima etapa podemos trocar os placeholders pelas fotos reais, nomes, tamanhos, preços e estoque da loja.
