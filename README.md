# Template: site de pedidos para lanchonete

Site de pedidos com cardápio estilo totem de autoatendimento, pensado para celular.
O cliente monta o pedido e, ao finalizar, abre o **WhatsApp da loja com a mensagem
pronta** (itens, total, endereço e forma de pagamento). Estático, sem backend,
publicado no Cloudflare Pages.

O objetivo deste projeto: **criar o site de uma loja nova entregando só três coisas**
(e sem mexer em código).

| O que entregar | Onde fica |
|----------------|-----------|
| O cardápio, escrito em texto | `conteudo/cardapio.md` |
| Identidade da loja, cores e fonte | `conteudo/tema.md` |
| As fotos (e o `logo.png`, se a loja tiver) | `conteudo/imagens/` |

O projeto vem com uma **loja de exemplo** (Pizzaria do Zé) preenchida nesses arquivos,
para servir de modelo.

## Montar o site de uma loja nova

A conversão do texto em dados do site é feita por uma **IA do seu editor** (Kiro, Copilot,
Cursor etc.), seguindo o guia **[`AGENTS.md`](./AGENTS.md)**.

1. Substitua `conteudo/cardapio.md` e `conteudo/tema.md` pelos da loja nova.
2. Troque as imagens de `conteudo/imagens/` pelas da loja (e coloque `logo.png`, se houver).
3. Peça à IA: *"Siga o AGENTS.md e monte o site com o conteúdo da pasta conteudo/."*
4. A IA gera os dados, otimiza as imagens, valida e avisa o que estiver faltando.

## Comandos

```bash
npm install          # primeira vez
npm run dev          # ver o site em http://localhost:3000
npm run images       # otimiza conteudo/imagens -> public/ (fotos leves em WebP)
npm run validar      # confere o cardápio, as fotos, as cores e a fonte
npm run build        # gera o site estático na pasta out/
```

## Como o projeto é organizado

```
conteudo/                  <- o que muda de loja para loja (você edita aqui)
  cardapio.md
  tema.md
  imagens/
AGENTS.md                  <- guia para a IA converter o texto em dados
src/
  data/                    <- dados GERADOS (menu.json, store.json, theme.json, images.manifest.json)
  theme/font.ts            <- fonte GERADA
  ...                      <- código do site (não muda de loja para loja)
scripts/                   <- optimize-images.mjs e validar.mjs
public/menu, public/brand  <- imagens otimizadas (geradas)
```

Os arquivos gerados vão para o Git: o Cloudflare só executa `npm run build`.

## Publicar no Cloudflare Pages

Crie o projeto pela aba **Pages** (Connect to Git) e use:

| Campo | Valor |
|-------|-------|
| Build command | `npm run build` |
| Build output directory | `out` |
| Variável de ambiente | `NODE_VERSION` = `20` |

## Stack

Next.js 15 (App Router, export estático) · React 19 · TypeScript · Tailwind CSS.
