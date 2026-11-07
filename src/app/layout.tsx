import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { storeConfig } from "@/data/config";
import { brandFont } from "@/theme/font";
import { themeColorHex, themeStyle } from "@/lib/theme";

export const metadata: Metadata = {
  title: `${storeConfig.name} · Faça seu pedido`,
  description: storeConfig.slogan || `Cardápio e pedidos de ${storeConfig.name}`,
};

export const viewport: Viewport = {
  // Cor da barra do navegador no celular: vem do tema
  themeColor: themeColorHex,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // As cores do tema entram aqui como variáveis CSS (ver src/lib/theme.ts)
    <html lang="pt-BR" className={brandFont.variable} style={themeStyle}>
      <body className="font-sans bg-background text-foreground antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
