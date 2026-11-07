/**
 * Otimiza as imagens de "conteudo/imagens/" e prepara tudo para o site.
 *
 * Uso:  npm run images
 *
 * O que ele faz:
 *  - Fotos de produtos (.jpg, .jpeg, .png, .webp):
 *      conteudo/imagens/homem de ferro.jpg  ->  public/menu/homem-de-ferro.webp
 *      (reduz para 900px de largura; fundo transparente vira branco)
 *  - Logo (arquivo chamado "logo", em qualquer formato):
 *      conteudo/imagens/logo.png  ->  public/brand/logo.webp  (mantém transparência)
 *      conteudo/imagens/logo.svg  ->  public/brand/logo.svg
 *  - Corta as bordas brancas de fotos chamadas "destaque" (ou "destaque-algo").
 *  - Escreve src/data/images.manifest.json: o mapa que o site usa para achar
 *    cada foto e saber se a loja tem logo.
 *
 * Ele REGENERA tudo do zero: arquivos antigos de public/menu e do logo são apagados.
 * Não coloque arquivos seus em public/menu.
 */
import sharp from "sharp";
import { mkdir, readdir, rm, rmdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { IMAGE_EXTENSIONS, slugify } from "./lib/slug.mjs";

const SRC_DIR = "conteudo/imagens";
const MENU_DIR = "public/menu";
const BRAND_DIR = "public/brand";
const MANIFEST = "src/data/images.manifest.json";

const PRODUCT_WIDTH = 900;
const LOGO_SIZE = 512;
const QUALITY = 80;

const isTrimmed = (slug) => slug === "destaque" || slug.startsWith("destaque-");

async function listFiles(dir) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

// ---------- 1. limpar saídas antigas ----------
for (const f of await listFiles(MENU_DIR)) {
  if (f.endsWith(".webp")) await rm(path.join(MENU_DIR, f));
}
for (const f of await listFiles(BRAND_DIR)) {
  if (/^logo\./i.test(f)) await rm(path.join(BRAND_DIR, f));
}
try {
  await rmdir(BRAND_DIR); // só remove se estiver vazia
} catch {
  /* tem outros arquivos ou não existe: ok */
}

// ---------- 2. ler a pasta de origem ----------
const files = (await listFiles(SRC_DIR)).filter((f) => IMAGE_EXTENSIONS.test(f));

if (files.length === 0) {
  console.log(`Nenhuma imagem encontrada em ${SRC_DIR}/ (o site usará os placeholders).`);
}

const bySlug = new Map();
for (const file of files) {
  const slug = slugify(path.parse(file).name.trim());
  if (!slug) {
    console.error(`ERRO: o nome "${file}" não gera um nome válido. Renomeie o arquivo.`);
    process.exit(1);
  }
  if (bySlug.has(slug)) {
    console.error(
      `ERRO: "${file}" e "${bySlug.get(slug)}" viram o mesmo nome ("${slug}"). Renomeie um deles.`
    );
    process.exit(1);
  }
  bySlug.set(slug, file);
}

await mkdir(MENU_DIR, { recursive: true });

const manifest = {
  _gerado:
    "GERADO por `npm run images` a partir de conteudo/imagens/. Não edite à mão.",
  logo: null,
  images: {},
};

// ---------- 3. processar ----------
let count = 0;
for (const [slug, file] of [...bySlug.entries()].sort()) {
  const source = path.join(SRC_DIR, file);
  const isSvg = /\.svg$/i.test(file);

  // ----- logo -----
  if (slug === "logo") {
    await mkdir(BRAND_DIR, { recursive: true });
    if (isSvg) {
      await copyFile(source, path.join(BRAND_DIR, "logo.svg"));
      manifest.logo = "/brand/logo.svg";
      console.log(`${file}  ->  ${BRAND_DIR}/logo.svg  (logo)`);
    } else {
      const info = await sharp(source)
        .resize({
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 90, alphaQuality: 100 })
        .toFile(path.join(BRAND_DIR, "logo.webp"));
      manifest.logo = "/brand/logo.webp";
      console.log(
        `${file}  ->  ${BRAND_DIR}/logo.webp  (logo, ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`
      );
    }
    continue;
  }

  // ----- foto de produto -----
  if (isSvg) {
    console.warn(`AVISO: "${file}" é SVG e só é aceito como logo. Foto ignorada.`);
    continue;
  }

  const out = path.join(MENU_DIR, `${slug}.webp`);
  let img = sharp(source).flatten({ background: "#ffffff" });
  if (isTrimmed(slug)) {
    img = img.trim({ background: "#ffffff", threshold: 12 });
  }
  const info = await img
    .resize({ width: PRODUCT_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  manifest.images[slug] = `/menu/${slug}.webp`;
  count++;
  console.log(
    `${file}  ->  ${out}  (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`
  );
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `\nPronto: ${count} foto(s) de produto, logo: ${manifest.logo ? "sim" : "não (o site usará a inicial do nome)"}.`
);
