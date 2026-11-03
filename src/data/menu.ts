/**
 * CARDAPIO DO MADRUGADAO LANCHES
 * ---------------------------------------------------------------
 * Esse e o arquivo pra editar o cardapio. Pra trocar depois:
 *  - Mude nome, descricao e preco de cada item.
 *  - Troque "image" pelo caminho da foto real (coloque em /public/menu/).
 *    Enquanto nao tiver foto, deixe "" que aparece um placeholder com gradiente.
 *  - Pra adicionar item, copie um bloco e mude o "id" (tem que ser unico).
 */

export type Category =
  | "lanches"
  | "hotdogs"
  | "porcoes"
  | "bebidas"
  | "combos"
  | "sobremesas";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // em reais
  image: string; // caminho da imagem ou "" pra placeholder
  category: Category;
}

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "combos", label: "Combos", emoji: "🔥" },
  { id: "lanches", label: "Lanches", emoji: "🍔" },
  { id: "hotdogs", label: "Hot Dogs", emoji: "🌭" },
  { id: "porcoes", label: "Porcoes", emoji: "🍟" },
  { id: "bebidas", label: "Bebidas", emoji: "🥤" },
  { id: "sobremesas", label: "Sobremesas", emoji: "🍨" },
];

export const products: Product[] = [
  // ----- COMBOS -----
  {
    id: "combo-coruja",
    name: "Combo Coruja",
    description: "Hamburguer artesanal + batata media + refri lata",
    price: 34.9,
    image: "",
    category: "combos",
  },
  {
    id: "combo-madruga",
    name: "Combo Madruga",
    description: "2 hamburgueres + batata grande + 2 refris",
    price: 59.9,
    image: "",
    category: "combos",
  },

  // ----- LANCHES -----
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: "Pao brioche, burger 150g, queijo, alface e tomate",
    price: 24.9,
    image: "",
    category: "lanches",
  },
  {
    id: "cheddar-bacon",
    name: "Cheddar Bacon",
    description: "Burger 180g, cheddar cremoso, bacon crocante",
    price: 29.9,
    image: "",
    category: "lanches",
  },
  {
    id: "duplo-madrugada",
    name: "Duplo Madrugada",
    description: "2 burgers 150g, queijo duplo, cebola caramelizada",
    price: 32.9,
    image: "",
    category: "lanches",
  },
  {
    id: "frango-crispy",
    name: "Frango Crispy",
    description: "File de frango empanado, maionese da casa, alface",
    price: 26.9,
    image: "",
    category: "lanches",
  },

  // ----- HOT DOGS -----
  {
    id: "dog-simples",
    name: "Dog Simples",
    description: "Salsicha, molho, batata palha e milho",
    price: 14.9,
    image: "",
    category: "hotdogs",
  },
  {
    id: "dog-completo",
    name: "Dog Completo",
    description: "2 salsichas, queijo, bacon, batata palha e molhos",
    price: 19.9,
    image: "",
    category: "hotdogs",
  },

  // ----- PORCOES -----
  {
    id: "batata-frita",
    name: "Batata Frita",
    description: "Porcao de batata frita crocante (serve 2)",
    price: 18.9,
    image: "",
    category: "porcoes",
  },
  {
    id: "batata-cheddar",
    name: "Batata Cheddar e Bacon",
    description: "Batata frita coberta com cheddar e bacon",
    price: 26.9,
    image: "",
    category: "porcoes",
  },
  {
    id: "nuggets",
    name: "Nuggets (10un)",
    description: "10 nuggets de frango com molho a escolha",
    price: 21.9,
    image: "",
    category: "porcoes",
  },

  // ----- BEBIDAS -----
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    description: "Coca, Guarana ou Fanta - 350ml",
    price: 6.9,
    image: "",
    category: "bebidas",
  },
  {
    id: "refri-2l",
    name: "Refrigerante 2L",
    description: "Coca, Guarana ou Fanta - 2 litros",
    price: 14.9,
    image: "",
    category: "bebidas",
  },
  {
    id: "suco",
    name: "Suco Natural",
    description: "Laranja, maracuja ou limao - 500ml",
    price: 9.9,
    image: "",
    category: "bebidas",
  },
  {
    id: "agua",
    name: "Agua Mineral",
    description: "Com ou sem gas - 500ml",
    price: 4.5,
    image: "",
    category: "bebidas",
  },

  // ----- SOBREMESAS -----
  {
    id: "milkshake",
    name: "Milkshake",
    description: "Chocolate, morango ou baunilha - 400ml",
    price: 16.9,
    image: "",
    category: "sobremesas",
  },
  {
    id: "brownie",
    name: "Brownie com Sorvete",
    description: "Brownie quentinho com bola de sorvete",
    price: 18.9,
    image: "",
    category: "sobremesas",
  },
];
