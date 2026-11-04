/**
 * CARDÁPIO DO MADRUGADÃO LANCHES
 * ---------------------------------------------------------------
 * Esse é o arquivo pra editar o cardápio.
 *
 * Como cada produto funciona:
 *  - variants     -> tamanhos/opções com preço (ex: "250 ml", "Só o lanche" / "Combo").
 *                    Produto com um preço só usa single(preço).
 *  - optionGroups -> escolhas sem custo (sabores, caldas, salsicha ou linguiça...).
 *  - addons       -> adicionais pagos (bacon, ovo, queijo...).
 *  - image        -> foto em /public/menu/ (rode "npm run images" depois de colocar
 *                    as fotos originais em /imagens). Deixe "" pra usar o placeholder.
 *  - emoji        -> usado no lugar da foto quando não tem imagem (opcional).
 *  - section      -> subtítulo dentro da categoria (opcional).
 *
 * Pra adicionar um produto: copie um bloco parecido e troque o "id" (único).
 */

export type Category = "lanches" | "combos" | "prensados" | "porcoes" | "acai";

export interface Variant {
  id: string;
  label: string; // vazio quando o produto só tem um preço
  price: number; // em reais
}

export interface Addon {
  id: string;
  label: string;
  price: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  type: "single" | "multiple";
  required?: boolean; // single: precisa escolher 1 / multiple: pelo menos 1
  max?: number; // só pra "multiple": limite de escolhas
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string; // caminho da imagem ou "" pra placeholder
  emoji?: string;
  category: Category;
  section?: string;
  variants: Variant[];
  optionGroups?: OptionGroup[];
  addons?: Addon[];
}

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "lanches", label: "Lanches", emoji: "🍔" },
  { id: "combos", label: "Combos", emoji: "🔥" },
  { id: "prensados", label: "Prensados", emoji: "🌭" },
  { id: "porcoes", label: "Porções", emoji: "🍟" },
  { id: "acai", label: "Açaí e Sorvetes", emoji: "🍨" },
];

/* ------------------------------------------------------------------ */
/* Ajudantes pra escrever o cardápio com menos repetição               */
/* ------------------------------------------------------------------ */

const single = (price: number): Variant[] => [
  { id: "unico", label: "", price },
];

/** Cria variantes a partir de pares [texto, preço]. O id vem do texto. */
const sizes = (list: [string, number][]): Variant[] =>
  list.map(([label, price]) => ({
    id: label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    label,
    price,
  }));

/** Adicionais disponíveis para hambúrgueres */
const burgerAddons: Addon[] = [
  { id: "hamburguer-comum", label: "Hambúrguer comum", price: 3 },
  { id: "hamburguer-picanha", label: "Hambúrguer de picanha", price: 5 },
  { id: "hamburguer-frango", label: "Hambúrguer de frango", price: 5 },
  { id: "bacon", label: "Bacon", price: 3 },
  { id: "calabresa", label: "Calabresa", price: 3 },
  { id: "ovo", label: "Ovo", price: 2 },
  { id: "polenguinho", label: "Polenguinho", price: 2 },
  { id: "cheddar-fatiado", label: "Cheddar fatiado", price: 2 },
  { id: "cheddar-pastoso", label: "Cheddar pastoso", price: 3 },
  { id: "catupiry-pastoso", label: "Catupiry pastoso", price: 3 },
];

/* ------------------------------------------------------------------ */
/* Fotos (nomes dos arquivos em /public/menu)                          */
/* ------------------------------------------------------------------ */

const IMG = {
  destaque: "/menu/destaque.webp",
  aranhaCapitaoBatman: "/menu/homemaranha-capitao-america-e-batman.webp",
  wolverine: "/menu/wolverine.webp",
  homemDeFerro: "/menu/homem-de-ferro.webp",
  demolidor: "/menu/demolidor.webp",
  hulkMagneto: "/menu/hulk-e-magneto.webp",
  frango: "/menu/alerquina-mulher-gato-tempestade-e-vampira.webp",
  maravilhaPantera: "/menu/mulher-maravilha-e-pantera-negra.webp",
  flashLanterna: "/menu/flash-e-lanterna-verde.webp",
  acai: "/menu/acai.webp",
};

/* ------------------------------------------------------------------ */
/* LANCHES                                                             */
/* ------------------------------------------------------------------ */

const lanche = (
  id: string,
  name: string,
  price: number,
  comboPrice: number,
  description: string,
  image: string,
  section: string
): Product => ({
  id,
  name,
  description,
  image,
  category: "lanches",
  section,
  variants: [
    { id: "lanche", label: "Só o lanche", price },
    { id: "combo", label: "Combo com batata e Guaracamp", price: comboPrice },
  ],
  addons: burgerAddons,
});

/** Destaque da home (também aparece no topo de Lanches) */
export const featuredProduct: Product = {
  id: "destaque-costela",
  name: "Hambúrguer de Costela",
  description:
    "Pão, carne de costela (200 g), ovo, bacon, calabresa, cheddar, molho especial e salada.",
  image: IMG.destaque,
  category: "lanches",
  section: "Destaque da casa",
  variants: single(25),
  addons: burgerAddons,
};

export const featuredTagline = "Hambúrguer de costela de 200 g";

const lanches: Product[] = [
  featuredProduct,

  // ----- Hambúrguer de carne -----
  lanche(
    "homem-aranha",
    "Homem-Aranha",
    6,
    11,
    "Pão, carne, cheddar, salada e molho especial.",
    IMG.aranhaCapitaoBatman,
    "Hambúrguer de carne"
  ),
  lanche(
    "capitao-america",
    "Capitão América",
    8,
    12,
    "Pão, carne, cheddar, polenguinho, salada e molho especial.",
    IMG.aranhaCapitaoBatman,
    "Hambúrguer de carne"
  ),
  lanche(
    "batman",
    "Batman",
    13,
    16,
    "Pão, carne, bacon, cheddar, polenguinho, salada, ovo e molho especial.",
    IMG.aranhaCapitaoBatman,
    "Hambúrguer de carne"
  ),
  lanche(
    "wolverine",
    "Wolverine",
    13,
    16,
    "Pão, 2 carnes, bacon, cheddar, polenguinho, salada e molho especial.",
    IMG.wolverine,
    "Hambúrguer de carne"
  ),
  lanche(
    "homem-de-ferro",
    "Homem de Ferro",
    19,
    22,
    "Pão, 2 carnes, 2 ovos, bacon, cheddar, polenguinho, salada e molho especial.",
    IMG.homemDeFerro,
    "Hambúrguer de carne"
  ),
  lanche(
    "demolidor",
    "Demolidor",
    23,
    26,
    "Pão, 3 carnes, 3 ovos, bacon, cheddar, polenguinho, salada e molho especial.",
    IMG.demolidor,
    "Hambúrguer de carne"
  ),
  lanche(
    "hulk",
    "Hulk",
    27,
    30,
    "Pão, 4 carnes, 4 ovos, bacon, calabresa, cheddar, salada, polenguinho e molho especial.",
    IMG.hulkMagneto,
    "Hambúrguer de carne"
  ),
  lanche(
    "magneto",
    "Magneto",
    36,
    40,
    "Pão, 6 carnes, 6 ovos, 3 cheddar, bacon, calabresa, polenguinho, salada e molho especial.",
    IMG.hulkMagneto,
    "Hambúrguer de carne"
  ),

  // ----- Hambúrguer de frango -----
  lanche(
    "arlequina",
    "Arlequina",
    15,
    18,
    "Pão, empanado de frango, cheddar, salada e molho especial.",
    IMG.frango,
    "Hambúrguer de frango"
  ),
  lanche(
    "mulher-gato",
    "Mulher-Gato",
    18,
    20,
    "Pão, 2 empanados de frango, cheddar, salada e molho especial.",
    IMG.frango,
    "Hambúrguer de frango"
  ),
  lanche(
    "tempestade",
    "Tempestade",
    22,
    25,
    "Pão, 1 empanado de frango, 1 ovo, bacon, salada, cheddar e molho especial.",
    IMG.frango,
    "Hambúrguer de frango"
  ),
  lanche(
    "vampira",
    "Vampira",
    26,
    29,
    "Pão, 2 empanados de frango, 2 ovos, bacon, cheddar, salada e molho especial.",
    IMG.frango,
    "Hambúrguer de frango"
  ),

  // ----- Hambúrguer de picanha -----
  lanche(
    "mulher-maravilha",
    "Mulher-Maravilha",
    14,
    18,
    "Pão, carne de picanha, cheddar, polenguinho, bacon, salada e molho especial.",
    IMG.maravilhaPantera,
    "Hambúrguer de picanha"
  ),
  lanche(
    "pantera-negra",
    "Pantera Negra",
    18,
    21,
    "Pão, carne de picanha, ovo, bacon, cheddar, polenguinho, salada e molho especial.",
    IMG.maravilhaPantera,
    "Hambúrguer de picanha"
  ),
  lanche(
    "lanterna-verde",
    "Lanterna Verde",
    24,
    28,
    "Pão, 2 carnes de picanha, 2 ovos, bacon, cheddar, polenguinho, salada e molho especial.",
    IMG.flashLanterna,
    "Hambúrguer de picanha"
  ),
  lanche(
    "the-flash",
    "The Flash",
    27,
    30,
    "Pão, 2 carnes de picanha, 2 ovos, bacon, cheddar, polenguinho, calabresa, salada e molho especial.",
    IMG.flashLanterna,
    "Hambúrguer de picanha"
  ),
  // 🔧 Robin e Aço ainda estão sem foto
  lanche(
    "robin",
    "Robin",
    32,
    35,
    "Pão, 3 carnes de picanha, 3 ovos, bacon, polenguinho, salada e molho especial.",
    "",
    "Hambúrguer de picanha"
  ),
  lanche(
    "aco",
    "Aço",
    37,
    41,
    "Pão, 4 carnes de picanha, 4 ovos, bacon, 2 cheddar, calabresa, polenguinho, salada e molho especial.",
    "",
    "Hambúrguer de picanha"
  ),

  // ----- X-Burgers -----
  {
    id: "x-picanha",
    name: "X-Picanha",
    description: "Picanha, cheddar e Catupiry.",
    image: "",
    emoji: "🍔",
    category: "lanches",
    section: "X-Burgers",
    variants: single(23),
    addons: burgerAddons,
  },
  {
    id: "x-picanha-bacon",
    name: "X-Picanha com Bacon",
    description: "Picanha, bacon, cheddar e Catupiry.",
    image: "",
    emoji: "🍔",
    category: "lanches",
    section: "X-Burgers",
    variants: single(25),
    addons: burgerAddons,
  },
  {
    id: "x-madrugadao",
    name: "X-Madrugadão",
    description: "Frango, bacon, calabresa, picanha, cheddar e Catupiry.",
    image: "",
    emoji: "🍔",
    category: "lanches",
    section: "X-Burgers",
    variants: single(28),
    addons: burgerAddons,
  },
  {
    id: "x-corujao",
    name: "X-Corujão",
    description:
      "Frango, bacon, calabresa, picanha, carne seca, cheddar e Catupiry.",
    image: "",
    emoji: "🦉",
    category: "lanches",
    section: "X-Burgers",
    variants: single(31),
    addons: burgerAddons,
  },
];

/* ------------------------------------------------------------------ */
/* COMBOS (casal e família)                                            */
/* ------------------------------------------------------------------ */

const combo = (
  id: string,
  name: string,
  price: number,
  contents: string,
  section: string
): Product => ({
  id,
  name,
  description: `${contents} Feitos com cheddar e Catupiry pastoso. Inclui 1 Convenção de 2 litros grátis.`,
  image: "",
  emoji: "🔥",
  category: "combos",
  section,
  variants: single(price),
});

const combos: Product[] = [
  combo("combo-casal-1", "Combo Casal 1", 43, "2 Batman, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-2", "Combo Casal 2", 57, "2 Demolidores, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-3", "Combo Casal 3", 45, "2 Mulheres-Maravilha, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-4", "Combo Casal 4", 50, "2 Panteras Negras, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-5", "Combo Casal 5", 55, "2 Tempestades, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-6", "Combo Casal 6", 65, "2 The Flash, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-7", "Combo Casal 7", 51, "3 Batman, batata frita, nuggets e molho especial.", "Combo casal"),
  combo("combo-casal-8", "Combo Casal 8", 95, "3 Lanternas Verdes, batata frita, nuggets e molho especial.", "Combo casal"),

  combo("combo-familia", "Combo Família", 70, "4 X-Tudo, batata frita, nuggets, calabresa e molho especial.", "Combo família"),
  combo("combo-familhao", "Combo Familhão", 90, "6 X-Tudo, batata frita, nuggets, calabresa e molho especial.", "Combo família"),
  combo("combo-coringa", "Combo Coringa", 102, "8 X-Tudo, batata frita, nuggets, calabresa e molho especial.", "Combo família"),
  combo("combo-madrugadao", "Combo Madrugadão", 125, "10 X-Tudo, batata frita, nuggets, calabresa e frango à passarinho.", "Combo família"),
];

/* ------------------------------------------------------------------ */
/* PRENSADOS (cachorro-quente prensado)                                */
/* ------------------------------------------------------------------ */

const sausageChoice: OptionGroup = {
  id: "salsicha",
  title: "Salsicha ou linguiça?",
  type: "single",
  required: true,
  options: ["Salsicha", "Linguiça"],
};

const cheeseChoice: OptionGroup = {
  id: "queijo",
  title: "Catupiry ou Cheddar?",
  type: "single",
  required: true,
  options: ["Catupiry", "Cheddar"],
};

const prensado = (
  id: string,
  filling: string,
  price: number,
  opts: { chooseCheese?: boolean; name?: string; text?: string } = {}
): Product => ({
  id: `prensado-${id}`,
  name: opts.name ?? `Prensado de ${filling}`,
  description: `${
    opts.text ?? (opts.chooseCheese ? `${filling} com Catupiry ou Cheddar` : filling)
  }. Leva maionese, ketchup, milho, batata e cebola.`,
  image: "",
  emoji: "🌭",
  category: "prensados",
  variants: single(price),
  optionGroups: opts.chooseCheese
    ? [sausageChoice, cheeseChoice]
    : [sausageChoice],
});

const prensados: Product[] = [
  prensado("catupiry", "Catupiry", 15),
  prensado("cheddar", "Cheddar", 15),
  prensado("frango", "Frango", 18, { chooseCheese: true }),
  prensado("bacon", "Bacon", 18, { chooseCheese: true }),
  prensado("calabresa", "Calabresa", 18, { chooseCheese: true }),
  prensado("carne-moida", "Carne moída", 18, { chooseCheese: true }),
  prensado("frango-bacon", "Frango com bacon", 20),
  prensado("frango-calabresa", "Frango com calabresa", 20),
  prensado("bacon-calabresa", "Bacon com calabresa", 20),
  prensado("carne-moida-bacon", "Carne moída com bacon", 20),
  prensado("carne-seca", "Carne seca", 20, { chooseCheese: true }),
  prensado("picanha-suina", "Picanha suína", 20, { chooseCheese: true }),
  prensado("carne-assada", "Carne assada", 20, { chooseCheese: true }),
  prensado("coracao", "Coração", 20, {
    text: "Coração com Catupiry e Cheddar",
  }),
  prensado("carne-seca-bacon", "Carne seca com bacon", 22),
  prensado("picanha-suina-bacon", "Picanha suína com bacon", 22),
  prensado("carne-assada-bacon", "Carne assada com bacon", 22),
  prensado("coracao-bacon", "Coração com bacon", 22),
  prensado("completao", "Completão", 23, {
    name: "Prensado Completão",
    text: "Frango, calabresa, bacon, Catupiry e Cheddar",
  }),
];

/* ------------------------------------------------------------------ */
/* PORÇÕES                                                             */
/* ------------------------------------------------------------------ */

const porcao = (
  id: string,
  name: string,
  price: number,
  description: string,
  section: string,
  emoji = "🍟"
): Product => ({
  id,
  name,
  description,
  image: "",
  emoji,
  category: "porcoes",
  section,
  variants: single(price),
});

const porcoes: Product[] = [
  {
    id: "aipim-frito",
    name: "Aipim Frito",
    description: "Porção de aipim frito. Escolha o acompanhamento.",
    image: "",
    emoji: "🍟",
    category: "porcoes",
    section: "Aipim frito",
    variants: sizes([
      ["Simples", 13],
      ["Com calabresa", 23],
      ["Com bacon", 25],
      ["Com bacon e calabresa", 28],
    ]),
  },

  porcao("nuggets", "Nuggets (10 unidades)", 12, "10 nuggets de frango.", "Porções", "🍗"),
  porcao("frango-passarinho", "Frango à Passarinho", 31, "Frango à passarinho com alho torrado.", "Porções", "🍗"),
  porcao("costelinha", "Costelinha Suína", 41, "Porção de costelinha suína.", "Porções", "🍖"),
  porcao("carne-seca-batata", "Carne Seca com Batata", 39, "Carne seca com batata frita, cheddar e Catupiry.", "Porções", "🍖"),
  porcao("carne-seca-aipim", "Carne Seca com Aipim", 39, "Carne seca com aipim frito.", "Porções", "🍖"),
  porcao("isca-frango", "Isca de Frango", 39, "Isca de frango com alho torrado.", "Porções", "🍗"),

  {
    id: "batata-frita",
    name: "Batata Frita",
    description: "Batata frita crocante. Escolha o tamanho ou o acompanhamento.",
    image: "",
    emoji: "🍟",
    category: "porcoes",
    section: "Batata frita",
    variants: sizes([
      ["Saquinho", 5],
      ["Média", 13],
      ["Grande", 15],
      ["Com cheddar e Catupiry", 18],
      ["Com calabresa, cheddar e Catupiry", 24],
      ["Com bacon, cheddar e Catupiry", 26],
      ["Com bacon, calabresa, cheddar e Catupiry", 28],
    ]),
  },
  porcao(
    "batata-maluca",
    "Batata Maluca (25 cm)",
    51,
    "Bacon, calabresa, frango à passarinho, azeitona, queijo ralado, alho torrado, cheddar e Catupiry.",
    "Batata frita"
  ),

  porcao(
    "caixa-petisco-25",
    "Caixa de Petisco (25 cm)",
    72,
    "Batata frita, alho torrado, costelinha suína, nuggets, frango à passarinho, calabresa acebolada, molho especial, cheddar e Catupiry.",
    "Caixas de petisco",
    "📦"
  ),
  porcao(
    "caixa-petisco-30",
    "Caixa de Petisco (30 cm)",
    98,
    "Aipim frito com carne seca, batata frita, alho torrado, costelinha suína, nuggets, frango à passarinho, calabresa acebolada, molho especial, queijo ralado, cheddar, Catupiry e azeitona.",
    "Caixas de petisco",
    "📦"
  ),
];

/* ------------------------------------------------------------------ */
/* AÇAÍ E SORVETES                                                     */
/* ------------------------------------------------------------------ */

const acaiFlavor: OptionGroup = {
  id: "sabor-acai",
  title: "Sabor do açaí",
  type: "single",
  required: true,
  options: ["Banana", "Morango"],
};

const iceCreamFlavors: OptionGroup = {
  id: "sabor-sorvete",
  title: "Sabores do sorvete",
  type: "multiple",
  required: true,
  options: [
    "Bombom de morango",
    "Ninho trufado",
    "Pavê italiano",
    "Kinder ovo",
    "Blue ice",
    "Chocolate",
    "Chocolate branco",
    "Flocos",
    "Torta de limão",
    "Mousse de maracujá",
    "Coco",
    "Uva",
    "Abacaxi",
    "Passas rum",
    "Morango",
  ],
};

const syrups: OptionGroup = {
  id: "caldas",
  title: "Caldas",
  type: "multiple",
  options: [
    "Morango",
    "Chocolate",
    "Uva",
    "Abacaxi",
    "Blue ice",
    "Menta",
    "Doce de leite",
    "Tutti frutti",
    "Leite condensado",
    "Banana caramelada",
    "Açaí",
    "Amora",
    "Chocolate branco",
    "Kiwi",
    "Caramelo",
    "Pistache",
  ],
};

const toppings: OptionGroup = {
  id: "condimentos",
  title: "Condimentos",
  type: "multiple",
  options: [
    "Granulado",
    "Granulado colorido",
    "Chocobool",
    "Sucrilhos",
    "Amendoim",
    "Paçoca",
    "Flocos de arroz",
    "Aveia",
    "Leite em pó",
    "Jujuba",
    "Confete",
  ],
};

const acai: Product[] = [
  {
    id: "acai",
    name: "Açaí",
    description: "Escolha o tamanho e o sabor. Capriche nas caldas e condimentos.",
    image: IMG.acai,
    emoji: "🍇",
    category: "acai",
    variants: sizes([
      ["250 ml", 9],
      ["300 ml", 11],
      ["400 ml", 13],
      ["500 ml", 16],
      ["770 ml", 21],
      ["1 litro", 27],
    ]),
    optionGroups: [acaiFlavor, syrups, toppings],
  },
  {
    id: "acai-com-sorvete",
    name: "Açaí com Sorvete",
    description: "Açaí com sorvete à sua escolha, caldas e condimentos.",
    image: IMG.acai,
    emoji: "🍨",
    category: "acai",
    variants: sizes([
      ["250 ml", 13],
      ["300 ml", 14],
      ["400 ml", 16],
      ["500 ml", 19],
      ["770 ml", 24],
      ["1 litro", 29],
    ]),
    optionGroups: [acaiFlavor, iceCreamFlavors, syrups, toppings],
  },
  {
    id: "casquinha-2-bolas",
    name: "Casquinha com 2 Bolas",
    description: "Casquinha crocante com duas bolas de sorvete.",
    image: "",
    emoji: "🍦",
    category: "acai",
    variants: single(7),
    optionGroups: [{ ...iceCreamFlavors, title: "Sabores (até 2)", max: 2 }],
  },
  {
    id: "casquinha-nutella",
    name: "Casquinha Recheada com Nutella",
    description: "Casquinha recheada com Nutella.",
    image: "",
    emoji: "🍦",
    category: "acai",
    variants: single(8),
  },
  {
    id: "picole-big",
    name: "Picolé Big",
    description: "Picolé grande. Escolha o sabor.",
    image: "",
    emoji: "🍧",
    category: "acai",
    section: "Picolés",
    variants: single(6),
    optionGroups: [
      {
        id: "sabor",
        title: "Sabor",
        type: "single",
        required: true,
        options: [
          "Avelã",
          "Brigadeiro",
          "Doce de leite",
          "Pé de moleque",
          "Torta de limão",
          "Chocolate branco",
          "Coco",
          "Cookie",
          "Creme",
          "Morango",
          "Malte",
        ],
      },
    ],
  },
  {
    id: "picole-fruta",
    name: "Picolé da Fruta",
    description: "Picolé da fruta. Escolha o sabor.",
    image: "",
    emoji: "🍓",
    category: "acai",
    section: "Picolés",
    variants: single(3),
    optionGroups: [
      {
        id: "sabor",
        title: "Sabor",
        type: "single",
        required: true,
        options: [
          "Abacaxi",
          "Amendoim",
          "Banana",
          "Blue ice",
          "Chocolate",
          "Chocolate branco",
          "Coco",
          "Creme",
          "Flocos",
          "Limão",
          "Leite condensado",
          "Manga",
          "Maracujá",
          "Milho verde",
          "Morango",
          "Uva",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */

export const products: Product[] = [
  ...lanches,
  ...combos,
  ...prensados,
  ...porcoes,
  ...acai,
];
