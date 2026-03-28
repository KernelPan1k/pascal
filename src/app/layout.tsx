import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
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
    <html lang="fr" className={`${bebasNeue.variable} ${barlow.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
