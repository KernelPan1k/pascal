import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HOME_KEYS = [
  "home_intro",
  "home_portrait_image",
  "home_portrait_quote",
  "home_portrait_text",
  "home_chanteur_text",
  "home_dessinateur_text",
  "home_poete_text",
  "home_region_quote",
  "home_region_text",
  "home_cta_title",
  "home_cta_text",
];

async function getSettings() {
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: HOME_KEYS } },
  });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

// Palette tirée de la pochette "Sans motif apparent"
const TEAL = "#6aacbe";
const CREAM = "#ede8d8";

// Fonds sombres
const BG = "#0b1316";
const BG_DEEP = "#111c20";
const BG_SURFACE = "#182428";

// Fonds clairs (alterné)
const LIGHT_BG = "#f5f2ea";
const LIGHT_DEEP = "#edeae0";
const LIGHT_TEXT = "#192428";
const LIGHT_MUTED = "#4a6068";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      {/* ── Hero — SOMBRE ─────────────────────────── */}
      <section
        style={{
          backgroundColor: BG,
          color: CREAM,
          padding: "6rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: `3px solid ${TEAL}`,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          {/* Texte */}
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: TEAL,
                marginBottom: "1.25rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              Besançon — Franche-Comté
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 400,
                letterSpacing: "0.02em",
                lineHeight: 0.95,
                marginBottom: "1.5rem",
                color: CREAM,
                textTransform: "uppercase",
              }}
            >
              Pascal
              <br />
              <span style={{ color: TEAL }}>Mathieu</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "rgba(237,232,216,0.45)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                marginBottom: "2rem",
              }}
            >
              Chanteur · Dessinateur · Poète
            </p>

            {settings.home_intro && (
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(237,232,216,0.6)",
                  lineHeight: 1.8,
                  maxWidth: "480px",
                  marginBottom: "2.5rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {settings.home_intro}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link
                href="/discographie"
                style={{
                  display: "inline-block",
                  backgroundColor: TEAL,
                  color: BG,
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                }}
              >
                Discographie
              </Link>
              <Link
                href="/biographie"
                style={{
                  display: "inline-block",
                  backgroundColor: "transparent",
                  color: CREAM,
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                  border: "1px solid rgba(237,232,216,0.25)",
                }}
              >
                Biographie
              </Link>
            </div>
          </div>

          {/* Photo — effet duotone teal + rayures punk */}
          {settings.home_portrait_image && (
            <div style={{ flex: "0 0 auto" }}>
              <div
                style={{
                  position: "relative",
                  width: "270px",
                  height: "350px",
                  backgroundColor: TEAL,
                  flexShrink: 0,
                }}
              >
                {/* Image en N&B multiply sur fond teal → duotone */}
                <Image
                  src={settings.home_portrait_image}
                  alt="Pascal Mathieu"
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: "grayscale(100%) contrast(1.15) brightness(0.95)",
                    mixBlendMode: "multiply",
                  }}
                  sizes="270px"
                  priority
                />
                {/* Rayures diagonales punk */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.12) 5px, rgba(0,0,0,0.12) 6px)",
                    pointerEvents: "none",
                  }}
                />
                {/* Barre teal en bas */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-12px",
                    left: "0",
                    width: "60%",
                    height: "4px",
                    backgroundColor: CREAM,
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Portrait / Citation — CLAIR ───────────── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: LIGHT_BG,
          color: LIGHT_TEXT,
          borderBottom: `1px solid ${LIGHT_DEEP}`,
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: TEAL,
              marginBottom: "2rem",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
            }}
          >
            Portrait
          </p>
          {settings.home_portrait_quote && (
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                lineHeight: 1.15,
                color: LIGHT_TEXT,
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              {settings.home_portrait_quote}
            </p>
          )}
          {settings.home_portrait_text && (
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: LIGHT_MUTED,
                maxWidth: "640px",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_portrait_text}
            </p>
          )}
        </div>
      </section>

      {/* ── Trois univers — SOMBRE ────────────────── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: BG,
          color: CREAM,
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: TEAL,
                marginBottom: "0.75rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              L&apos;univers
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 400,
                color: CREAM,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Trois arts,
              <br />
              une même voix
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              backgroundColor: "rgba(106,172,190,0.1)",
            }}
          >
            {[
              {
                num: "01",
                title: "Le Chanteur",
                href: "/discographie",
                text: settings.home_chanteur_text,
                cta: "Voir la discographie",
              },
              {
                num: "02",
                title: "Le Dessinateur",
                href: "/biographie",
                text: settings.home_dessinateur_text,
                cta: "Découvrir la biographie",
              },
              {
                num: "03",
                title: "Le Poète",
                href: "/articles",
                text: settings.home_poete_text,
                cta: "Lire les articles",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "3rem 2.5rem",
                  backgroundColor: BG_SURFACE,
                  borderTop: `3px solid ${TEAL}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3.5rem",
                    color: "rgba(106,172,190,0.15)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {item.num}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    color: CREAM,
                    marginBottom: "1rem",
                    fontWeight: 400,
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "rgba(204,201,190,0.6)",
                    marginBottom: "2rem",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.text}
                </p>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: TEAL,
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(106,172,190,0.4)",
                    paddingBottom: "2px",
                  }}
                >
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ancrage géographique — CLAIR ──────────── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: LIGHT_BG,
          color: LIGHT_TEXT,
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: TEAL,
              marginBottom: "2rem",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
            }}
          >
            Besançon &amp; alentours
          </p>
          {settings.home_region_quote && (
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                lineHeight: 1.15,
                color: LIGHT_TEXT,
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              {settings.home_region_quote}
            </p>
          )}
          {settings.home_region_text && (
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: LIGHT_MUTED,
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_region_text}
            </p>
          )}
        </div>
      </section>

      {/* ── CTA — SOMBRE ──────────────────────────── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: BG_DEEP,
          textAlign: "center",
          borderTop: `3px solid ${TEAL}`,
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {settings.home_cta_title && (
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: CREAM,
                marginBottom: "1rem",
                fontWeight: 400,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {settings.home_cta_title}
            </h2>
          )}
          {settings.home_cta_text && (
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(204,201,190,0.55)",
                lineHeight: 1.8,
                marginBottom: "3rem",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_cta_text}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/biographie"
              style={{
                display: "inline-block",
                backgroundColor: TEAL,
                color: BG,
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.875rem 2.25rem",
                textDecoration: "none",
              }}
            >
              La biographie
            </Link>
            <Link
              href="/articles"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: CREAM,
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.875rem 2.25rem",
                textDecoration: "none",
                border: "1px solid rgba(237,232,216,0.25)",
              }}
            >
              Les articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
