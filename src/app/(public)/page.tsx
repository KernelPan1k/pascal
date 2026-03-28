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

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero */}
      <section
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "7rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "3px solid #e8262b",
        }}
      >
        {/* Grain texture overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#e8262b",
              marginBottom: "1rem",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
            }}
          >
            Besançon — Franche-Comté
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 18vw, 13rem)",
              fontWeight: 400,
              letterSpacing: "0.01em",
              lineHeight: 0.9,
              marginBottom: "1.5rem",
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            Pascal
            <br />
            <span style={{ color: "#e8262b" }}>Mathieu</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: settings.home_portrait_image ? "3.5rem" : "2.5rem",
            }}
          >
            Chanteur &nbsp;·&nbsp; Dessinateur &nbsp;·&nbsp; Poète
          </p>

          {/* Portrait */}
          {settings.home_portrait_image && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "3.5rem" }}>
              <div
                style={{
                  position: "relative",
                  width: "260px",
                  height: "340px",
                  flexShrink: 0,
                  outline: "1px solid rgba(255,255,255,0.15)",
                  outlineOffset: "6px",
                }}
              >
                <Image
                  src={settings.home_portrait_image}
                  alt="Pascal Mathieu"
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: "grayscale(100%) contrast(1.4) brightness(0.85)",
                  }}
                  sizes="260px"
                  priority
                />
                {/* Red accent strip */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: "#e8262b",
                  }}
                />
              </div>
            </div>
          )}

          {settings.home_intro && (
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                maxWidth: "580px",
                marginBottom: "3rem",
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
                backgroundColor: "#e8262b",
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "1rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.875rem 2.25rem",
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
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "1rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.875rem 2.25rem",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Biographie
            </Link>
          </div>
        </div>
      </section>

      {/* Portrait / Citation */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "#0d0d0d",
          color: "#e0e0e0",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#e8262b",
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
                lineHeight: 1.2,
                color: "#ffffff",
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
                color: "rgba(208,208,208,0.7)",
                maxWidth: "640px",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_portrait_text}
            </p>
          )}
        </div>
      </section>

      {/* Trois univers */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "#000000",
          color: "#e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#e8262b",
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
                color: "#ffffff",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Trois arts,<br />une même voix
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              backgroundColor: "rgba(255,255,255,0.08)",
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
                  backgroundColor: "#0d0d0d",
                  borderTop: "3px solid #e8262b",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3.5rem",
                    color: "rgba(255,255,255,0.08)",
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
                    color: "#ffffff",
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
                    color: "rgba(208,208,208,0.6)",
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
                    color: "#e8262b",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(232,38,43,0.4)",
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

      {/* Ancrage géographique */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "#0d0d0d",
          color: "#e0e0e0",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#e8262b",
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
                lineHeight: 1.2,
                color: "#ffffff",
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
                color: "rgba(208,208,208,0.55)",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_region_text}
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "#000000",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {settings.home_cta_title && (
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "#ffffff",
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
                color: "rgba(208,208,208,0.55)",
                lineHeight: 1.8,
                marginBottom: "3rem",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.home_cta_text}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/biographie"
              style={{
                display: "inline-block",
                backgroundColor: "#e8262b",
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
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
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "1rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.875rem 2.25rem",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.3)",
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
