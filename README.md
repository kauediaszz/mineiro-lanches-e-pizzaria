# Madrugadao Lanches 🦉

Site de pedidos da lanchonete Madrugadao Lanches. Cardapio estilo totem de
autoatendimento, mobile-first, com checkout que abre o WhatsApp com o pedido
pronto. Front-end puro em Next.js, sem backend.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Deploy: Vercel

## Como editar o conteudo (o que voce vai mexer)

Tudo que muda no dia a dia esta isolado em 2 arquivos + uma pasta de imagens:

### 1. Cardapio -> `src/data/menu.ts`
- Edite nome, descricao e preco dos itens.
- Para adicionar item: copie um bloco, mude o `id` (precisa ser unico) e a `category`.
- Campo `image`: caminho da foto (ex: `/menu/classic-burger.jpg`). Deixe `""`
  para usar o placeholder com gradiente.

### 2. Dados da loja -> `src/data/config.ts`
- `whatsapp`: numero no formato `55 + DDD + numero` (ja preenchido).
- `hours`: horario de funcionamento.
- `address`, `social.instagram`, etc.

### 3. Imagens
- Fotos dos produtos: coloque as originais em `imagens/` e rode `npm run images`.
  O script gera versões leves (WebP, 900px) em `public/menu/`. O nome do arquivo
  vira o do site sem acento nem espaço (`homem de ferro.jpg` -> `homem-de-ferro.webp`).
  Depois referencie em `menu.ts` (veja o objeto `IMG` no topo do arquivo).
- Produtos sem foto usam o emoji (se tiver) ou a coruja padrão.
- Logo da coruja: substitua `public/brand/logo.svg` pelo arquivo real.

### 4. Horário de funcionamento
- Em `src/data/config.ts`, em `hours.schedule`. O "Aberto agora / Fechado" do topo
  é calculado sozinho (horário de Brasília) a partir dessa lista.

## Deploy na Vercel

1. Suba o projeto para um repositorio Git (GitHub/GitLab/Bitbucket).
2. Em vercel.com, clique em "Add New Project" e importe o repositorio.
3. A Vercel detecta Next.js automaticamente. Clique em "Deploy".

Nenhuma variavel de ambiente e necessaria.

## Fluxo do pedido

Cardapio -> cliente adiciona itens (animacao ao clicar) -> barra "Ver pedido"
-> pagina `/pedido`: revisa itens, informa endereco e forma de pagamento
(Pix / Cartao / Dinheiro, com campo de troco) -> botao "Fazer pedido no
WhatsApp" abre o chat da loja com a mensagem montada.
