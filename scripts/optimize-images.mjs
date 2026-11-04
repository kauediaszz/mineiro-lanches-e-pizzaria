/**
 * Otimiza as fotos da pasta "imagens/" e gera versoes leves em "public/menu/".
 *
 * Uso:  npm run images
 *
 * - Aceita .jpg, .jpeg, .png e .webp
 * - O nome do arquivo de saida vira um "slug" (sem acento, sem espaco):
 *     "homem de ferro.jpg"  ->  public/menu/homem-de-ferro.webp
 * - Reduz pra 900px de largura (suficiente pra celular e desktop)
 * - Fotos com fundo transparente ganham fundo branco
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "imagens";
const OUT_DIR = "public/menu";
const WIDTH = 900;
const QUALITY = 80;

// Fotos em que as bordas brancas devem ser cortadas (o produto ocupa mais espaco)
const TRIM = new Set(["destaque"]);

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f)
);

for (const file of files) {
  const base = path.parse(file).name.trim();
  const slug = slugify(base);
  const out = path.join(OUT_DIR, `${slug}.webp`);

  let img = sharp(path.join(SRC_DIR, file)).flatten({ background: "#ffffff" });

  if (TRIM.has(slug)) {
    img = img.trim({ background: "#ffffff", threshold: 12 });
  }

  const info = await img
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  console.log(
    `${file}  ->  ${out}  (${info.width}x${info.height}, ${Math.round(
      info.size / 1024
    )} KB)`
  );
}
