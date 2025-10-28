import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pascal Mathieu — Chanteur · Dessinateur · Poète",
    template: "%s | Pascal Mathieu",
  },
  description:
    "Site officiel de Pascal Mathieu, artiste pluriel de Besançon. Découvrez son univers musical, poétique et graphique.",
  keywords: ["Pascal Mathieu", "chanteur", "poète", "dessinateur", "Besançon", "Franche-Comté"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfairDisplay.variable} ${lora.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
