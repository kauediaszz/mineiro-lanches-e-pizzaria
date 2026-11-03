/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Gera um site estatico (HTML/CSS/JS) na pasta "out/".
  // Perfeito pro Cloudflare Pages, ja que o site e 100% front-end.
  output: "export",

  // O otimizador de imagem do Next precisa de servidor, entao desligamos
  // pra usar as imagens direto (compativel com hospedagem estatica).
  images: {
    unoptimized: true,
  },

  // Garante que cada rota vire uma pasta com index.html (ex: /pedido/index.html),
  // o que evita 404 em refresh no Cloudflare Pages.
  trailingSlash: true,
};

export default nextConfig;
