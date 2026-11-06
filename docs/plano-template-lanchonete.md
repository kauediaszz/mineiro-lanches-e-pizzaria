# Plano: template de site para novas lanchonetes

Status: **plano em discussão, nada implementado ainda.**
Ponto de partida: o código do site do Madrugadão Lanches (Next.js, export estático, Cloudflare Pages).

> **Enquadramento importante:** o Madrugadão é um projeto, as outras lojas são
> outros projetos. O trabalho descrito aqui cria uma **base (template) para as
> lojas novas**. O site do Madrugadão **não é alterado**: a coruja, as cores e o
> cardápio dele ficam como estão.

---

## 1. Objetivo

Hoje, para criar o site de outra lanchonete seria preciso mexer em código
(`menu.ts`, `config.ts`, `tailwind.config.ts`, componentes...).

Queremos chegar a isto: **montar uma loja nova sem tocar em `src/`**.
A pessoa (ou uma IA de qualquer IDE/cloud: Kiro, Copilot, Cursor etc.) recebe
apenas três coisas e entrega o site pronto:

1. O **cardápio**, escrito em texto.
2. As **imagens**, na pasta de imagens.
3. O **tema**: cores, fonte e dados da loja (nome, WhatsApp, horários...), num único arquivo.

O site continua **estático** no Cloudflare Pages. Não entra banco, painel admin
nem backend.

## 2. Como vai funcionar (fluxo de uma loja nova)

```
conteudo/ (o que a pessoa entrega)
   │
   ├─ cardapio.md ─┐
   ├─ tema.md ─────┴─► IA lê o guia (AGENTS.md) e GERA os arquivos de dados do site
   │                        (menu, configurações da loja, variáveis de cor e fonte)
   └─ imagens/ ────────► `npm run images` otimiza para public/menu/ (como já fizemos)
                              │
                              ▼
                   IA valida e AVISA o que faltou ──► npm run build ──► deploy
```

Ponto central: **o texto escrito é a fonte da verdade**. Quem converte texto em
dados do site é a IA da IDE, seguindo um guia escrito neste repositório. Isso é
o que fizemos manualmente com o documento `cardapio_funcionamento`.

## 3. Decisões já fechadas

| # | Tema | Decisão |
|---|------|---------|
| 1 | Formato do cardápio | **Escrito em texto** (como o documento atual). A IA gera a estrutura de dados do site a partir dele. Ninguém edita JSON/YAML à mão. |
| 2 | Ligação foto ↔ produto | **Referência explícita**: o cardápio diz o nome do arquivo da foto. Uma foto pode servir vários produtos (ex.: uma foto para Homem-Aranha, Capitão América e Batman). |
| 3 | Logo | Fica **na mesma pasta de imagens**, com nome `logo.png` (ou `.svg`/`.webp`). Se a loja não tiver logo, o site usa uma **imagem padrão neutra** (ver seção 7). |
| 4 | Otimização de imagens | **Igual ao que já fazemos**: comando `npm run images` (originais pesados viram WebP leve). Continua manual, rodado pela IA/pessoa. |
| 5 | Organização | Uma pasta única na raiz, `conteudo/`, com cardápio, tema e imagens. |
| 6 | Validação | A **IA da IDE avisa** o que estiver faltando ou estranho no cardápio, em vez de inventar. |
| 7 | Dados da loja | **Ficam dentro do `tema.md`** (não existe `loja.md`). Um arquivo só para identidade e visual. |
| 8 | Imagem padrão sem logo | **Neutra**, pensada para as lojas novas. A coruja é só do Madrugadão e **não entra no template**. O Madrugadão não é alterado. |
| 9 | Originais das imagens | **Ficam no Git**, junto do projeto, para o pacote viajar completo para qualquer IDE/cloud. |
| 10 | Fonte | **Entra no `tema.md`**, junto com as cores. |

## 4. Estrutura de pastas proposta

```
conteudo/                     <- TUDO que muda de loja para loja
  cardapio.md                 <- produtos, preços, categorias, adicionais, destaque
  tema.md                     <- identidade da loja, cores e fonte
  imagens/
    logo.png                  <- opcional
    homem-aranha-capitao-batman.jpg
    destaque.jpg
    ...

AGENTS.md                     <- guia para a IA (regras, passos, checklist de validação)

src/                          <- código do site: NÃO muda de loja para loja
  data/                       <- arquivos GERADOS pela IA a partir de conteudo/
  theme/                      <- variáveis de cor e fonte GERADAS a partir de tema.md
scripts/optimize-images.mjs   <- lê conteudo/imagens, escreve em public/menu
public/menu/                  <- fotos otimizadas (geradas)
```

Regra de ouro: arquivos gerados levam um cabeçalho do tipo
`GERADO a partir de conteudo/cardapio.md - não edite aqui, edite o .md e peça para a IA regenerar`.
Isso evita que o texto e os dados fiquem diferentes com o tempo.

O template já vem com uma **loja de exemplo** em `conteudo/` (fictícia), para
servir de modelo de preenchimento e de teste.

## 5. O que a pessoa escreve

### 5.1 `cardapio.md`

Texto livre, como o documento atual, com **uma convenção mínima** para a IA não
errar a conversão:

- Títulos (`##`) separam **categorias** e subtítulos (`###`) separam **seções**.
- Cada produto: **nome, preço e ingredientes/descrição**.
- Produtos com **tamanhos ou versões** (ex.: açaí 250 ml / 500 ml; lanche ou combo)
  listam todos os preços.
- **Escolhas sem custo** (sabores, caldas, "salsicha ou linguiça") em lista própria,
  dizendo se são obrigatórias, opcionais ou têm limite ("até 2").
- **Adicionais pagos** em lista com preço.
- **Foto**: linha `Foto: nome-do-arquivo.jpg`. Vale para os produtos logo abaixo,
  até aparecer outra linha `Foto:`.
- **Destaque da home**: bloco `Destaque:` com o produto e a foto.

Exemplo curto:

```md
## Lanches
### Hambúrguer de carne
Foto: homem-aranha-capitao-batman.jpg
- Homem-Aranha - R$ 6,00 (combo R$ 11,00): pão, carne, cheddar, salada e molho especial.
- Capitão América - R$ 8,00 (combo R$ 12,00): pão, carne, cheddar, polenguinho, salada e molho.

Combo = batata + Guaracamp.
Adicionais: Bacon R$ 3,00 | Ovo R$ 2,00 | Cheddar fatiado R$ 2,00

## Açaí e Sorvetes
Foto: acai.jpg
- Açaí: 250 ml R$ 9,00 | 500 ml R$ 16,00 | 1 litro R$ 27,00
  Sabor (obrigatório, escolher 1): Banana, Morango
  Caldas (opcional): Morango, Chocolate, Caramelo
```

### 5.2 `tema.md`

Um arquivo só, com três blocos:

- **Identidade da loja**: nome, slogan, WhatsApp (com DDD), horários de funcionamento
  e dias de folga, endereço, redes sociais.
- **Cores**: principal, secundária (para o degradê), fundo e cor do texto.
- **Fonte**: nome de uma fonte do Google Fonts.

A IA gera a partir dele os dados da loja, um único arquivo de variáveis de cor e a
configuração da fonte.

Exemplo curto:

```md
## Identidade
Nome: Pizzaria do Zé
Slogan: Quentinha até a sua porta
WhatsApp: (21) 99999-0000
Horário: Terça a domingo, das 18h às 23h30. Segunda é folga.
Endereço: Rua das Flores, 100 - Centro
Instagram: @pizzariadoze

## Cores
Principal: #c2410c
Secundária: #f59e0b
Fundo: #ffffff
Texto: #1c1917

## Fonte
Nunito
```

## 6. O papel da IA e a validação

O arquivo `AGENTS.md` (na raiz) descreve, em português simples:

1. Onde ficam os arquivos de entrada e quais arquivos a IA deve gerar.
2. O formato exato dos dados do site (produto, tamanhos, escolhas, adicionais).
3. Passos: gerar dados → rodar `npm run images` → rodar o build.
4. A **regra de não inventar**: se faltar preço, ingrediente ou foto, **perguntar**
   ou marcar como pendente, nunca preencher no chute.
5. O **checklist de validação** abaixo.

**Checklist (a IA deve avisar o usuário, de forma clara, ao final):**

- Produto sem preço, ou com preço zerado/estranho.
- Produto sem categoria, ou categoria sem nenhum produto.
- Dois produtos com o mesmo nome/identificador.
- Foto citada no cardápio que **não existe** em `conteudo/imagens/`.
- Foto na pasta que **nenhum produto usa** (aviso informativo).
- Produto com "escolha o sabor/tamanho" mas **sem a lista de opções**.
- Tamanhos com rótulo repetido ou sem preço.
- WhatsApp em formato inválido (esperado: 55 + DDD + número).
- Horário de funcionamento ausente ou incompleto.
- Cores do tema faltando ou com **contraste ruim** (ex.: texto branco sobre cor clara).
- Fonte que **não existe** no Google Fonts.
- `logo` ausente: apenas informar que será usada a imagem padrão.

Ao final, a IA entrega um resumo em três blocos: **Faltando**, **Suposições que fiz**
e **Fotos não utilizadas**.

> Dica: o `AGENTS.md` é um formato que várias ferramentas de IA leem
> automaticamente. Para as que não lerem, basta dizer "siga o AGENTS.md".
> Isso deve ser confirmado na fase de design.

## 7. Imagens e logo

- Originais em `conteudo/imagens/` (**versionados no Git**), nomes livres (o cardápio
  é quem aponta para eles).
- `npm run images` gera versões WebP leves em `public/menu/` (hoje: largura 900 px,
  qualidade 80; de ~2,5 MB para ~100 KB).
- O nome final é o nome do arquivo sem acento nem espaço
  (`homem de ferro.jpg` → `homem-de-ferro.webp`). O guia da IA explica essa regra
  para ela escrever a referência certa.
- **Logo**: se existir `logo.*` na pasta de imagens, o script a prepara e o site a
  usa no topo. O mecanismo exato de detecção fica para o design.
- **Sem logo**: o site mostra uma marca **neutra**, por exemplo a inicial do nome da
  loja sobre a cor do tema. O mesmo vale para produto sem foto (cor do tema + emoji
  ou inicial), e para a tela de pedido vazio. Nada de coruja no template.

## 8. Tema (cores e fonte)

- Um único arquivo de variáveis alimenta o site inteiro.
- **Restrição técnica importante**: o código usa transparências como
  `border-brand-pink/20` e `bg-brand-violet/10`. Para elas continuarem
  funcionando, as cores precisam ser guardadas em formato de canais RGB, e
  não como `#hex` simples.
- Os nomes das cores no código (`brand-violet`, `brand-pink`) são específicos do
  Madrugadão. No template devem virar nomes neutros (`brand-primary`,
  `brand-secondary`).
- **Fonte**: hoje a fonte (Poppins) é carregada no `layout.tsx` com `next/font`, que
  exige o nome da fonte fixo no código. Por isso a IA, ao gerar a partir do
  `tema.md`, também ajusta essa carga. Funciona com fontes do Google Fonts, que são
  baixadas no build e continuam compatíveis com o export estático.

## 9. O que a base atual tem de específico do Madrugadão

Levantamento feito no código. **Na base do template** estes pontos ficam neutros;
**no projeto do Madrugadão não se mexe em nada**.

**Cores fixas espalhadas**
- `tailwind.config.ts`: paleta `brand.*` e gradientes em hex (`#7c3aed`, `#ec4899`, `#a78bfa`, `#f9a8d4`) e a sombra `shadow-brand` com a cor violeta embutida.
- `#1f1033` (cor do texto) fixo em `layout.tsx`, `globals.css`, `FeaturedBanner.tsx` e 4 pontos do `ProductModal.tsx`.
- `layout.tsx`: `themeColor` do navegador fixo em `#7c3aed`.

**Marca e logo**
- `Header.tsx`: o texto "Madrugadão" / "Lanches" está escrito direto no componente.
- O logo é o componente `OwlLogo` (coruja desenhada em código). O campo `logo` de `config.ts` existe, mas **hoje não é usado por nada**: trocar `public/brand/logo.svg` não muda o site.
- A coruja também é a imagem padrão em 3 lugares: logo do topo, produto sem foto (`ProductImage.tsx`) e tela de pedido vazio (`pedido/page.tsx`).
- `FeaturedBanner.tsx` e `whatsapp.ts` colocam o emoji 🦉 fixo.

**Cardápio**
- `menu.ts` mistura conteúdo e código: o tipo `Category` é uma lista fixa (`"lanches" | "combos" | ...`), e há ajudantes específicos desta loja (`lanche`, `combo`, `prensado`, constante `IMG`, `featuredProduct`).
- `CartContext.tsx`: chave de armazenamento `madrugadao-cart-v2` (deveria vir da loja).

**Imagens**
- `scripts/optimize-images.mjs`: lê `imagens/` (raiz), e a regra de cortar bordas brancas está fixa só para o arquivo `destaque`.

**Pontos que já estão bons**
- `config.ts` já concentra nome, WhatsApp e horários, e o horário "aberto agora" é calculado a partir dele.
- A estrutura de produto (tamanhos, escolhas, adicionais) já é genérica o bastante para outras lanchonetes.

## 10. Decisões em aberto

**C. Cortar bordas brancas de fotos (ex.: destaque).**
Manter a regra "arquivo chamado `destaque`" ou permitir marcar no cardápio?

**F. Script de validação além da IA?**
Pelo combinado, quem avisa é a IA (checklist). Um comando `npm run validar` seria
um reforço opcional, que também ajudaria em ferramentas de IA mais fracas.

**G. Onde o template vive?**
Como o Madrugadão fica intocado e as lojas novas partem do template, é preciso
decidir o formato:
- (a) uma **branch** deste repositório (boa para o teste agora, mas diverge do
  Madrugadão com o tempo e correções precisariam ser copiadas entre elas);
- (b) um **repositório separado** marcado como "template" no GitHub, de onde cada
  loja nova nasce com um clique, com seu próprio deploy no Cloudflare Pages.
Sugestão: testar na branch agora e migrar para (b) quando o template estiver validado.

## 11. Fora do escopo

- Painel administrativo, CMS ou banco de dados.
- Pedidos com backend, pagamento online ou acompanhamento de pedido.
- Várias lojas no mesmo deploy (cada loja continua sendo um deploy próprio).
- Qualquer alteração no site do Madrugadão (visual, coruja, cardápio ou código).

## 12. Ordem sugerida (para decidirmos juntos depois)

1. **Neutralizar a marca e o tema na base do template**: cores em variáveis, nomes neutros, logo e imagem padrão vindos de arquivo, textos fixos saindo do código, fonte configurável.
2. **Reorganizar em `conteudo/`**: cardápio, `tema.md` e imagens; ajustar o script de imagens; incluir a loja de exemplo no lugar do conteúdo do Madrugadão.
3. **Escrever o `AGENTS.md`** com formato dos dados, passos e checklist de validação.
4. **Prova de conceito**: montar uma **loja fictícia** usando só `conteudo/`, sem encostar em `src/`, e conferir que o resultado sai completo e correto.

## 13. Como saberemos que deu certo

- Trocar a pasta `conteudo/` por outra e rodar o fluxo gera um site novo **sem editar nenhum arquivo de `src/`**.
- Remover o `logo.*` faz aparecer a imagem padrão neutra, sem erro.
- Mudar o `tema.md` muda todas as cores e a fonte do site, incluindo transparências e a cor da barra do navegador.
- A IA avisa corretamente um cardápio com preço faltando e uma foto citada que não existe.
- O projeto do Madrugadão continua exatamente como está, sem nenhuma alteração.
