# AGENTS.md - Guia para IAs: montar o site de uma lanchonete

Este projeto é um **template** de site de pedidos para lanchonetes: cardápio estilo
totem de autoatendimento, carrinho, e finalização que abre o **WhatsApp da loja com o
pedido pronto**. É 100% estático (Next.js com `output: "export"`), publicado no
Cloudflare Pages. Não tem backend, banco nem painel.

> **REGRA DE OURO**
> Para montar o site de uma loja, você mexe **somente** em `conteudo/` e nos
> **arquivos gerados** listados abaixo. **Não edite componentes, estilos nem outros
> arquivos de `src/`** para trocar de loja. Se algo parecer exigir isso, pare e avise
> o usuário.

---

## 1. Mapa de arquivos

| Tipo | Arquivo | Quem mexe |
|------|---------|-----------|
| **Entrada** | `conteudo/cardapio.md` | O dono da loja escreve. |
| **Entrada** | `conteudo/tema.md` | O dono escreve: identidade (nome, WhatsApp, horários...), cores e fonte. |
| **Entrada** | `conteudo/imagens/` | O dono coloca as fotos e, se tiver, `logo.png`. |
| **Gerado por você** | `src/data/menu.json` | Você, a partir de `cardapio.md`. |
| **Gerado por você** | `src/data/store.json` | Você, a partir do bloco *Identidade* de `tema.md`. |
| **Gerado por você** | `src/data/theme.json` | Você, a partir do bloco *Cores* de `tema.md`. |
| **Gerado por você** | `src/theme/font.ts` | Você, a partir do bloco *Fonte* de `tema.md`. |
| **Gerado por comando** | `src/data/images.manifest.json`, `public/menu/*`, `public/brand/*` | `npm run images`. Não escreva à mão. |
| **Código fixo** | todo o resto de `src/`, `scripts/`, configs | **Não mexer.** |

O texto escrito (`conteudo/*.md`) é a **fonte da verdade**. Os arquivos gerados são
consequência. Se o dono pedir uma mudança, altere o `.md` **e** regenere os dados, para
os dois nunca ficarem diferentes. Cada arquivo gerado tem um aviso no topo (campo
`"_gerado"` nos JSON).

## 2. Passo a passo

```bash
npm install              # só na primeira vez
# 1. Leia conteudo/cardapio.md e conteudo/tema.md
# 2. Gere/atualize: src/data/menu.json, store.json, theme.json e src/theme/font.ts
npm run images           # otimiza conteudo/imagens -> public/ e gera o manifest
npm run validar          # confere tudo e mostra erros/avisos
npm run build            # tem que terminar sem erro (gera a pasta out/)
npm run dev              # opcional: ver o site em http://localhost:3000
```

Ordem importa: rode `npm run images` **antes** de `npm run validar` (o validador usa o
manifest das fotos). Se o validador mostrar **ERROS**, corrija e rode de novo. Só
considere pronto quando o build passar e o relatório final (seção 8) estiver feito.

## 3. Regras de ouro sobre os dados

1. **Nunca invente** preço, ingrediente, tamanho, horário, WhatsApp ou cor. Se faltar,
   **pergunte ao usuário**. Se ele não puder responder agora, deixe o item de fora do
   JSON e registre em **Faltando** no relatório (melhor sem o produto do que com preço
   errado).
2. Copie nomes e textos **como o dono escreveu** (corrija só erros óbvios de digitação
   e avise).
3. Coisas **decorativas** que você precisar escolher (emoji de categoria ou de produto,
   frase do destaque quando não houver) são permitidas, mas **liste em Suposições**.
4. Tudo em português do Brasil, com acentos.
5. Preços em **reais como número**: `R$ 6,00` -> `6`, `R$ 1.250,50` -> `1250.5`.

## 4. `conteudo/cardapio.md` -> `src/data/menu.json`

### 4.1 Como o dono escreve (convenção)

```md
## 🍕 Pizzas                       <- categoria (o emoji é opcional)

Adicionais: Bacon R$ 5,00 | Borda de Catupiry R$ 8,00   <- vale para os produtos desta categoria

### Tradicionais                   <- seção (subtítulo dentro da categoria)
Foto: pizza tradicional.jpg        <- vale para os itens abaixo, até o próximo título ou 'Foto:'

- Pizza de Mussarela: Média R$ 38,00 | Grande R$ 48,00. Molho, mussarela e orégano.
- X-Burger - R$ 22,00: Pão, hambúrguer, queijo e salada.
  Sabor (obrigatório, escolher 1): Cola, Guaraná       <- escolha, recuada sob o item

## Destaque                        <- NÃO é categoria: é o destaque da home
Produto: Pizza Quatro Queijos
Foto: destaque.jpg
Frase: Mussarela, provolone, gorgonzola e parmesão
```

O dono pode escrever de forma mais solta que isso (cardápios reais costumam vir com
tabelas, listas e observações misturadas). **Interprete com bom senso** e, na dúvida,
pergunte.

### 4.2 Tradução texto -> JSON

| No texto | No JSON |
|----------|---------|
| `## Categoria` | item em `categories` (`id` = nome sem acento, minúsculo, com hífen; `label`; `emoji`) |
| `### Seção` | campo `section` dos produtos abaixo |
| `- Nome - R$ 22,00` | produto com `"price": 22` |
| `- Nome: 300 ml R$ 8,00 \| 500 ml R$ 12,00` | produto com `"variants": [{"label":"300 ml","price":8},{"label":"500 ml","price":12}]` |
| "lanche R$ 6 / combo R$ 11" | `variants`: `"Só o lanche"` e `"Combo ..."` (descreva o combo no rótulo, ex.: `"Combo com batata e refri"`) |
| `Sabor (obrigatório, escolher 1): A, B` | `optionGroups`: `{"title":"Sabor","type":"single","required":true,"options":["A","B"]}` |
| `Caldas (opcional): A, B` | `{"title":"Caldas","type":"multiple","options":["A","B"]}` |
| `Sabores (obrigatório, até 2): A, B, C` | `{"title":"Sabores","type":"multiple","required":true,"max":2,"options":[...]}` |
| `Adicionais: Bacon R$ 5,00 \| Ovo R$ 3,00` | `addons` com `[{"label":"Bacon","price":5},{"label":"Ovo","price":3}]` em todos os produtos do escopo |
| `Foto: arquivo.jpg` | `"image": "arquivo.jpg"` em cada produto do escopo |
| `## Destaque` | objeto `featured` |

**Diferença entre os três tipos de "extra":**
- **Tamanho/versão** (`variants`): muda o **preço base**; o cliente escolhe uma.
- **Escolha** (`optionGroups`): sabores, caldas, "salsicha ou linguiça"; **sem custo**.
- **Adicional** (`addons`): item **pago** somado ao preço (bacon, ovo, borda...).

**Escopo de `Adicionais:` e `Foto:`**
- `Adicionais:` logo abaixo de um título `##` vale para **todos** os produtos daquela categoria
  (inclusive os de `###` abaixo). Dentro de um `###`, vale só para aquela seção.
- `Foto:` vale para os itens seguintes até o próximo título (`##` ou `###`) ou outra linha `Foto:`.
  Uma linha `Foto:` recuada sob um item vale só para ele.

**Fotos compartilhadas:** uma foto pode servir vários produtos. Repita o mesmo nome em
`image` de cada um.

**Destaque:** `featured.product` é o `id` de um produto que **já existe** no cardápio. Se o dono
descreveu o produto em destaque (preço, ingredientes) mas ele não está na lista, crie o
produto na categoria mais adequada (pergunte qual, se não for óbvio) e registre em
Suposições.

### 4.3 Formato do `menu.json`

```json
{
  "_gerado": "GERADO a partir de conteudo/cardapio.md. Não edite à mão: edite o .md e peça para a IA regenerar (veja o AGENTS.md).",
  "categories": [
    { "id": "pizzas", "label": "Pizzas", "emoji": "🍕" }
  ],
  "addonSets": {
    "pizza": [ { "label": "Bacon", "price": 5 } ]
  },
  "optionSets": {
    "sabor-refri": { "title": "Sabor", "type": "single", "required": true, "options": ["Cola", "Guaraná"] }
  },
  "products": [
    {
      "id": "pizza-mussarela",
      "name": "Pizza de Mussarela",
      "description": "Molho de tomate, mussarela e orégano.",
      "category": "pizzas",
      "section": "Tradicionais",
      "image": "pizza tradicional.jpg",
      "emoji": "🍕",
      "variants": [ { "label": "Média", "price": 38 }, { "label": "Grande", "price": 48 } ],
      "addons": "pizza"
    },
    {
      "id": "refrigerante-lata",
      "name": "Refrigerante lata",
      "category": "bebidas",
      "price": 6,
      "optionGroups": [ "sabor-refri" ]
    }
  ],
  "featured": { "product": "pizza-mussarela", "tagline": "Frase curta", "image": "destaque.jpg" }
}
```

Campos de cada produto:

| Campo | Obrigatório | Observações |
|-------|:-----------:|-------------|
| `id` | sim | Único. Só letras minúsculas, números e hífen (ex.: `pizza-mussarela`). |
| `name` | sim | Como aparece no site e na mensagem do WhatsApp. Deixe claro o suficiente (ex.: "Pizza de Mussarela", não só "Mussarela"). |
| `category` | sim | Tem que ser o `id` de uma categoria. |
| `price` **ou** `variants` | sim | **Exatamente um dos dois.** `variants` com um item só não faz sentido: use `price`. Com 2+ variantes, todas precisam de `label` único. |
| `description` | não | Ingredientes/descrição. Recomendado. |
| `section` | não | Subtítulo dentro da categoria. |
| `image` | não | Nome do arquivo da foto **como o dono citou** (veja seção 6). Sem foto, omita. |
| `emoji` | não | Usado no lugar da foto. Só faz sentido em produto sem foto. |
| `optionGroups` | não | Lista de grupos escritos direto **ou** nomes de `optionSets`. |
| `addons` | não | Nome de um `addonSets` **ou** lista escrita direto. |

**Conjuntos (`addonSets`, `optionSets`):** quando a mesma lista de adicionais ou escolhas
se repete em vários produtos, defina uma vez e referencie pelo nome. Listas que aparecem
em um produto só ficam escritas direto nele.

**Grupo de escolhas:** `type` é `"single"` (escolhe 1) ou `"multiple"` (escolhe vários);
`required` obriga a escolher (em `multiple`, ao menos 1); `max` limita a quantidade (só em
`multiple`); `options` é a lista de textos.

## 5. `conteudo/tema.md` -> `store.json`, `theme.json` e `font.ts`

### 5.1 Como o dono escreve

```md
## Identidade
Nome: Pizzaria do Zé
Slogan: Quentinha até a sua porta
Emoji: 🍕
WhatsApp: (21) 99999-0000
Horário: Terça a domingo, das 18h às 23h30. Segunda é folga.
Endereço: Rua das Flores, 100 - Centro
Instagram: @pizzariadoze
Entrega: Consulte a taxa de entrega no WhatsApp     <- opcional

## Cores
Principal: #c2410c
Secundária: #dc2626
Fundo: #ffffff
Texto: #1c1917

## Fonte
Nunito
```

### 5.2 `store.json`

```json
{
  "_gerado": "GERADO a partir do bloco 'Identidade' de conteudo/tema.md. ...",
  "name": "Pizzaria do Zé",
  "slogan": "Quentinha até a sua porta",
  "emoji": "🍕",
  "whatsapp": "5521999990000",
  "address": "Rua das Flores, 100 - Centro",
  "instagram": "@pizzariadoze",
  "deliveryInfo": "Consulte a taxa de entrega no WhatsApp",
  "hours": {
    "schedule": [
      { "days": [2, 3, 4, 5, 6, 0], "label": "Ter a Dom", "open": "18:00", "close": "23:30" }
    ],
    "closedNote": "Segunda é folga!"
  }
}
```

- **`whatsapp`**: só dígitos, `55` + DDD + número (12 ou 13 dígitos). `(21) 99999-0000` ->
  `5521999990000`. **Sem DDD, pergunte.** Esse número recebe os pedidos: errar aqui é grave.
- **`hours.schedule`**: um item por faixa de horário.
  - `days`: `0` = domingo, `1` = segunda, `2` = terça, `3` = quarta, `4` = quinta, `5` = sexta, `6` = sábado.
  - `open` / `close`: formato 24h `HH:MM` (`23h30` -> `"23:30"`). Se fechar **depois da meia-noite**
    (ex.: 19h às 1h), `close` é menor que `open` (`"01:00"`). O site entende sozinho.
  - `label`: texto do rodapé (ex.: `"Seg, Ter e Qua"`).
  - Dias diferentes com horários diferentes viram faixas separadas.
- **`hours.closedNote`**: aviso de folga ("Quinta é folga!"). Opcional.
- **`instagram`**: pode ser `@usuario` ou o link completo. Opcional.
- Campos opcionais sem informação: omita (não escreva texto de enchimento).

### 5.3 `theme.json`

```json
{
  "_gerado": "GERADO a partir do bloco 'Cores' de conteudo/tema.md. ...",
  "colors": { "primary": "#c2410c", "secondary": "#dc2626", "background": "#ffffff", "foreground": "#1c1917" }
}
```

- **Principal** e **Secundária** formam o degradê dos botões e destaques. O texto branco
  é escrito **sobre** elas, então precisam ser **escuras o bastante** (o `npm run validar`
  mede o contraste e avisa).
- **Fundo** é a cor das páginas e dos cartões. **Texto** é a cor do texto principal.
- Use `#RRGGBB`. Se o dono der só o **nome** de uma cor ("laranja queimado"), proponha um
  hex, peça confirmação e registre em Suposições.
- Este template foi feito para **fundo claro**. Fundo escuro exige mudanças de código e
  está fora do escopo: avise o usuário.

### 5.4 `src/theme/font.ts`

Use **sempre** este modelo, trocando só o nome da fonte (e os pesos, se ela não for variável):

```ts
import { Nunito } from "next/font/google";

export const brandFont = Nunito({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});
```

- A fonte precisa existir no **Google Fonts**. Nomes com espaço usam `_` (`Open Sans` -> `Open_Sans`).
- **Fonte variável** (Nunito, Inter, Open Sans...): pode omitir `weight`.
  **Fonte fixa** (Poppins, Pacifico...): liste `weight: ["400", "500", "600", "700", "800"]`
  apenas com os pesos que ela tem; o site usa **400** (normal) e **700** (negrito).
- Mantenha `variable: "--font-brand"` e `subsets: ["latin"]`.
- Se o dono pediu uma fonte que não é do Google Fonts, escolha a mais parecida e avise.
- `npm run validar` confere se a fonte existe e se os pesos são válidos.

## 6. Imagens e logo (`conteudo/imagens/`)

- O dono coloca as fotos **originais** (pesadas, tudo bem). `npm run images` gera versões
  leves em WebP (largura 900 px) em `public/menu/`.
- No cardápio, a foto é citada **pelo nome do arquivo**. Em `"image"`, escreva o nome como o
  dono escreveu. O site acha a foto ignorando maiúsculas, acentos, espaços e extensão:
  `"Pizza Tradicional.JPG"`, `"pizza tradicional"` e `"pizza-tradicional"` são a mesma foto.
- **Logo**: se existir um arquivo chamado **`logo`** (`logo.png`, `.jpg`, `.webp` ou `.svg`), o site
  o usa no topo e nos produtos sem foto. Não precisa configurar nada. Sem logo, o site usa a
  **inicial do nome da loja** sobre o degradê.
- Foto chamada **`destaque`** (ou `destaque-algo`) tem as **bordas brancas cortadas**
  automaticamente (boa para foto de produto com fundo branco).
- Dois arquivos que viram o mesmo nome (`a.jpg` e `a.png`) dão erro: renomeie um.
- Produtos sem foto usam o `emoji` do produto ou a marca da loja. Isso é normal e não é erro.

## 7. Checklist de validação (o que você deve conferir e avisar)

Rode `npm run validar` e leia a saída. Ele cobre a maior parte, mas **você** também deve
conferir o que um script não consegue:

**Automático (o validador avisa):** produto sem preço ou com preço estranho; categoria sem
produto; id/nome repetido; foto citada que não existe; foto na pasta que ninguém usa; escolha
sem opções; tamanhos repetidos; WhatsApp inválido; horário incompleto; cor inválida ou
contraste ruim; fonte inexistente ou peso inválido; `.md` alterado depois dos dados gerados.

**Manual (só você pode conferir):**
- Todos os itens do `cardapio.md` entraram no `menu.json`? (compare a contagem)
- Algum preço foi digitado errado na conversão?
- O produto do destaque é o que o dono pediu?
- O texto do WhatsApp/horário bate com o que o dono escreveu?
- Você precisou escolher algo que o dono não disse? (vai em Suposições)

## 8. Relatório final (sempre entregue ao usuário)

Termine **todo** trabalho com este resumo:

```
## Resumo
Loja: <nome> | Categorias: N | Produtos: N | Fotos: N | Logo: sim/não
Build: passou / falhou

## Faltando (preciso de você)
- <o que não foi informado e não pude inventar>

## Suposições que fiz
- <emojis escolhidos, cores interpretadas, agrupamentos duvidosos...>

## Fotos não utilizadas
- <arquivos que nenhum produto usa>

## Avisos do validador
- <copie os avisos que restaram>
```

Se não houver nada em uma seção, escreva "nenhum".

## 9. Começando uma loja NOVA a partir deste template

1. Substitua `conteudo/cardapio.md` e `conteudo/tema.md` pelos da loja nova.
2. Apague as imagens de exemplo de `conteudo/imagens/` e coloque as da loja (e `logo.*`, se houver).
3. Gere `menu.json`, `store.json`, `theme.json` e `font.ts` (seções 4 e 5).
4. `npm run images` (ele apaga sozinho as fotos antigas de `public/`), `npm run validar`, `npm run build`.
5. Os arquivos gerados **vão para o Git** (o Cloudflare só roda `npm run build`; ele não roda
   `npm run images`). Isso inclui `src/data/*.json`, `src/theme/font.ts` e `public/menu`.

## 10. Publicação (Cloudflare Pages)

| Campo | Valor |
|-------|-------|
| Build command | `npm run build` |
| Build output directory | `out` |
| Variável de ambiente | `NODE_VERSION` = `20` |
| Tipo de projeto | **Pages** com Git (não use "Worker" nem OpenNext) |

## 11. Problemas comuns

| Sintoma | O que fazer |
|---------|-------------|
| Build falha com `menu.json: ...` | A mensagem diz o que está errado (produto, categoria, conjunto inexistente...). Corrija o JSON. |
| Build falha com `store.json: ...` | Falta o nome ou o WhatsApp está inválido. |
| Erro de fonte / `Unknown weight` | Rode `npm run validar`; ele lista os pesos que a fonte tem. |
| Foto não aparece | Rode `npm run images`. Confira o nome no cardápio com o arquivo. `npm run validar` aponta fotos não encontradas. |
| `npm run images` dá erro de nome repetido | Dois arquivos viram o mesmo nome. Renomeie um. |
| Cores "lavadas" ou texto ilegível | `npm run validar` mostra o contraste. Escolha cores mais escuras. |

## 12. O que NÃO fazer

- Não edite componentes, estilos, `tailwind.config.ts` ou outros arquivos de `src/` para uma loja.
- Não escreva cores, textos da loja ou preços diretamente no código.
- Não troque `output: "export"` em `next.config.mjs` nem use `next/image` (site é estático).
- Não instale dependências novas para resolver conteúdo.
- Não edite `public/menu/*` nem `src/data/images.manifest.json` à mão: use `npm run images`.
- Não invente dados que o dono não forneceu.
- Formas de pagamento (Pix, Cartão, Dinheiro) são fixas no código. Se a loja precisa de outras,
  avise o usuário: isso exige uma mudança de código, fora deste fluxo.
