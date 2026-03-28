import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/utils/sanitize";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Biographie",
  description: "Découvrez la biographie de Pascal Mathieu, chanteur, dessinateur et poète de Besançon.",
};

export default async function BiographiePage() {
  const page = await prisma.page.findFirst({
    where: { slug: { in: ["biographie", "biographie/"] } },
  });

  if (!page) notFound();

  const cleanContent = sanitizeHtml(page.content);

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--color-midnight)",
          color: "var(--color-cream)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "1rem",
          }}
        >
          À propos
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
          }}
        >
          Biographie
        </h1>
        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: "var(--color-gold)",
            margin: "1.5rem auto 0",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          className="prose-pascal content-html"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "var(--color-text)",
          }}
        />

      </div>
    </>
  );
}
