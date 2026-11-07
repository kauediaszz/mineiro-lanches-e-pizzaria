/**
 * FONTE DO SITE
 * ---------------------------------------------------------------
 * GERADO a partir do bloco "Fonte" do conteudo/tema.md (veja o AGENTS.md).
 * Não edite à mão: edite o tema.md e peça para a IA regenerar.
 *
 * Regras (o next/font exige que o nome da fonte esteja escrito aqui):
 *  - Use uma fonte do Google Fonts: nomes com espaço levam "_" (Open Sans -> Open_Sans).
 *  - A variável CSS tem que continuar "--font-brand" (o Tailwind usa esse nome).
 *  - Fonte "variável" (ex: Nunito, Inter) pode omitir o 'weight'.
 *    Fonte fixa (ex: Poppins) precisa listar os pesos que ela tem.
 *    O `npm run validar` confere isso.
 */
import { Nunito } from "next/font/google";

export const brandFont = Nunito({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});
