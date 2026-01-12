import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "6rem",
            fontStyle: "italic",
            color: "var(--color-gold)",
            opacity: 0.3,
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            color: "var(--color-midnight)",
            marginBottom: "1rem",
          }}
        >
          Page introuvable
        </h1>
        <p
          style={{
            color: "var(--color-text-light)",
            fontStyle: "italic",
            marginBottom: "2rem",
            lineHeight: 1.7,
          }}
        >
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
