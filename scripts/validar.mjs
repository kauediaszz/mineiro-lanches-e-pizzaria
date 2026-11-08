/**
 * Confere se os dados do site estão completos e coerentes.
 *
 * Uso:  npm run validar
 *
 * Lê os arquivos GERADOS (src/data/*.json e src/theme/font.ts) e as fotos de
 * conteudo/imagens/, e mostra:
 *   ERROS   -> corrija antes de publicar (o comando termina com erro)
 *   AVISOS  -> provavelmente é um problema, vale conferir
 *   INFO    -> só para você saber
 *
 * Não corrige nada sozinho e não inventa dados: só avisa.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { IMAGE_EXTENSIONS, slugify } from "./lib/slug.mjs";

const errors = [];
const warnings = [];
const infos = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const info = (m) => infos.push(m);

const FILES = {
  menu: "src/data/menu.json",
  store: "src/data/store.json",
  theme: "src/data/theme.json",
  manifest: "src/data/images.manifest.json",
  font: "src/theme/font.ts",
  fontData: "node_modules/next/dist/compiled/@next/font/dist/google/font-data.json",
  imagesDir: "conteudo/imagens",
  mdMenu: "conteudo/cardapio.md",
  mdTheme: "conteudo/tema.md",
};

async function readText(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function readJson(file, required = true) {
  const text = await readText(file);
  if (text === null) {
    if (required) err(`${file}: arquivo não encontrado. Peça para a IA gerar (veja o AGENTS.md).`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    err(`${file}: JSON inválido (${e.message}).`);
    return null;
  }
}

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const money = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

/* ------------------------------------------------------------------ */
/* Cores                                                               */
/* ------------------------------------------------------------------ */

function parseHex(hex) {
  if (typeof hex !== "string") return null;
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let v = m[1];
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------ */
/* Loja                                                                */
/* ------------------------------------------------------------------ */

function checkStore(store) {
  if (!store) return;
  if (!isStr(store.name)) err(`${FILES.store}: falta o nome da loja ('name').`);
  if (!/^\d{12,13}$/.test(store.whatsapp ?? "")) {
    err(`${FILES.store}: WhatsApp inválido ("${store.whatsapp}"). Use 55 + DDD + número, só dígitos (ex: 5521999990000).`);
  } else if (!String(store.whatsapp).startsWith("55")) {
    warn(`${FILES.store}: o WhatsApp não começa com 55 (código do Brasil). Confira o número.`);
  }
  if (!isStr(store.slogan)) info("Sem slogan: o banner do topo mostra só o nome da loja.");
  if (!isStr(store.address)) info("Sem endereço: o rodapé não mostra endereço.");
  if (!isStr(store.instagram)) info("Sem Instagram: o rodapé não mostra o link.");
  if (isStr(store.instagram) && /\s/.test(store.instagram.trim())) {
    warn(`${FILES.store}: o Instagram tem espaços ("${store.instagram}"). Use o link ou @usuario.`);
  }

  const schedule = store.hours?.schedule;
  if (!Array.isArray(schedule) || schedule.length === 0) {
    warn(`${FILES.store}: sem horário de funcionamento. O site não mostrará "aberto agora" nem os horários.`);
    return;
  }
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  const daysSeen = new Map();
  schedule.forEach((slot, i) => {
    const where = `${FILES.store}: horário #${i + 1}`;
    if (!Array.isArray(slot.days) || slot.days.length === 0 || !slot.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) {
      err(`${where}: 'days' precisa ser uma lista de números de 0 (domingo) a 6 (sábado).`);
    } else {
      for (const d of slot.days) {
        if (daysSeen.has(d)) warn(`${where}: o dia ${d} já aparece em outro horário (#${daysSeen.get(d)}).`);
        else daysSeen.set(d, i + 1);
      }
    }
    if (!isStr(slot.label)) warn(`${where}: falta o texto do rodapé ('label', ex: "Seg a Sex").`);
    if (!time.test(slot.open ?? "")) err(`${where}: 'open' inválido ("${slot.open}"). Use HH:MM, ex: 18:00.`);
    if (!time.test(slot.close ?? "")) err(`${where}: 'close' inválido ("${slot.close}"). Use HH:MM, ex: 23:30.`);
    if (slot.open && slot.open === slot.close) err(`${where}: abre e fecha no mesmo horário.`);
  });
  if (daysSeen.size === 7) info("A loja abre todos os dias da semana.");
}

/* ------------------------------------------------------------------ */
/* Tema (cores e fonte)                                                */
/* ------------------------------------------------------------------ */

function checkTheme(theme) {
  if (!theme) return;
  const colors = theme.colors ?? {};
  const rgb = {};
  for (const name of ["primary", "secondary", "background", "foreground"]) {
    rgb[name] = parseHex(colors[name]);
    if (!rgb[name]) {
      err(`${FILES.theme}: cor '${name}' ausente ou inválida ("${colors[name] ?? ""}"). Use #RRGGBB. O site usa uma cor padrão no lugar.`);
    }
  }
  const { primary, secondary, background, foreground } = rgb;
  const white = [255, 255, 255];

  // Cada medição só precisa das suas duas cores: uma cor inválida não esconde as outras
  const check = (label, a, b, min, why) => {
    if (!a || !b) return;
    const r = contrast(a, b);
    if (r < min) {
      warn(`Contraste baixo (${r.toFixed(1)}:1, o mínimo recomendado é ${min}:1): ${label}. ${why}`);
    }
  };
  check("texto branco sobre a cor principal", white, primary, 3, "Botões e etiquetas ficam difíceis de ler. Escolha uma cor mais escura.");
  check("texto branco sobre a cor secundária", white, secondary, 3, "O degradê dos botões termina nessa cor. Escolha uma mais escura.");
  check("cor de destaque sobre o fundo", parseHex(colors.accent ?? "#f6e7b4"), background, 3, "Preços e títulos usam a cor de destaque como texto.");
  check("texto sobre o fundo", foreground, background, 4.5, "O texto do site fica difícil de ler.");
}

async function checkFont() {
  const source = await readText(FILES.font);
  if (source === null) {
    err(`${FILES.font}: arquivo não encontrado. Peça para a IA gerar (veja o AGENTS.md).`);
    return;
  }
  const imp = /import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*["']next\/font\/google["']/.exec(source);
  if (!imp) {
    err(`${FILES.font}: não encontrei o import da fonte (import { Nome } from "next/font/google").`);
    return;
  }
  if (!/variable:\s*["']--font-brand["']/.test(source)) {
    err(`${FILES.font}: a fonte precisa de  variable: "--font-brand"  (o Tailwind usa esse nome).`);
  }
  if (!/subsets:\s*\[[^\]]*["']latin["']/.test(source)) {
    warn(`${FILES.font}: sem o subset "latin". Acentos do português podem falhar.`);
  }

  const family = imp[1].replace(/_/g, " ");
  const dataText = await readText(FILES.fontData);
  if (dataText === null) {
    warn("Não consegui conferir a fonte (rode `npm install` primeiro).");
    return;
  }
  const data = JSON.parse(dataText);
  const meta = data[family];
  if (!meta) {
    const similar = Object.keys(data).filter((n) => n.toLowerCase().startsWith(family.toLowerCase().slice(0, 4))).slice(0, 5);
    err(`${FILES.font}: a fonte "${family}" não existe no Google Fonts.${similar.length ? " Parecidas: " + similar.join(", ") + "." : ""}`);
    return;
  }

  const isVariable = meta.weights.includes("variable");
  const listed = /weight:\s*\[([^\]]*)\]/.exec(source);
  const single = /weight:\s*["'](\w+)["']/.exec(source);
  const chosen = listed
    ? listed[1].split(",").map((w) => w.replace(/["'\s]/g, "")).filter(Boolean)
    : single
      ? [single[1]]
      : [];

  if (!isVariable && chosen.length === 0) {
    err(`${FILES.font}: a fonte "${family}" não é variável e exige 'weight'. Pesos disponíveis: ${meta.weights.join(", ")}.`);
  }
  for (const w of chosen) {
    if (!meta.weights.includes(w)) {
      err(`${FILES.font}: a fonte "${family}" não tem o peso ${w}. Pesos disponíveis: ${meta.weights.join(", ")}.`);
    }
  }
  const needed = ["400", "700"];
  if (!isVariable && chosen.length > 0) {
    for (const w of needed) {
      if (!chosen.includes(w)) warn(`${FILES.font}: o site usa texto normal (400) e negrito (700); falta o peso ${w}.`);
    }
    if (!meta.weights.includes("700")) {
      warn(`A fonte "${family}" não tem negrito (700). Títulos e preços ficarão sem destaque. Considere outra fonte.`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Imagens                                                             */
/* ------------------------------------------------------------------ */

async function listImages() {
  try {
    return (await readdir(FILES.imagesDir)).filter((f) => IMAGE_EXTENSIONS.test(f));
  } catch {
    return [];
  }
}

function imageSlug(reference) {
  const base = String(reference)
    .trim()
    .replace(/^.*[\\/]/, "")
    .replace(/\.(jpe?g|png|webp|gif|avif|svg)$/i, "");
  return slugify(base);
}

/* ------------------------------------------------------------------ */
/* Cardápio                                                            */
/* ------------------------------------------------------------------ */

function checkGroup(group, where) {
  if (!isStr(group.title)) err(`${where}: grupo de escolhas sem 'title'.`);
  if (!["single", "multiple"].includes(group.type)) {
    err(`${where}: o grupo "${group.title}" precisa de 'type' "single" ou "multiple".`);
  }
  if (!Array.isArray(group.options) || group.options.length === 0) {
    err(`${where}: o grupo "${group.title}" não tem opções para escolher.`);
    return;
  }
  const seen = new Set();
  for (const o of group.options) {
    if (!isStr(o)) err(`${where}: o grupo "${group.title}" tem uma opção vazia.`);
    else if (seen.has(o.toLowerCase())) warn(`${where}: a opção "${o}" aparece duas vezes em "${group.title}".`);
    else seen.add(o.toLowerCase());
  }
  if (group.type === "single" && group.options.length < 2) {
    warn(`${where}: "${group.title}" é de escolher 1, mas só tem 1 opção.`);
  }
  if (group.max !== undefined) {
    if (group.type !== "multiple") warn(`${where}: 'max' em "${group.title}" só vale para escolha múltipla.`);
    else if (!Number.isInteger(group.max) || group.max < 1) err(`${where}: 'max' de "${group.title}" precisa ser um número inteiro maior que 0.`);
    else if (group.max > group.options.length) warn(`${where}: 'max' (${group.max}) de "${group.title}" é maior que o número de opções (${group.options.length}).`);
  }
}

function checkAddons(list, where) {
  if (!Array.isArray(list) || list.length === 0) {
    err(`${where}: lista de adicionais vazia.`);
    return;
  }
  const seen = new Set();
  for (const a of list) {
    if (!isStr(a.label)) err(`${where}: adicional sem nome ('label').`);
    if (!isNum(a.price) || a.price <= 0) err(`${where}: o adicional "${a.label}" está sem preço válido.`);
    const key = (a.id ?? slugify(a.label ?? "")).toLowerCase();
    if (seen.has(key)) warn(`${where}: o adicional "${a.label}" aparece duas vezes.`);
    seen.add(key);
  }
}

function checkMenu(menu, manifest, imageFiles) {
  if (!menu) return { used: new Set(), productCount: 0, categoryCount: 0 };

  const categories = Array.isArray(menu.categories) ? menu.categories : [];
  const products = Array.isArray(menu.products) ? menu.products : [];
  if (categories.length === 0) err(`${FILES.menu}: o cardápio não tem categorias ('categories').`);
  if (products.length === 0) err(`${FILES.menu}: o cardápio não tem produtos ('products').`);

  const categoryIds = new Set();
  for (const c of categories) {
    if (!isStr(c.id)) err(`${FILES.menu}: categoria sem 'id'.`);
    else if (categoryIds.has(c.id)) err(`${FILES.menu}: categoria "${c.id}" repetida.`);
    else categoryIds.add(c.id);
    if (!isStr(c.label)) err(`${FILES.menu}: a categoria "${c.id}" está sem nome ('label').`);
  }

  const addonSets = menu.addonSets ?? {};
  const optionSets = menu.optionSets ?? {};
  for (const [name, list] of Object.entries(addonSets)) checkAddons(list, `${FILES.menu}: conjunto de adicionais "${name}"`);
  for (const [name, group] of Object.entries(optionSets)) checkGroup({ title: group.title ?? name, ...group }, `${FILES.menu}: conjunto de escolhas "${name}"`);

  const ids = new Set();
  const names = new Map();
  const perCategory = new Map();
  const used = new Set();
  const withoutPhoto = [];
  const missingPhotos = new Map(); // arquivo -> produtos

  for (const p of products) {
    const label = `"${p.name ?? p.id}"`;
    const where = `Produto ${label}`;

    if (!isStr(p.id)) err(`${where}: sem 'id'.`);
    else if (ids.has(p.id)) err(`${where}: o id "${p.id}" está repetido.`);
    else ids.add(p.id);
    if (isStr(p.id) && /[^a-z0-9-]/.test(p.id)) warn(`${where}: o id "${p.id}" deveria ter só letras minúsculas, números e hífen.`);

    if (!isStr(p.name)) err(`${where}: sem nome.`);
    else {
      const key = p.name.trim().toLowerCase();
      if (names.has(key)) warn(`${where}: já existe outro produto com o mesmo nome (${names.get(key)}).`);
      else names.set(key, p.id);
    }

    if (!categoryIds.has(p.category)) {
      err(`${where}: está na categoria "${p.category}", que não existe.`);
    } else {
      perCategory.set(p.category, (perCategory.get(p.category) ?? 0) + 1);
    }

    if (!isStr(p.description)) warn(`${where}: sem descrição/ingredientes.`);

    // preço
    const hasPrice = p.price !== undefined;
    const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
    if (hasPrice === hasVariants) {
      err(`${where}: precisa de 'price' OU de 'variants' (exatamente um dos dois).`);
    } else if (hasPrice) {
      if (!isNum(p.price) || p.price <= 0) err(`${where}: preço inválido (${p.price}).`);
      else if (p.price > 1000) warn(`${where}: preço muito alto (${money(p.price)}). Confira.`);
    } else {
      const labels = new Set();
      for (const v of p.variants) {
        if (!isNum(v.price) || v.price <= 0) err(`${where}: o tamanho/versão "${v.label ?? ""}" está sem preço válido.`);
        else if (v.price > 1000) warn(`${where}: "${v.label}" custa ${money(v.price)}. Confira.`);
        const l = (v.label ?? "").trim().toLowerCase();
        if (p.variants.length > 1 && !l) err(`${where}: com mais de um preço, cada um precisa de nome ('label').`);
        else if (labels.has(l)) err(`${where}: dois tamanhos/versões com o mesmo nome ("${v.label}").`);
        labels.add(l);
      }
      if (p.variants.length === 1) warn(`${where}: tem 'variants' com um item só. Use 'price'.`);
    }

    // escolhas
    for (const g of p.optionGroups ?? []) {
      if (typeof g === "string") {
        if (!optionSets[g]) err(`${where}: usa o conjunto de escolhas "${g}", que não existe em 'optionSets'.`);
      } else {
        checkGroup(g, where);
      }
    }

    // adicionais
    if (typeof p.addons === "string") {
      if (!addonSets[p.addons]) err(`${where}: usa o conjunto de adicionais "${p.addons}", que não existe em 'addonSets'.`);
    } else if (p.addons !== undefined) {
      checkAddons(p.addons, where);
    }

    // foto
    if (p.image) {
      const slug = imageSlug(p.image);
      if (manifest?.images?.[slug]) used.add(slug);
      else {
        if (!missingPhotos.has(p.image)) missingPhotos.set(p.image, []);
        missingPhotos.get(p.image).push(p.name ?? p.id);
      }
    } else {
      withoutPhoto.push(p.name ?? p.id);
    }
  }

  for (const [file, list] of missingPhotos) {
    err(`Foto "${file}" citada no cardápio mas NÃO encontrada em ${FILES.imagesDir}/ (usada em: ${list.slice(0, 4).join(", ")}${list.length > 4 ? "..." : ""}). Coloque o arquivo na pasta e rode \`npm run images\`.`);
  }

  for (const c of categories) {
    if (!perCategory.get(c.id)) warn(`A categoria "${c.label}" não tem nenhum produto.`);
  }

  // destaque
  if (menu.featured) {
    if (!ids.has(menu.featured.product)) err(`${FILES.menu}: o destaque aponta para "${menu.featured.product}", que não existe.`);
    if (menu.featured.image) {
      const slug = imageSlug(menu.featured.image);
      if (manifest?.images?.[slug]) used.add(slug);
      else err(`Foto do destaque "${menu.featured.image}" não encontrada em ${FILES.imagesDir}/.`);
    } else {
      const product = products.find((p) => p.id === menu.featured.product);
      if (product?.image) used.add(imageSlug(product.image));
    }
    if (!isStr(menu.featured.tagline)) info("O destaque está sem frase ('tagline').");
  } else {
    info("Sem produto em destaque: a home mostra só o aviso da loja.");
  }

  if (withoutPhoto.length > 0) {
    info(`${withoutPhoto.length} produto(s) sem foto (usam o placeholder): ${withoutPhoto.slice(0, 8).join(", ")}${withoutPhoto.length > 8 ? "..." : ""}.`);
  }

  return { used, productCount: products.length, categoryCount: categories.length };
}

/* ------------------------------------------------------------------ */
/* Execução                                                            */
/* ------------------------------------------------------------------ */

const [menu, store, theme, manifest] = await Promise.all([
  readJson(FILES.menu),
  readJson(FILES.store),
  readJson(FILES.theme),
  readJson(FILES.manifest, false),
]);
if (!manifest) {
  warn(`${FILES.manifest} não existe. Rode \`npm run images\`.`);
}

const imageFiles = await listImages();
const { used, productCount, categoryCount } = checkMenu(menu, manifest, imageFiles);

checkStore(store);
checkTheme(theme);
await checkFont();

// fotos na pasta x manifest
if (manifest) {
  const inManifest = new Set([...Object.keys(manifest.images ?? {}), ...(manifest.logo ? ["logo"] : [])]);
  const notProcessed = imageFiles.filter((f) => !inManifest.has(slugify(path.parse(f).name.trim())));
  if (notProcessed.length > 0) {
    warn(`Imagens novas em ${FILES.imagesDir}/ que ainda não foram otimizadas: ${notProcessed.join(", ")}. Rode \`npm run images\`.`);
  }
  const unused = Object.keys(manifest.images ?? {}).filter((s) => !used.has(s));
  if (unused.length > 0) {
    info(`${unused.length} foto(s) na pasta que nenhum produto usa: ${unused.join(", ")}.`);
  }
  if (!manifest.logo) info("Sem logo (conteudo/imagens/logo.*): o site usa a inicial do nome da loja.");
}

// texto escrito x arquivos gerados
async function newerThan(source, targets) {
  try {
    const s = await stat(source);
    for (const t of targets) {
      try {
        const g = await stat(t);
        if (s.mtimeMs - g.mtimeMs > 5000) return t;
      } catch {
        /* alvo inexistente: já reportado em outro lugar */
      }
    }
  } catch {
    return null;
  }
  return null;
}
if ((await readText(FILES.mdMenu)) === null) {
  warn(`${FILES.mdMenu} não existe: sem o cardápio escrito não dá para regenerar o menu.json.`);
} else {
  const stale = await newerThan(FILES.mdMenu, [FILES.menu]);
  if (stale) warn(`${FILES.mdMenu} foi alterado depois de ${stale}. Peça para a IA regenerar os dados.`);
}
if ((await readText(FILES.mdTheme)) === null) {
  warn(`${FILES.mdTheme} não existe: sem o tema escrito não dá para regenerar loja, cores e fonte.`);
} else {
  const stale = await newerThan(FILES.mdTheme, [FILES.store, FILES.theme, FILES.font]);
  if (stale) warn(`${FILES.mdTheme} foi alterado depois de ${stale}. Peça para a IA regenerar os dados.`);
}

/* ---------- relatório ---------- */
console.log("\nVALIDAÇÃO DO SITE");
console.log("=================");
console.log(
  `Loja: ${store?.name ?? "?"} | Categorias: ${categoryCount} | Produtos: ${productCount} | Fotos: ${Object.keys(manifest?.images ?? {}).length} | Logo: ${manifest?.logo ? "sim" : "não"}\n`
);

const print = (title, icon, list) => {
  if (list.length === 0) return;
  console.log(`${title} (${list.length})`);
  for (const m of list) console.log(`  ${icon} ${m}`);
  console.log("");
};
print("ERROS - corrija antes de publicar", "✖", errors);
print("AVISOS - vale conferir", "⚠", warnings);
print("INFORMAÇÕES", "ℹ", infos);

if (errors.length === 0 && warnings.length === 0) console.log("Tudo certo: nenhum erro e nenhum aviso.\n");
else if (errors.length === 0) console.log("Sem erros. Confira os avisos acima.\n");

process.exit(errors.length > 0 ? 1 : 0);
